import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, message } = await req.json();

    if (!phone || !message) {
      return NextResponse.json({ error: 'phone dan message wajib diisi' }, { status: 400 });
    }

    const evolutionUrl = process.env.EVOLUTION_API_URL;
    const evolutionKey = process.env.EVOLUTION_API_KEY;
    const evolutionInstance = process.env.EVOLUTION_INSTANCE_NAME;

    // Pastikan URL selalu menggunakan HTTPS untuk menghindari 301 Redirect
    if (evolutionUrl && evolutionKey && evolutionInstance) {
      // Memastikan URL diawali https dan tanpa trailing slash
      const base = evolutionUrl.replace(/^http:\/\//i, 'https://').replace(/\/+$/, '');
      const endpoint = `${base}/message/sendText/${encodeURIComponent(evolutionInstance)}`;

      const normalizeDigits = (v: string) => String(v || '').replace(/\D/g, '');
      const toE164 = (raw: string) => {
        const d = normalizeDigits(raw);
        if (!d) return '';
        if (d.startsWith('62')) return d;
        if (d.startsWith('0')) return '62' + d.substring(1);
        return d;
      };

      const number = toE164(String(phone));
      if (!number) {
        return NextResponse.json({ error: 'Nomor WhatsApp tidak valid' }, { status: 400 });
      }

      // Request ke Evolution API
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': evolutionKey,
          // Menambahkan User-Agent agar tidak dianggap bot oleh Nginx
          'User-Agent': 'NextJS-Server'
        },
        body: JSON.stringify({
          number,
          text: String(message),
        }),
      });

      const data = await res.json().catch(() => ({}));
      
      // Jika res.ok false, kita kembalikan detail dari server
      if (!res.ok) {
        console.error("Evolution API Error:", { status: res.status, data });
        return NextResponse.json(
          {
            error: 'Gagal kirim pesan via Evolution',
            status: res.status,
            details: data,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ ok: true, provider: 'evolution', data });
    }

    // Fallback: older provider (Fonnte)
    const fonnteToken = process.env.FONNTE_TOKEN;
    if (fonnteToken) {
      const res = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { Authorization: fonnteToken },
        body: new URLSearchParams({
          target: String(phone),
          message: String(message),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: 'Gagal kirim pesan via Fonnte', status: res.status, details: data },
          { status: 500 }
        );
      }
      return NextResponse.json({ ok: true, provider: 'fonnte', data });
    }

    return NextResponse.json(
      { error: 'Gateway WhatsApp belum dikonfigurasi' },
      { status: 500 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}