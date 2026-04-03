'use client';

import { useState } from 'react';
import BottomNav from '@/components/BottomNav';

export default function RekamMedisUser() {
  const history = [
    { date: '18 Maret 2026', title: 'Vaksin FVRCP (Mandatory)', doctor: 'drh. Andi Pratama', action: 'Tindakan: Pemberian Dosis ke-2' },
    { date: '5 Maret 2026', title: 'Check-up & Obat Cacing', doctor: 'drh. Andi Pratama', action: 'Tindakan: Pemeriksaan fisik & Drontal' },
  ];

  return (
    <div className="app">
      <header className="header">
        <style jsx>{`
          .header { padding: 50px 20px 24px; background: linear-gradient(135deg, #1a0f2e 0%, #4a2b8e 100%); display: flex; align-items: center; gap: 16px; border-bottom: 2px solid rgba(255,255,255,0.05); position: sticky; top: 0; z-index: 100; color: #fff; }
          .back-btn { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: #fff; }
          .header-title { font-size: 17px; font-weight: 800; }
        `}</style>
        <button className="back-btn" onClick={() => window.history.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div className="header-title">Riwayat Medis</div>
      </header>

      <div className="scroll">
         <style jsx>{`
          .scroll { flex:1; overflow-y:auto; padding:0 0 100px; }
          .pet-summary { margin: 16px 20px; padding: 24px; background: #fff; border: 1.5px solid var(--border); border-radius: 24px; color: var(--text); display: flex; align-items: center; gap: 16px; box-shadow: 0 8px 30px rgba(142, 82, 252, 0.04); }
          .pet-photo { width: 56px; height: 56px; border-radius: 14px; background: var(--pr-pale); display: flex; align-items: center; justify-content: center; color: var(--pr); }
          .timeline { padding: 0 24px 40px; position: relative; margin-top: 20px; }
          .timeline::before { content: ''; position: absolute; left: 33px; top: 20px; bottom: 0; width: 2px; background: var(--border); }
          .tl-item { display: flex; gap: 20px; margin-bottom: 30px; position: relative; }
          .tl-dot { width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 4px solid var(--border); z-index: 1; flex-shrink: 0; margin-left: 2px; }
          .tl-item.upcoming .tl-dot { border-color: var(--pr); background: var(--pr); box-shadow: 0 0 0 4px var(--pr-pale); }
          .tl-content { flex:1; background: #fff; padding: 16px; border-radius: 18px; border: 1.5px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
          .tl-date { font-size: 11px; font-weight: 700; color: var(--muted); margin-bottom: 4px; text-transform: uppercase; }
          .tl-title { font-size: 15px; font-weight: 800; color: var(--text); }
          .tl-doctor { font-size: 12px; color: var(--muted); margin-top: 4px; display: flex; align-items: center; gap: 4px; }
          .tl-action { font-size: 13px; color: var(--text); margin-top: 8px; font-weight: 500; }
          .upcoming-badge { display: inline-block; padding: 4px 10px; background: var(--pr-pale); color: var(--pr); border-radius: 10px; font-size: 10px; font-weight: 800; margin-bottom: 8px; }
        `}</style>
        
        <div className="pet-summary">
          <div className="pet-photo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.17C10 3.78 8.42 2.68 6.5 3 4.5 3.34 3 5 3 7c0 .83.19 1.6.5 2.29M14 5.17C14 3.78 15.58 2.68 17.5 3c2 .34 3.5 2 3.5 4 0 .83-.19 1.6-.5 2.29M8 14v.01M16 14v.01M11.25 16.25h1.5"/><path d="M4 9.3C3 10.5 2 12 2 14a10 10 0 0020 0c0-2-1-3.5-2-4.7"/></svg>
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>Luna</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Kucing Persia · 2 Tahun</div>
          </div>
        </div>

        <div style={{ padding: '0 24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text)', marginBottom: '12px' }}>Tren Berat Badan (kg)</div>
          <div style={{ background: '#fff', borderRadius: '18px', border: '1.5px solid var(--border)', padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: '12px' }}>
            [ Chart: 3.2, 3.4, 3.5, 3.8, 3.7 ]
          </div>
        </div>

        <div className="timeline">
          <div className="tl-item upcoming">
            <div className="tl-dot"></div>
            <div className="tl-content" style={{ border: '2px solid var(--pr)' }}>
              <div className="upcoming-badge">JADWAL BERIKUTNYA</div>
              <div className="tl-date">18 Maret 2027</div>
              <div className="tl-title">Vaksin Tahunan Rabies (Booster)</div>
              <div className="tl-action">Dihitung otomatis oleh sistem</div>
            </div>
          </div>

          {history.map((item, i) => (
            <div key={i} className="tl-item">
              <div className="tl-dot"></div>
              <div className="tl-content">
                <div className="tl-date">{item.date}</div>
                <div className="tl-title">{item.title}</div>
                <div className="tl-doctor">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  {item.doctor}
                </div>
                <div className="tl-action">{item.action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}




