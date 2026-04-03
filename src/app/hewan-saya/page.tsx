'use client';

import { useState } from 'react';
import BottomNav from '@/components/BottomNav';

export default function HewanSaya() {
  const pets = [
    { id: 1, name: 'Luna', breed: 'Kucing · Persia Mix · Betina', weight: '3.8 kg', age: '2 Th', vaccine: 'H-2', status: 'Vaksin Segera', type: 'cat', selected: true },
    { id: 2, name: 'Coki', breed: 'Anjing · Pomeranian · Jantan', weight: '3.2 kg', age: '4 Th', vaccine: 'Aman', status: 'Vaksin Lengkap', type: 'dog', selected: false },
  ];

  return (
    <div className="app">
      <header className="header">
        <style jsx>{`
          .header { background: var(--ink); padding: 50px 20px 22px; position: relative; overflow: hidden; flex-shrink: 0; }
          .header::after { content: ''; position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); width: 110%; height: 44px; background: var(--bg); border-radius: 50%; }
          .header-top { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1; }
          .header-title { color: #fff; font-size: 18px; font-weight: 800; }
          .header-sub { color: rgba(255,255,255,.5); font-size: 12px; margin-top: 2px; }
          .h-btn { width: 38px; height: 38px; border-radius: 12px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.1); display: flex; align-items: center; justify-content: center; font-size: 17px; cursor: pointer; }
        `}</style>
        <div className="header-top">
          <div>
            <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Hewan Saya <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity:.8 }}><ellipse cx="12" cy="10" r="3"/><path d="M7 22l5-3 5 3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2z"/></svg>
            </div>
            <div className="header-sub">2 hewan terdaftar</div>
          </div>
          <div className="h-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg></div>
        </div>
      </header>

      <div className="scroll">
        <style jsx>{`
          .scroll { flex:1; overflow-y:auto; padding:0 20px 120px; }
          .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; margin-top: 4px; }
          .section-title { font-size: 13px; font-weight: 800; color: var(--ink); }
          .section-link { font-size: 12px; color: var(--pr); font-weight: 800; cursor: pointer; }
          .pet-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
          .pet-card { background: var(--white); border-radius: 18px; border: 1.5px solid var(--border); overflow: hidden; transition: all .2s; cursor: pointer; }
          .pet-card:active { transform: scale(.98); }
          .pet-card.selected { border-color: var(--pr); box-shadow: 0 4px 16px rgba(142,82,252,.15); }
          .pet-card-top { display: flex; align-items: center; gap: 14px; padding: 16px; }
          .pet-avatar { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
          .pa-cat { background: #e8f0ff; }
          .pa-dog { background: #fde8d3; }
          .pet-info { flex: 1; }
          .pet-name { font-size: 16px; font-weight: 800; color: var(--ink); }
          .pet-breed { font-size: 12px; color: var(--muted); margin-top: 2px; }
          .pet-status { display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 800; padding: 3px 9px; border-radius: 20px; margin-top: 6px; }
          .ps-green { background: var(--green-pale); color: var(--green); }
          .ps-red { background: var(--red-pale); color: var(--red); }
          .pet-card-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; border-top: 1.5px solid var(--border); }
          .pcs-item { padding: 11px 8px; text-align: center; border-right: 1px solid var(--border); }
          .pcs-item:last-child { border: none; }
          .pcs-val { font-size: 13.5px; font-weight: 800; color: var(--ink); }
          .pcs-label { font-size: 9.5px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: .3px; margin-top: 2px; }
          
          .action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
          .action-btn { background: var(--white); border-radius: 14px; border: 1.5px solid var(--border); padding: 14px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all .2s; color: var(--ink); text-decoration: none; }
          .action-btn:active { transform: scale(.96); border-color: var(--pr); }
          .ab-icon { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
          .ab-label { font-size: 12.5px; font-weight: 700; }
          .ab-sub { font-size: 10.5px; color: var(--muted); margin-top: 1px; }

          .add-pet-btn { background: var(--white); border-radius: 18px; border: 2px dashed var(--border); padding: 18px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all .2s; margin-bottom: 20px; }
          .add-pet-btn:active { background: var(--pr-pale); border-color: var(--pr); }
        `}</style>

        <div className="section-head">
          <div className="section-title">Daftar Hewan</div>
          <div className="section-link">+ Tambah Hewan</div>
        </div>

        <div className="pet-list">
          {pets.map((pet, i) => (
            <div key={pet.id} className={`pet-card ${pet.selected ? 'selected' : ''} animate-pop stagger-${i + 1}`}>
              <div className="pet-card-top">
                <div className={`pet-avatar ${pet.type === 'cat' ? 'pa-cat' : 'pa-dog'}`}>
                  {pet.type === 'cat' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="6" cy="4" rx="1.8" ry="2.5"/><ellipse cx="18" cy="4" rx="1.8" ry="2.5"/><ellipse cx="2.5" cy="11" rx="1.8" ry="2.5" transform="rotate(-20 2.5 11)"/><ellipse cx="21.5" cy="11" rx="1.8" ry="2.5" transform="rotate(20 21.5 11)"/><path d="M12 10c-3.5 0-7 2.5-7 6.5 0 3 2.5 5.5 7 5.5s7-2.5 7-5.5c0-4-3.5-6.5-7-6.5z"/></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="6" cy="4" rx="1.8" ry="2.5"/><ellipse cx="18" cy="4" rx="1.8" ry="2.5"/><ellipse cx="2.5" cy="11" rx="1.8" ry="2.5" transform="rotate(-20 2.5 11)"/><ellipse cx="21.5" cy="11" rx="1.8" ry="2.5" transform="rotate(20 21.5 11)"/><path d="M12 10c-3.5 0-7 2.5-7 6.5 0 3 2.5 5.5 7 5.5s7-2.5 7-5.5c0-4-3.5-6.5-7-6.5z"/></svg>
                  )}
                </div>
                <div className="pet-info">
                  <div className="pet-name">{pet.name}</div>
                  <div className="pet-breed">{pet.breed}</div>
                  <div className={`pet-status ${pet.status.includes('Segera') ? 'ps-red' : 'ps-green'}`}>
                    {pet.status.includes('Segera') ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight:'3px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight:'3px' }}><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                    {pet.status}
                  </div>
                </div>
                <span style={{ fontSize: '18px', color: 'var(--muted)' }}>›</span>
              </div>
              <div className="pet-card-stats">
                <div className="pcs-item"><div className="pcs-val">{pet.weight}</div><div className="pcs-label">Berat</div></div>
                <div className="pcs-item"><div className="pcs-val">{pet.age}</div><div className="pcs-label">Umur</div></div>
                <div className="pcs-item"><div className="pcs-val" style={{ color: pet.vaccine === 'Aman' ? 'var(--green)' : 'var(--red)' }}>{pet.vaccine}</div><div className="pcs-label">Vaksin</div></div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-head">
          <div className="section-title">Aksi Cepat</div>
        </div>
        <div className="action-grid">
          <a href="/layanan" className="action-btn">
            <div className="ab-icon" style={{ background: 'var(--pr-pale)' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--pr)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
            <div><div className="ab-label">Layanan</div><div className="ab-sub">Lihat fasilitas</div></div>
          </a>
          <a href="/rekam-medis" className="action-btn">
            <div className="ab-icon" style={{ background: 'var(--blue-pale)' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
            <div><div className="ab-label">Rekam Medis</div><div className="ab-sub">Lihat riwayat</div></div>
          </a>
          <a href="/konsultasi" className="action-btn">
            <div className="ab-icon" style={{ background: 'var(--green-pale)' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div>
            <div><div className="ab-label">Konsultasi</div><div className="ab-sub">Tanya dokter</div></div>
          </a>
        </div>

        <div className="add-pet-btn" onClick={() => alert('Fitur tambah hewan akan segera hadir!')}>
          <span style={{ fontSize: '22px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)' }}>Daftarkan Hewan Baru ke Klinik</span>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}




