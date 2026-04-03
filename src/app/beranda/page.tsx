'use client';

import { useRouter } from 'next/navigation';
import UserHeader from '@/components/UserHeader';
import BottomNav from '@/components/BottomNav';

export default function Beranda() {
  const router = useRouter();

  const pets = [
    { name: 'Luna', breed: 'Kucing Persia', status: 'Vaksin Segera!', statusClass: 's-red', icon: 'kucing' },
    { name: 'Coki', breed: 'Pomeranian', status: 'Jadwal H-7', statusClass: 's-yellow', icon: 'anjing' },
    { name: 'Mochi', breed: 'Kelinci Rex', status: 'Aman', statusClass: 's-green', icon: 'kelinci' },
  ];

  return (
    <div className="app bg-light">
      <UserHeader name="Siti Rahayu" />

      <div className="scroll-content">
        <h2 className="section-title">Hewan Peliharaan</h2>
        <div className="pet-list">
          {pets.map((p, i) => (
            <div key={i} className="p-card" onClick={() => router.push('/rekam-medis')}>
              <div className={`p-badge ${p.statusClass}`}>{p.status}</div>
              <div className="p-icon-box">
                {p.icon === 'kucing' ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M12 15s-1.5-1.5-3-1.5m3 1.5s1.5-1.5 3-1.5"/></svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 10a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM12 10a2 2 0 1 1 4 0 2 2 0 1 1-4 0z"/><path d="M12 14v2"/><path d="M10 16a2 2 0 0 0 4 0"/></svg>
                )}
              </div>
              <div className="p-name">{p.name}</div>
              <div className="p-breed">{p.breed}</div>
            </div>
          ))}
        </div>

        <h2 className="section-title">Menu Cepat</h2>
        <div className="quick-grid">
          <div className="q-item" onClick={() => router.push('/layanan')}>
            <div className="q-icon-sq" style={{ background: '#f4eeff', color: '#8e52fc' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="q-label">Layanan Kami</div>
          </div>
          <div className="q-item" onClick={() => router.push('/konsultasi')}>
            <div className="q-icon-sq" style={{ background: '#fbeeff', color: '#d463f2' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div className="q-label">Konsultasi</div>
          </div>
        </div>
      </div>

      <BottomNav />

      <style jsx>{`
        .bg-light { background: #fdfbff; min-height: 100vh; }
        .scroll-content { padding: 32px 0 100px; }
        .section-title { font-size: 16px; font-weight: 900; color: #1a1a1a; padding: 0 28px; margin-bottom: 20px; }

        .pet-list { display: flex; gap: 20px; overflow-x: auto; padding: 10px 28px 30px; scrollbar-width: none; }
        .pet-list::-webkit-scrollbar { display: none; }
        
        .p-card { flex-shrink: 0; width: 150px; background: #fff; border-radius: 28px; padding: 24px 16px; text-align: center; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); position: relative; transition: all 0.3s; cursor: pointer; }
        .p-card:active { transform: scale(0.95); }
        .p-icon-box { width: 72px; height: 72px; border-radius: 24px; background: #f4eeff; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #8e52fc; }
        .p-name { font-size: 17px; font-weight: 800; color: #1a1a1a; }
        .p-breed { font-size: 12px; color: #7a7a7a; font-weight: 600; margin-top: 2px; }

        .p-badge { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); padding: 5px 12px; border-radius: 12px; font-size: 10px; font-weight: 900; color: #fff; white-space: nowrap; box-shadow: 0 6px 16px rgba(0,0,0,0.1); }
        .s-red { background: #ff4757; }
        .s-yellow { background: #ffa502; }
        .s-green { background: #2ed573; }

        .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 0 28px; }
        .q-item { background: #fff; padding: 24px 20px; border-radius: 28px; border: 1.5px solid #f0f0f0; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); cursor: pointer; transition: all 0.3s; }
        .q-item:active { transform: scale(0.96); }
        .q-icon-sq { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .q-label { font-size: 14px; font-weight: 800; color: #1a1a1a; }
      `}</style>
    </div>
  );
}
