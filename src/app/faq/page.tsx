'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

export default function FAQ() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const faqs = [
    {
      q: 'Apa itu PetCare?',
      a: 'PetCare adalah platform digital terintegrasi untuk membantu pemilik hewan mengelola kesehatan, vaksinasi, dan konsultasi medis hewan kesayangan mereka secara cerdas.'
    },
    {
      q: 'Bagaimana cara booking dokter?',
      a: 'Fitur booking saat ini telah diintegrasikan langsung ke dalam layanan konsultasi klinik untuk efisiensi yang lebih baik.'
    },
    {
      q: 'Apakah data rekam medis aman?',
      a: 'Ya, seluruh data rekam medis hewan Anda disimpan secara aman dan hanya dapat diakses oleh Anda dan tenaga medis profesional di klinik kami.'
    },
    {
      q: 'Klinik buka jam berapa?',
      a: 'Klinik kami beroperasi setiap hari Senin - Sabtu pukul 08.00 - 20.00 WIB. Untuk keadaan darurat, silakan hubungi nomor layanan 24 jam kami.'
    }
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app">
      <header className="header">
        <style jsx>{`
          .header { background: var(--bg); padding: 50px 20px 14px; display: flex; align-items: center; gap: 16px; border-bottom: 1.5px solid var(--border); position: sticky; top: 0; z-index: 100; }
          .header-title { font-size: 18px; font-weight: 800; color: var(--ink); }
          .back-btn { width:40px; height:40px; border-radius:12px; background:var(--pr-pale); border:none; display:flex; align-items:center; justify-content:center; color:var(--pr); cursor:pointer; }
        `}</style>
        <button className="back-btn" onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div className="header-title">Bantuan & FAQ</div>
      </header>

      <div className="scroll">
        <style jsx>{`
          .search-box { margin: 20px; background: var(--white); border-radius: 12px; border: 1.5px solid var(--border); padding: 10px 16px; display: flex; align-items: center; gap: 10px; }
          .search-box input { border: none; outline: none; flex: 1; font-size: 14px; color: var(--ink); }
          
          .faq-item { background: var(--white); border-radius: 16px; border: 1.5px solid var(--border); margin: 12px 20px; overflow: hidden; transition: all 0.3s; }
          .faq-question { padding: 16px 20px; font-size: 14px; font-weight: 700; color: var(--ink); display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
          .faq-answer { padding: 0 20px; max-height: 0; overflow: hidden; font-size: 13px; color: var(--muted); line-height: 1.6; transition: all 0.3s ease-out; }
          .faq-item.active .faq-answer { padding-bottom: 20px; max-height: 200px; }
          .faq-item.active { border-color: var(--pr); box-shadow: 0 8px 32px rgba(142,82,252,0.1); }
          .faq-arrow { transition: transform 0.3s; color: var(--pr); font-weight: 800; }
          .faq-item.active .faq-arrow { transform: rotate(90deg); }
        `}</style>

        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Cari bantuan..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {filteredFaqs.map((f, i) => (
          <div key={i} className={`faq-item ${activeIndex === i ? 'active' : ''}`} onClick={() => setActiveIndex(activeIndex === i ? null : i)}>
            <div className="faq-question">{f.q} <span className="faq-arrow">›</span></div>
            <div className="faq-answer">{f.a}</div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

