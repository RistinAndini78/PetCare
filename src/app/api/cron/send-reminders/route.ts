import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const evolutionUrl = process.env.EVOLUTION_API_URL;
  const instanceName = process.env.EVOLUTION_INSTANCE_NAME;
  const apiKey = process.env.EVOLUTION_API_KEY;

  if (!supabaseUrl || !supabaseKey || !evolutionUrl || !instanceName || !apiKey) {
    return NextResponse.json({ error: "Server configuration missing" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data: settings, error: settingsError } = await supabase
      .from('reminder_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (settingsError) throw settingsError;
    if (!settings || !settings.h3_active) {
      return NextResponse.json({ message: "Pengingat H-3 nonaktif." });
    }

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    const dateStr = targetDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

    const { data: targets, error: targetError } = await supabase
      .from('vaccination_schedules')
      .select('*, patients(name, owners(full_name, phone))')
      .eq('next_vaccine_date', dateStr)
      .eq('status', 'scheduled');

    if (targetError) throw targetError;
    if (!targets || targets.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: `Tidak ada jadwal untuk ${dateStr}` });
    }

    let sentCount = 0;

    for (const item of (targets as any[])) {
      const namaPemilik = item.patients?.owners?.full_name || "Pemilik";
      const namaHewan = item.patients?.name || "Hewan";
      const jenisVaksin = item.vaccine_name;
      let phone = item.patients?.owners?.phone;

      if (!phone) continue;
      phone = phone.replace(/^0/, '62');

      const pesan = `Halo Kak ${namaPemilik}! 🐾\n\nIni pengingat dari Klinik PetCare. Si *${namaHewan}* dijadwalkan untuk vaksin *${jenisVaksin}* pada tanggal ${dateStr} (3 hari lagi).`;

      // 6. Request menggunakan Axios dengan paksaan POST
      try {
        const response = await axios({
          method: 'post',
          url: `${evolutionUrl}/message/sendText/${instanceName}`,
          data: {
            number: phone,
            text: pesan
          },
          headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey
          },
          // Mencegah redirect otomatis yang sering mengubah POST menjadi GET
          maxRedirects: 0 
        });

        if (response.status === 200 || response.status === 201) {
          sentCount++;
          await supabase.from('reminder_logs').insert({
            nama_hewan: namaHewan,
            nama_pemilik: namaPemilik,
            jenis_vaksin: jenisVaksin,
            status: 'Terkirim'
          });
        }
      } catch (axiosError: any) {
        // Logging detail error untuk melihat apakah server menolak karena protokol atau API Key
        console.error(`❌ Gagal kirim ke ${phone}:`, axiosError.response?.data || axiosError.message);
      }
    }

    return NextResponse.json({ success: true, sent: sentCount });
  } catch (err: any) {
    console.error("🔥 Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}