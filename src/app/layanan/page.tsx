'use client';

import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Layanan() {
  const router = useRouter();
  const supabase = createClient();
  const [modal, setModal] = useState({ open: false, title: '', content: '' });
  const [jamOperasional, setJamOperasional] = useState('');
  const [loadingHours, setLoadingHours] = useState(true);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const { data, error } = await supabase
          .from('clinic_profile')
          .select('jam_operasional')
          .eq('id', 1)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        if (data) {
          setJamOperasional(data.jam_operasional || '');
        }
      } catch (err) {
        console.error('Error fetching hours:', err);
      } finally {
        setLoadingHours(false);
      }
    };

    fetchHours();
  }, [supabase]);

  const services = [
    {
      title: 'Vaksinasi',
      desc: 'Protokol vaksinasi lengkap dengan pengingat otomatis via WhatsApp.',
      details: 'Kami menyediakan protokol vaksinasi lengkap yang disesuaikan dengan kebutuhan hewan Anda. Sistem kami secara otomatis menghitung jadwal booster berikutnya.',
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg>,
      color: 'var(--pr)',
      pale: 'var(--pr-pale)'
    },
    {
      title: 'Konsultasi',
      desc: 'Tanya jawab langsung dengan dokter hewan berpengalaman.',
      details: 'Diskusi langsung dengan dokter hewan kami mengenai kesehatan, nutrisi, and perilaku hewan kesayangan Anda.',
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>,
      color: 'var(--green)',
      pale: 'var(--green-pale)'
    },
    {
      title: 'Bedah & Rawat',
      desc: 'Tindakan medis profesional dengan fasilitas pemantauan 24/7.',
      details: 'Fasilitas bedah modern and ruang rawat inap yang nyaman dengan pemantauan 24 jam oleh tenaga medis.',
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>,
      color: 'var(--red)',
      pale: 'var(--red-pale)'
    },
    {
      title: 'Grooming',
      desc: 'Perawatan estetika dan kebersihan oleh groomer bersertifikat.',
      details: 'Perawatan kebersihan and kecantikan untuk hewan Anda agar tetap sehat and wangi.',
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10.5h10"/><path d="M7 14h10"/><circle cx="12" cy="12" r="10"/></svg>,
      color: 'var(--sc)',
      pale: 'var(--sc-pale)'
    }
  ];

  return (
    <div className="app">
      <header className="header">
        <style jsx>{`
          .header { background: var(--ink); padding: 50px 20px 22px; position: relative; overflow: hidden; }
          .header::after { content:''; position:absolute; bottom:-20px; left:50%; transform:translateX(-50%); width:110%; height:44px; background:var(--bg); border-radius:50%; }
          .header-title { color:#fff; font-size:18px; font-weight:800; position:relative; z-index:1; }
          .back-btn { width:38px; height:38px; border-radius:12px; background:rgba(255,255,255,0.1); border:none; display:flex; align-items:center; justify-content:center; color:#fff; cursor:pointer; margin-bottom:12px; position:relative; z-index:1; }
        `}</style>
        <button className="back-btn" onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div className="header-title">Layanan & Fasilitas</div>
      </header>

      <div className="scroll" style={{ padding: '20px', paddingBottom: '120px' }}>
        <style jsx>{`
          .service-card { background: var(--white); border-radius: 20px; border: 1.5px solid var(--border); padding: 20px; margin-bottom: 16px; display: flex; gap: 16px; align-items: center; transition: all 0.2s; cursor: pointer; }
          .service-card:active { transform: scale(0.97); border-color: var(--pr); }
          .service-icon { width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
          .service-info h3 { font-size: 16px; font-weight: 800; color: var(--ink); }
          .service-info p { font-size: 12px; color: var(--muted); margin-top: 4px; line-height: 1.4; }

          .info-card { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 24px; padding: 24px; margin-bottom: 24px; color: #fff; box-shadow: 0 12px 24px rgba(0,0,0,0.1); }
          .info-card h3 { font-size: 14px; font-weight: 800; color: #8e52fc; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
          .hour-text { font-size: 13.5px; line-height: 1.6; color: #fff; font-weight: 600; white-space: pre-wrap; }

          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
          .modal-card { background: #fff; border-radius: 24px; padding: 24px; width: 100%; max-width: 400px; }
          .modal-card h2 { font-size: 18px; font-weight: 800; margin-bottom: 12px; }
          .modal-card p { font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 20px; }
          .modal-close { background: var(--pr); color: #fff; width: 100%; padding: 12px; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; }
        `}</style>

        {/* CLINIC INFO CARD */}
        <div className="info-card">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Waktu Operasional
          </h3>
          {loadingHours ? (
            <p style={{ fontSize: '12px', color: '#a19db5' }}>Memuat jadwal...</p>
          ) : !jamOperasional ? (
            <p style={{ fontSize: '12px', color: '#a19db5' }}>Jadwal belum diatur.</p>
          ) : (
            <div className="hour-text">{jamOperasional}</div>
          )}
        </div>

        {services.map((s, i) => (
          <div key={i} className="service-card" onClick={() => setModal({ open: true, title: s.title, content: s.details })}>
            <div className="service-icon" style={{ background: s.pale, color: s.color }}>
              {s.icon}
            </div>
            <div className="service-info">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <div className="modal-overlay" onClick={() => setModal({ ...modal, open: false })}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>{modal.title}</h2>
            <p>{modal.content}</p>
            <button className="modal-close" onClick={() => setModal({ ...modal, open: false })}>Tutup</button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
