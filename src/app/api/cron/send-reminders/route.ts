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
    if (!settings) return NextResponse.json({ error: "Settings not found" }, { status: 404 });

    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

    // 1. Definisikan Target Tanggal & Pesan
    const targets = [];
    
    // Reminder H-7
    if (settings.h7_active) {
      const d7 = new Date(); d7.setDate(d7.getDate() + 7);
      targets.push({ date: d7.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }), type: 'h7' });
    }
    // Reminder H-3
    if (settings.h3_active) {
      const d3 = new Date(); d3.setDate(d3.getDate() + 3);
      targets.push({ date: d3.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }), type: 'h3' });
    }
    // Reminder H-1
    if (settings.h1_active) {
      const d1 = new Date(); d1.setDate(d1.getDate() + 1);
      targets.push({ date: d1.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }), type: 'h1' });
    }

    let totalSent = 0;

    // A. PROSES REMINDER TERJADWAL (H-7, H-3, H-1)
    for (const t of targets) {
      const { data: schedules } = await supabase
        .from('vaccination_schedules')
        .select('*, patients(name, owners(full_name, phone))')
        .eq('next_vaccine_date', t.date)
        .eq('status', 'scheduled');

      if (schedules) {
        for (const item of (schedules as any[])) {
          const sent = await sendWA(item, t.type, t.date, evolutionUrl, instanceName, apiKey, supabase);
          if (sent) totalSent++;
        }
      }
    }

    // B. PROSES VAKSIN TERLAMBAT (LATE)
    if (settings.late_active) {
      const { data: lateSchedules } = await supabase
        .from('vaccination_schedules')
        .select('*, patients(name, owners(full_name, phone))')
        .lt('next_vaccine_date', todayStr)
        .eq('status', 'scheduled');

      if (lateSchedules) {
        for (const item of (lateSchedules as any[])) {
          const sent = await sendWA(item, 'late', item.next_vaccine_date, evolutionUrl, instanceName, apiKey, supabase);
          if (sent) totalSent++;
        }
      }
    }

    return NextResponse.json({ success: true, sent: totalSent });
  } catch (err: any) {
    console.error("🔥 Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function sendWA(item: any, type: string, date: string, evolutionUrl: string, instanceName: string, apiKey: string, supabase: any) {
  const namaPemilik = item.patients?.owners?.full_name || "Pemilik";
  const namaHewan = item.patients?.name || "Hewan";
  const jenisVaksin = item.vaccine_name;
  let phone = item.patients?.owners?.phone;

  if (!phone) return false;
  phone = phone.replace(/^0/, '62');

  let pesan = "";
  if (type === 'h7') pesan = `Halo Kak ${namaPemilik}! 🐾\n\nSi *${namaHewan}* ada jadwal vaksin *${jenisVaksin}* seminggu lagi (tgl ${date}). Yuk persiapkan kesehatannya!`;
  if (type === 'h3') pesan = `Halo Kak ${namaPemilik}! 🐾\n\nPengingat H-3: *${namaHewan}* dijadwalkan vaksin *${jenisVaksin}* pada tanggal ${date}.`;
  if (type === 'h1') pesan = `Halo Kak ${namaPemilik}! 🐾\n\nBesok adalah jadwal vaksin *${jenisVaksin}* untuk *${namaHewan}*. Jangan sampai terlewat ya!`;
  
  // LOGIKA PESAN TERLAMBAT (URGENT)
  if (type === 'late') {
    pesan = `⚠️ *PENGINGAT PENTING* ⚠️\n\nHalo Kak ${namaPemilik}, jadwal vaksinasi *${jenisVaksin}* untuk *${namaHewan}* telah *TERLEWAT* (seharusnya tgl ${date}).\n\nDemi menjaga kekebalan tubuh peliharaan Anda, mohon segera datang ke Klinik PetCare untuk dilakukan vaksinasi susulan.`;
  }

  try {
    const response = await axios({
      method: 'post',
      url: `${evolutionUrl}/message/sendText/${instanceName}`,
      data: { number: phone, text: pesan },
      headers: { 'Content-Type': 'application/json', 'apikey': apiKey },
      maxRedirects: 0 
    });

    if (response.status === 200 || response.status === 201) {
      await supabase.from('reminder_logs').insert({
        nama_hewan: namaHewan,
        nama_pemilik: namaPemilik,
        jenis_vaksin: jenisVaksin,
        status: 'Terkirim'
      });
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}