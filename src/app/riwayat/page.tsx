'use client';

import UserHeader from '@/components/UserHeader';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';

export default function RiwayatMedisUser() {
  const timeline = [
    { 
      date: '18 MARET 2027', 
      title: 'Vaksin Tahunan Rabies (Booster)', 
      doctor: '', 
      action: 'Dihitung otomatis oleh sistem',
      next: true,
      icon: 'bot'
    },
    { 
      date: '18 MARET 2026', 
      title: 'Vaksin FVRCP (Mandatory)', 
      doctor: 'drh. Andi Pratama', 
      action: 'Tindakan: Pemberian Dosis ke-2',
      next: false,
      icon: 'person'
    },
    { 
      date: '5 MARET 2026', 
      title: 'Check-up & Obat Cacing', 
      doctor: 'drh. Andi Pratama', 
      action: 'Tindakan: Pemeriksaan fisik & Drontal',
      next: false,
      icon: 'person'
    }
  ];

  return (
    <div className="app bg-white">
      <UserHeader title="Riwayat Medis" />

      <div className="scroll">
        <div className="content-pad">
          <div className="pet-card">
            <div className="ava-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 10h.01M16 10h.01M12 14v.01M10 16a2 2 0 0 0 4 0"/></svg>
            </div>
            <div>
              <div className="p-name">Luna</div>
              <div className="p-sub">Kucing Persia · 2 Tahun</div>
            </div>
          </div>

          <div className="section-title">Tren Berat Badan (kg)</div>
          <div className="chart-box">
            <div className="chart-line-bg">
              <div className="c-segment"><div className="c-month">Jan</div></div>
              <div className="c-segment"><div className="c-month">Feb</div></div>
              <div className="c-segment"><div className="c-month">Mar</div></div>
              <div className="c-segment"><div className="c-month">Apr</div></div>
              <div className="c-segment active"><div className="c-month">Mei</div></div>
            </div>
          </div>

          <div className="timeline-container">
            {timeline.map((item, i) => (
              <div key={i} className={`t-row ${item.next ? 'is-next' : ''}`}>
                <div className="t-left">
                  <div className="t-dot"></div>
                  {i < timeline.length - 1 && <div className="t-line"></div>}
                </div>
                <div className="t-card">
                  {item.next && <div className="t-badge">JADWAL BERIKUTNYA</div>}
                  <div className="t-date">{item.date}</div>
                  <div className="t-title-txt">{item.title}</div>
                  
                  {item.doctor ? (
                    <div className="t-doc">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'4px'}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      {item.doctor}
                    </div>
                  ) : null}
                  
                  <div className="t-action">
                    {item.action}
                    {item.next && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:'6px'}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
        <div style={{height: '100px'}}></div>
      </div>

      <style jsx>{`
        .bg-white { min-height: 100vh; display: flex; flex-direction: column; background: #fdfbff; }
        .scroll { flex: 1; overflow-y: auto; padding: 24px 20px 100px; }
        .content-pad { padding: 16px; }
        .pet-card { display: flex; align-items: center; gap: 16px; padding: 20px; background: #fff; border: 1.5px solid #ece4ff; border-radius: 20px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(142, 82, 252, 0.04); }
        .ava-box { width: 44px; height: 44px; border-radius: 12px; background: #f4eeff; display: flex; align-items: center; justify-content: center; color: #8e52fc; }
        .p-name { font-size: 16px; font-weight: 800; color: #1a1a1a; margin-bottom: 2px; }
        .p-sub { font-size: 12px; color: #7a7a7a; font-weight: 500; }
        .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #1a1a1a; margin-bottom: 16px; padding-left: 4px; }
        .chart-box { margin-bottom: 32px; padding: 0 4px; }
        .chart-line-bg { display: flex; height: 4px; background: #ece4ff; border-radius: 2px; position: relative; margin-top: 12px; align-items: center; justify-content: space-between; }
        .c-segment { flex: 1; height: 4px; background: transparent; position: relative; border-bottom: 4px solid #8e52fc; margin: 0 4px; }
        .c-month { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); font-size: 9px; font-weight: 800; color: #7a7a7a; letter-spacing: 0.5px; }
        .c-segment.active .c-month { color: #8e52fc; }
        .timeline-container { padding-left: 8px; padding-right: 4px; }
        .t-row { display: flex; gap: 16px; min-height: 100px; position: relative; margin-bottom: 16px; }
        .t-left { display: flex; flex-direction: column; align-items: center; width: 14px; position: relative; margin-top: 16px; }
        .t-dot { width: 14px; height: 14px; border-radius: 50%; background: #ece4ff; border: 3px solid #fff; box-shadow: 0 0 0 2px #ece4ff; position: relative; z-index: 2; }
        .t-line { width: 2px; background: #ece4ff; position: absolute; top: 14px; bottom: -32px; z-index: 1; }
        .is-next .t-dot { background: #8e52fc; border-color: #fdfbff; box-shadow: 0 0 0 2px #8e52fc; }
        .t-card { flex: 1; background: #fff; padding: 20px; border-radius: 16px; border: 1.5px solid #ece4ff; box-shadow: 0 4px 12px rgba(0,0,0,0.02); position: relative; }
        .is-next .t-card { border-color: #8e52fc; background: #fdfbff; }
        .t-badge { display: inline-block; padding: 4px 10px; background: #f4eeff; color: #8e52fc; border-radius: 8px; font-size: 9px; font-weight: 900; letter-spacing: 0.5px; margin-bottom: 12px; }
        .t-date { font-size: 10px; font-weight: 700; color: #a19db5; margin-bottom: 4px; letter-spacing: 0.4px; }
        .t-title-txt { font-size: 14px; font-weight: 800; color: #1a1a1a; margin-bottom: 8px; }
        .t-doc { font-size: 12px; color: #666; font-weight: 500; display: flex; align-items: center; margin-bottom: 6px; }
        .t-action { font-size: 12px; color: #444; font-weight: 500; display: flex; align-items: center; }
      `}</style>
      
      <BottomNav />
    </div>
  );
}
