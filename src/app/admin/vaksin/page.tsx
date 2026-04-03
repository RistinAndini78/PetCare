'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StokVaksin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<null | { name: string; for: string; cur: number; min: number; status: string; harga: string; kadaluarsa: string }>(null);

  const stats = [
    { label: 'TOTAL ITEM', value: 24, border: '#8e52fc' },
    { label: 'STOK AMAN', value: 18, border: '#2ed573' },
    { label: 'STOK MENIPIS', value: 4, border: '#8e52fc' },
    { label: 'STOK KRITIS', value: 2, border: '#ff4757' },
  ];

  const inventory = [
    { name: 'Nobivac Rabies', for: 'Anjing & Kucing', cur: 3, min: 10, status: 'Kritis', harga: 'Rp 150.000', kadaluarsa: 'Des 2025' },
    { name: 'Feligen CRP', for: 'Kucing', cur: 16, min: 8, status: 'Aman', harga: 'Rp 95.000', kadaluarsa: 'Mar 2026' },
  ];

  return (
    <div className="admin-body">
      <AdminSidebar active="vaksin" />
      <main className="main-content">
        <AdminTopbar title="Stok Vaksin & Obat" subtitle="Inventaris & monitor ketersediaan" onSearch={setSearchQuery} />
        
        <div className="scroll-area">
          <div className="warning-banner">
            <div className="wb-left">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div>
                <div className="wb-title">2 Vaksin Stok Kritis!</div>
                <div className="wb-desc">Nobivac Rabies & Vanguard Plus 5 perlu segera di-restock.</div>
              </div>
            </div>
            <button className="po-btn">Buat PO</button>
          </div>

          <div className="metrics-grid">
            {stats.map((s, i) => (
              <div key={i} className="m-card" style={{ borderTop: `4px solid ${s.border}` }}>
                <span className="m-label">{s.label}</span>
                <div className="m-val">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="data-card">
            <div className="card-top-flex">
              <h2 className="title-text">Inventaris Vaksin &<br/>Obat</h2>
              <Link href="/admin/vaksin/tambah" className="add-btn-huge">
                + Tambah Stok
              </Link>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>PRODUK</th>
                    <th>KETERSEDIAAN</th>
                    <th>STATUS</th>
                    <th>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((inv, i) => {
                    const pct = Math.min(100, (inv.cur / (inv.min * 2)) * 100);
                    const color = inv.status === 'Kritis' ? '#ff4757' : '#2ed573';
                    
                    return (
                      <tr key={i}>
                        <td>
                          <div className="p-name">{inv.name}</div>
                          <div className="p-sub">{inv.for}</div>
                        </td>
                        <td>
                          <div className="p-bar-bg">
                            <div className="p-bar-fill" style={{ width: `${pct}%`, background: color }}></div>
                          </div>
                          <div className="p-stat" style={{ color }}>{inv.cur} Dosis / Min. {inv.min}</div>
                        </td>
                        <td>
                          <span className={`badge ${inv.status === 'Kritis' ? 's-red' : 's-green'}`}>{inv.status}</span>
                        </td>
                        <td>
                          {inv.status === 'Kritis' ? (
                            <Link href="/admin/vaksin/tambah" className="act-btn primary">+ Restock</Link>
                          ) : (
                            <button className="act-btn outline" onClick={() => setModal(inv)}>Detail</button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setModal(null)}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f0fff4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2ed573" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 900, color: '#1a1a1a' }}>{modal.name}</div>
                <div style={{ fontSize: '13px', color: '#a19db5', marginTop: '2px' }}>{modal.for}</div>
              </div>
            </div>
            {[
              { label: 'Stok Saat Ini', value: `${modal.cur} Dosis` },
              { label: 'Stok Minimal', value: `${modal.min} Dosis` },
              { label: 'Status', value: modal.status },
              { label: 'Harga / Dosis', value: modal.harga },
              { label: 'Kadaluarsa', value: modal.kadaluarsa },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f7f3ff' }}>
                <span style={{ fontSize: '13px', color: '#8a80a0', fontWeight: 600 }}>{row.label}</span>
                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 800 }}>{row.value}</span>
              </div>
            ))}
            <button style={{ width: '100%', padding: '13px', marginTop: '20px', background: '#8e52fc', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }} onClick={() => setModal(null)}>
              Tutup
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 32px; }

        .warning-banner { background: #ff6b81; border-radius: 20px; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; color: #fff; margin-bottom: 24px; box-shadow: 0 10px 24px rgba(255, 71, 87, 0.2); }
        .wb-left { display: flex; align-items: center; gap: 16px; }
        .wb-title { font-size: 16px; font-weight: 800; }
        .wb-desc { font-size: 13.5px; font-weight: 500; opacity: 0.9; margin-top: 2px; }
        .po-btn { background: rgba(255,255,255,0.25); color: #fff; border: none; padding: 10px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .po-btn:hover { background: rgba(255,255,255,0.35); }

        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
        .m-card { background: #fff; padding: 24px; border-radius: 16px; border: 1.5px solid #f0f0f0; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .m-label { font-size: 10.5px; font-weight: 800; color: #666; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px; }
        .m-val { font-size: 32px; font-weight: 900; color: #1a1a1a; letter-spacing: -1px; }

        .data-card { background: #fff; border-radius: 28px; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); overflow: hidden; margin-bottom: 40px; }
        .card-top-flex { padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #f0f0f0; gap: 40px; }
        .title-text { font-size: 15px; font-weight: 800; color: #1a1a1a; line-height: 1.3; min-width: 150px; }
        .add-btn-huge { flex: 1; background: #8e52fc; color: #fff; border-radius: 12px; border: none; height: 44px; display: flex; align-items: center; justify-content: center; font-size: 13.5px; font-weight: 800; cursor: pointer; }
        
        .table-container { width: 100%; }
        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 16px 32px; text-align: left; font-size: 10.5px; font-weight: 900; color: #666; text-transform: uppercase; background: #fdfbff; border-bottom: 1.5px solid #f0f0f0; letter-spacing: 0.5px; }
        tbody td { padding: 20px 32px; font-size: 13.5px; color: #1a1a1a; border-bottom: 1px solid #f9f7ff; vertical-align: middle; }

        .p-name { font-weight: 800; font-size: 14.5px; color: #1a1a1a; margin-bottom: 4px; }
        .p-sub { font-size: 12.5px; color: #a19db5; font-weight: 500; }

        .p-bar-bg { width: 100%; max-width: 180px; height: 6px; background: #ece4ff; border-radius: 3px; overflow: hidden; margin-bottom: 8px; }
        .p-bar-fill { height: 100%; border-radius: 3px; }
        .p-stat { font-size: 11.5px; font-weight: 800; letter-spacing: 0.3px; }

        .badge { padding: 6px 14px; border-radius: 12px; font-size: 11px; font-weight: 800; display: inline-block; }
        .s-red { background: #fff5f5; color: #ff4757; }
        .s-green { background: #f0fff4; color: #2ed573; }

        .act-btn { padding: 8px 24px; border-radius: 12px; font-size: 13px; font-weight: 800; cursor: pointer; transition: all 0.2s; min-width: 120px; }
        .act-btn.primary { background: #8e52fc; color: #fff; border: none; }
        .act-btn.outline { background: #fff; border: 1.5px solid #ece4ff; color: #1a1a1a; }
      `}</style>
    </div>
  );
}
