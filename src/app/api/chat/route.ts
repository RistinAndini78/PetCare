import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'API Chat is active' });
}

export async function POST(req: NextRequest) {
  console.log('--- Incoming POST request to /api/chat ---');
  try {
    const { message } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key Gemini belum dikonfigurasi di .env.local' },
        { status: 500 }
      );
    }

    const systemPrompt = `Anda adalah asisten AI dari klinik hewan "PetCare". 
Tugas Anda adalah memberikan diagnosa awal berdasarkan gejala yang diberikan pemilik hewan. 
Berikan jawaban yang ramah, informatif, dan selalu sarankan untuk membawa hewan ke klinik jika gejalanya serius.
Jangan memberikan resep obat keras secara langsung. Berikan jawaban yang ringkas (maksimal 2-3 paragraf).

Gejala dari pengguna: "${message}"`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
        }),
      }
    );

    const data = await res.json();
    console.log('Gemini status:', res.status);
    console.log('Gemini response:', JSON.stringify(data).slice(0, 500));

    if (!res.ok) {
      const errMsg = data?.error?.message || 'Gemini API error';
      const errCode = data?.error?.code || res.status;
      return NextResponse.json(
        { error: `Gemini Error [${errCode}]: ${errMsg}` },
        { status: 500 }
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || 'Maaf, AI tidak dapat memberikan jawaban saat ini.';
    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error('Fetch error:', error.message);
    return NextResponse.json(
      { error: `Network error: ${error.message}` },
      { status: 500 }
    );
  }
}
