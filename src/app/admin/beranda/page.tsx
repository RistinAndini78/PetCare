'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import Link from 'next/link';

export default function AdminBeranda() {
  const [searchQuery, setSearchQuery] = useState('');
  const [adminName, setAdminName] = useState('drh. Andi Pratama');

  useEffect(() => {
    const storedUser = localStorage.getItem('petcare_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAdminName(user.name);
      } catch (e) {}
    }
  }, []);

  const patients = [
    { id: '#P-001', owner: 'Siti Rahayu', pet: 'Luna (Kucing)', treatment: 'Vaksin Rabies', status: 'Belum Datang', statusClass: 's-wait' },
    { id: '#P-002', owner: 'Rudi Santoso', pet: 'Buddy (Anjing)', treatment: 'Check-up Rutin', status: 'Selesai', statusClass: 's-done' },
  ];

  const filteredPatients = patients.filter(p => 
    p.owner.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.pet.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-body">
      <AdminSidebar active="beranda" />
      
      <main className="main-content">
        <AdminTopbar title="Dashboard Utama" name={adminName} onSearch={setSearchQuery} />
        
        <div className="scroll-area">
          <div className="metrics-grid">
            <div className="m-card m-purple">
              <span className="m-label">Total Pasien</span>
              <div className="m-val">150</div>
              <span className="m-sub">+12 bulan ini</span>
            </div>
            <div className="m-card m-red">
              <span className="m-label">Jatuh Tempo</span>
              <div className="m-val">5</div>
              <span className="m-sub">Hari ini</span>
            </div>
            <div className="m-card m-green chart-col">
              <span className="m-label">Kunjungan Bulanan</span>
              <div className="mini-chart">
                {[20, 35, 50, 40, 70, 45, 60].map((h, i) => (
                  <div key={i} className="chart-item">
                    <div className="bar" style={{ height: `${h}%` }}></div>
                    <span className="label">{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link href="/admin/rekam-medis/tambah" className="banner-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Input Rekam Medis</span>
          </Link>

          <div className="data-card">
            <div className="card-inner">
              <table>
                <thead>
                  <tr>
                    <th>ID Pasien</th>
                    <th>Nama Pemilik</th>
                    <th>Nama Hewan</th>
                    <th>Jenis Tindakan</th>
                    <th>Status</th>
                    <th className="text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-bold">{p.id}</td>
                      <td>{p.owner}</td>
                      <td>{p.pet}</td>
                      <td>{p.treatment}</td>
                      <td><span className={`badge ${p.statusClass}`}>{p.status}</span></td>
                      <td className="text-right">
                        <div className="action-row">
                          <button className="a-btn a-wa"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></button>
                          <button className="a-btn a-edit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ai-card">
            <div className="ai-head">
              <div className="ai-title">Predictive Reminder AI</div>
              <div className="live-tag">Live</div>
            </div>
            <div className="reminder-list">
              {[
                { n: 'Luna', t: 'Kucing', p: 'Vaksin Rabies', d: '2 hari', c: '#ff4757' },
                { n: 'Coki', t: 'Anjing', p: 'DHPPi Booster', d: '6 hari', c: '#ffa502' },
                { n: 'Max', t: 'Anjing', p: 'Leptospira', d: '12 hari', c: '#ff9f43' },
                { n: 'Buddy', t: 'Anjing', p: 'Bordetella', d: '20 hari', c: '#2ed573' },
                { n: 'Mochi', t: 'Kucing', p: 'FVRCP', d: '3 bln', c: '#1dd1a1' }
              ].map((r, i) => (
                <div key={i} className="r-item">
                  <div className="dot" style={{ background: r.c }}></div>
                  <div className="info">
                    <div className="name">{r.n} — {r.t}</div>
                    <div className="proc">{r.p}</div>
                  </div>
                  <div className="days" style={{ color: r.c }}>{r.d}</div>
                </div>
              ))}
            </div>
            <button className="ai-btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span>Kirim Semua Reminder</span>
            </button>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 32px; overflow-y: auto; }

        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
        .m-card { background: #fff; padding: 24px; border-radius: 20px; border: 1.5px solid #f0f0f0; }
        .m-purple { border-color: #8e52fc; }
        .m-red { border-color: #ff4757; }
        .m-green { border-color: #2ed573; }
        .chart-col { grid-column: span 2; display: flex; flex-direction: column; gap: 12px; }
        
        .m-label { font-size: 11px; font-weight: 800; color: #a19db5; text-transform: uppercase; letter-spacing: 0.5px; }
        .m-val { font-size: 32px; font-weight: 900; color: #1a1a1a; margin-top: 4px; }
        .m-sub { font-size: 11.5px; color: #7a7a7a; font-weight: 600; }

        .mini-chart { display: flex; align-items: flex-end; gap: 12px; height: 60px; margin-top: 4px; }
        .chart-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .bar { width: 100%; border-radius: 10px 10px 0 0; background: linear-gradient(0deg, #8e52fc 0%, #d463f2 100%); min-height: 4px; }
        .label { font-size: 10px; font-weight: 700; color: #a19db5; }

        .banner-btn { width: 100%; background: linear-gradient(135deg, #8e52fc 0%, #c084fc 100%); padding: 14px 20px; border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #fff; text-decoration: none; font-size: 15px; font-weight: 800; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(142, 82, 252, 0.2); transition: all 0.25s; }
        .banner-btn:hover { background: linear-gradient(135deg, #7a3eeb 0%, #a86df0 100%); transform: translateY(-2px); box-shadow: 0 12px 28px rgba(142, 82, 252, 0.3); }

        .data-card { background: #fff; border-radius: 24px; border: 1.5px solid #f0f0f0; overflow: hidden; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 18px 24px; text-align: left; font-size: 11.5px; font-weight: 800; color: #a19db5; text-transform: uppercase; border-bottom: 1.5px solid #f9f7ff; }
        tbody td { padding: 18px 24px; font-size: 14.5px; color: #1a1a1a; border-bottom: 1px solid #f9f7ff; }
        .fw-bold { font-weight: 700; color: #8e52fc; }
        
        .badge { padding: 6px 14px; border-radius: 12px; font-size: 11.5px; font-weight: 800; }
        .s-wait { background: #fff9e6; color: #ffa502; }
        .s-done { background: #f0fff4; color: #2ed573; }
        
        .action-row { display: flex; gap: 8px; justify-content: flex-end; }
        .a-btn { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: all 0.2s; }
        .a-wa { background: #f0fff4; color: #2ed573; }
        .a-wa:hover { background: #2ed573; color: #fff; }
        .a-edit { background: #f4eeff; color: #8e52fc; }
        .a-edit:hover { background: #8e52fc; color: #fff; }

        .ai-card { background: #fff; border-radius: 24px; border: 1.5px solid #f0f0f0; padding: 24px; }
        .ai-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .ai-title { font-size: 15px; font-weight: 800; color: #1a1a1a; }
        .live-tag { padding: 4px 10px; background: #fff5f5; color: #ff9f43; border-radius: 10px; font-size: 10px; font-weight: 900; text-transform: uppercase; }
        
        .reminder-list { display: flex; flex-direction: column; gap: 2px; margin-bottom: 24px; }
        .r-item { display: flex; align-items: center; gap: 16px; padding: 14px 4px; border-bottom: 1px solid #f9f7ff; }
        .dot { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 0 4px rgba(0,0,0,0.03); }
        .info { flex: 1; }
        .name { font-size: 14px; font-weight: 700; color: #1a1a1a; }
        .proc { font-size: 12px; color: #a19db5; font-weight: 600; margin-top: 1px; }
        .days { font-size: 12.5px; font-weight: 800; }

        .ai-btn-primary { width: 100%; height: 56px; background: #8e52fc; border-radius: 20px; display: flex; align-items: center; justify-content: center; gap: 12px; color: #fff; border: none; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.25s; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.2); }
        .ai-btn-primary:hover { background: #7a3eeb; transform: translateY(-2px); box-shadow: 0 14px 40px rgba(142, 82, 252, 0.3); }
        .text-right { text-align: right; }
      `}</style>
    </div>
  );
}
