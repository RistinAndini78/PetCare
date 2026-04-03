'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import StatCard from '@/components/StatCard';

export default function ReminderAI() {
  const [searchQuery, setSearchQuery] = useState('');
  const [toggles, setToggles] = useState({
    h7: true,
    h3: true,
    h1: true,
    late: true,
    activation: true,
  });

  const stats = [
    { label: 'Terkirim Bulan Ini', value: 89, sub: 'Via WA & SMS', type: 'yellow' as const },
    { label: 'Tingkat Dibaca', value: '94%', sub: 'Sangat tinggi', type: 'green' as const },
    { label: 'Ditindaklanjuti', value: '75%', sub: 'Booking setelah reminder', type: 'blue' as const },
    { label: 'Auto-Terkirim AI', value: 71, sub: 'Tanpa intervensi manual', type: 'yellow' as const },
  ];

  const logs = [
    { name: 'Luna', owner: 'Siti R.', vaccine: 'Rabies', channel: 'WhatsApp', status: 'Dibaca', time: '16 Mar · 09.00', icon: 'cat' },
    { name: 'Buddy', owner: 'Rudi S.', vaccine: 'Bordetella', channel: 'WhatsApp', status: 'Dibaca', time: '16 Mar · 09.00', icon: 'dog' },
    { name: 'Coki', owner: 'Adi N.', vaccine: 'Leptospira', channel: 'SMS', status: 'Terkirim', time: '15 Mar · 10.00', icon: 'dog' },
    { name: 'Mochi', owner: 'Hana P.', vaccine: 'FVRCP', channel: 'WhatsApp', status: 'Belum dibaca', time: '14 Mar · 09.00', icon: 'cat' },
  ];

  const toggleHandler = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="admin-body">
      <AdminSidebar active="reminder" />
      <main className="main-admin">
        <AdminTopbar title="Reminder AI — Predictive" name="drh. Andi Pratama" onSearch={setSearchQuery} />
        
        <div className="content">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px' }}>
            <div className="card">
              <div className="card-head">
                <div className="card-title">Log Reminder Terkirim</div>
                <button className="btn btn-outline">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Hewan / Pemilik</th>
                      <th>Vaksin</th>
                      <th>Channel</th>
                      <th>Status</th>
                      <th>Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--pr-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pr)' }}>
                              {log.icon === 'cat' ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5C7.58 5 4 8.13 4 12c0 3.87 3.58 7 8 7s8-3.13 8-7c0-3.87-3.58-7-8-7z"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg>
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.17C10 3.78 8.42 2.68 6.5 3 4.5 3.34 3 5 3 7c0 .83.19 1.6.5 2.29M14 5.17C14 3.78 15.58 2.68 17.5 3c2 .34 3.5 2 3.5 4 0 .83-.19 1.6-.5 2.29"/></svg>
                              )}
                            </div>
                            <div><div style={{ fontWeight: 700, fontSize: '12.5px' }}>{log.name}</div><div style={{ fontSize: '11px', color: 'var(--muted)' }}>{log.owner}</div></div>
                          </div>
                        </td>
                        <td style={{ fontSize: '12.5px' }}>{log.vaccine}</td>
                        <td><span className="badge b-green">{log.channel}</span></td>
                        <td><span className={`badge ${log.status === 'Dibaca' ? 'b-green' : 'b-blue'}`}>{log.status}</span></td>
                        <td style={{ fontSize: '11px', color: 'var(--muted)' }}>{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-head"><div className="card-title">Konfigurasi Aturan Pengiriman</div></div>
              <div style={{ padding: '14px' }}>
                <RuleToggle label="Reminder H-7" sub="1 minggu sebelum jatuh tempo" active={toggles.h7} onToggle={() => toggleHandler('h7')} icon="bell" />
                <RuleToggle label="Reminder H-3" sub="3 hari sebelum" active={toggles.h3} onToggle={() => toggleHandler('h3')} icon="bell" />
                <RuleToggle label="Reminder H-1" sub="Sehari sebelum vaksin" active={toggles.h1} onToggle={() => toggleHandler('h1')} icon="alert" />
                <RuleToggle label="Vaksin Terlambat" sub="Kirim ulang tiap 3 hari" active={toggles.late} onToggle={() => toggleHandler('late')} icon="alert" />
                <RuleToggle label="Aktivasi Akun Pemilik" sub="Saat pemilik baru terdaftar" active={toggles.activation} onToggle={() => toggleHandler('activation')} icon="message" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-admin { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .content { padding: 32px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
        .card { background: #fff; border-radius: 20px; border: 1.5px solid #f0f0f0; overflow: hidden; }
        .card-head { padding: 16px 20px; border-bottom: 1.5px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; }
        .card-title { font-size: 14px; font-weight: 800; color: #1a1a1a; }
        .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all .2s; border: none; }
        .btn-outline { background: #fdfbff; border: 1.5px solid #ece4ff; color: #8e52fc; }
        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 12px 16px; text-align: left; font-size: 10px; font-weight: 900; color: #666; text-transform: uppercase; background: #fdfbff; border-bottom: 1.5px solid #f0f0f0; }
        tbody td { padding: 14px 16px; font-size: 12.5px; color: #1a1a1a; border-bottom: 1px solid #f9f7ff; vertical-align: middle; }
        .badge { padding: 4px 10px; border-radius: 8px; font-size: 10.5px; font-weight: 700; display: inline-block; }
        .b-green { background: #f0fff4; color: #2ed573; }
        .b-blue { background: #f0f8ff; color: #1e90ff; }
        .toggle { width:38px; height:22px; border-radius:20px; position:relative; cursor:pointer; flex-shrink:0; transition:background .2s; }
        .toggle.on { background:#8e52fc; }
        .toggle.off { background:#d1d5db; }
        .toggle-knob { width:16px; height:16px; border-radius:50%; background:#fff; position:absolute; top:3px; transition:all .2s; box-shadow:0 1px 3px rgba(0,0,0,.2); }
        .toggle.on .toggle-knob { right:3px; left:auto; }
        .toggle.off .toggle-knob { left:3px; right:auto; }
      `}</style>
    </div>
  );
}

function RuleToggle({ label, sub, active, onToggle, icon }: { label: string, sub: string, active: boolean, onToggle: () => void, icon: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg)', borderRadius: '11px', border: '1.5px solid var(--border)', marginBottom: '8px' }}>
      <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'var(--pr-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pr)' }}>
        {icon === 'bell' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        ) : icon === 'alert' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{sub}</div>
      </div>
      <div className={`toggle ${active ? 'on' : 'off'}`} onClick={onToggle}>
        <div className="toggle-knob"></div>
      </div>
    </div>
  );
}




