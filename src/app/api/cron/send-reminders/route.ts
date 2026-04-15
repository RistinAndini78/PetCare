import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  // 1. Validasi Environment Variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const fonnteToken = process.env.FONNTE_TOKEN;

  if (!supabaseUrl || !supabaseKey || !fonnteToken) {
    console.error("❌ Variabel lingkungan tidak ditemukan!");
    return NextResponse.json({ error: "Server configuration missing" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 2. Ambil Pengaturan Reminder
    const { data: settings, error: settingsError } = await supabase
      .from('reminder_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (settingsError || !settings?.h3_active) {
      return NextResponse.json({ message: "Pengingat H-3 nonaktif." });
    }

    // 3. Tentukan Tanggal Target (Hari ini + 3 hari)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    const dateStr = targetDate.toISOString().split('T')[0];

    // 4. Cari jadwal vaksin
    const { data: targets, error: targetError } = await supabase
      .from('vaccination_schedules')
      .select('*, patients(name, owners(full_name, phone))')
      .eq('next_vaccine_date', dateStr)
      .eq('status', 'scheduled');

    if (targetError) throw targetError;
    if (!targets || targets.length === 0) {
      console.log(`ℹ️ Tidak ada jadwal untuk tanggal ${dateStr}`);
      return NextResponse.json({ success: true, sent: 0 });
    }

    let sentCount = 0;

    // 5. Looping Pengiriman
    for (const item of (targets as any[])) {
      const namaPemilik = item.patients?.owners?.full_name || "Pemilik";
      const namaHewan = item.patients?.name || "Hewan";
      const jenisVaksin = item.vaccine_name;
      const phone = item.patients?.owners?.phone;

      if (!phone) {
        console.warn(`⚠️ Hewan ${namaHewan} tidak punya nomor HP pemilik.`);
        continue;
      }

      const pesan = `Halo Kak ${namaPemilik}! 🐾\n\nIni pengingat dari Klinik PetCare. Si *${namaHewan}* dijadwalkan untuk vaksin *${jenisVaksin}* pada tanggal ${dateStr} (3 hari lagi).\n\nSampai jumpa di klinik!`;

      console.log(`LOG: Mengirim pesan ke ${phone}...`);

      // 6. PERBAIKAN: Mengirim ke Fonnte dengan Header Content-Type yang eksplisit
      const responseFonnte = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 
          'Authorization': fonnteToken,
          // Beberapa environment butuh Content-Type ini agar URLSearchParams terbaca
          'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body: new URLSearchParams({
          target: phone,
          message: pesan,
        }).toString(), // Pastikan diubah menjadi string
      });

      const resultFonnte = await responseFonnte.json();
      console.log("Respon API Fonnte:", resultFonnte);

      if (resultFonnte.status === true) {
        sentCount++;
        // 7. Catat ke Log Supabase
        await supabase.from('reminder_logs').insert({
          nama_hewan: namaHewan,
          nama_pemilik: namaPemilik,
          jenis_vaksin: jenisVaksin,
          status: 'Terkirim'
        });
      } else {
        console.error(`❌ Fonnte gagal kirim ke ${phone}:`, resultFonnte.reason);
      }
    }

    return NextResponse.json({ success: true, sent: sentCount });
  } catch (err: any) {
    console.error("🔥 Server Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}