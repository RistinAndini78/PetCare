import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. Ambil Pengaturan (Apakah H-3 aktif?)
    const { data: settings } = await supabase
      .from('reminder_settings')
      .select('h3_active')
      .single();

    if (!settings?.h3_active) {
      return NextResponse.json({ message: 'Fitur H-3 nonaktif' });
    }

    // 2. LOGIKA TANGGAL: Cari pasien yang jadwal_vaksinnya tepat 3 hari lagi
    // Kita hitung tanggal target (Hari ini + 3 hari)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    const targetString = targetDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // 3. Ambil data pasien dari tabel 'pasien' atau 'jadwal_vaksin'
    // Asumsi tabel kamu bernama 'pasien_vaksin'
    const { data: pasienTarget, error: dbError } = await supabase
      .from('pasien_vaksin') 
      .select('nama_hewan, nama_pemilik, nomor_wa, jenis_vaksin, tanggal_vaksin')
      .eq('tanggal_vaksin', targetString); // Filter hanya yang H-3

    if (dbError) throw dbError;

    if (!pasienTarget || pasienTarget.length === 0) {
      return NextResponse.json({ message: 'Tidak ada jadwal vaksin untuk H-3 hari ini.' });
    }

    // 4. Proses Pengiriman (Looping)
    const logs = [];
    for (const p of pasienTarget) {
      // Di sini kamu panggil fungsi WhatsApp Gateway (misal Fonnte/Wablas)
      // await sendWhatsApp(p.nomor_wa, `Halo ${p.nama_pemilik}...`);

      logs.push({
        nama_hewan: p.nama_hewan,
        nama_pemilik: p.nama_pemilik,
        jenis_vaksin: p.jenis_vaksin,
        channel: 'WhatsApp',
        status: 'Terkirim'
      });
    }

    // 5. Catat semua ke reminder_logs agar muncul di Dashboard Admin kamu
    await supabase.from('reminder_logs').insert(logs);

    return NextResponse.json({ 
      success: true, 
      count: pasienTarget.length,
      message: `${pasienTarget.length} reminder berhasil diproses.` 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}