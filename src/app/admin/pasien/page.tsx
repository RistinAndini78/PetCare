'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';

export default function ManajemenPasien() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*, owners(full_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'TOTAL PASIEN', value: patients.length, border: '#8e52fc' },
    { label: 'VAKSIN TERLAMBAT', value: 0, border: '#ff4757' },
    { label: 'VAKSIN SEGERA', value: 0, border: '#c084fc' },
    { label: 'KUNJUNGAN BARU', value: patients.length, border: '#1e90ff' },
  ];

  const filteredPatients = patients.filter(p => 
    (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (p.owners?.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (p.breed?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-body">
      <AdminSidebar active="pasien" />
      <main className="main-content">
        <div className="topbar">
          <div className="t-left">
            <h1 className="t-title">Manajemen Pasien</h1>
            <p className="t-sub">Kelola data hewan dan pemilik</p>
          </div>
          <div className="t-right">
            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Cari nama/pemilik..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>
        
        <div className="scroll-area">
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
              <h2 className="title-text">Daftar Pasien<br/>Terdaftar</h2>
              <Link href="/admin/pasien/tambah" className="add-btn-huge">
                + Tambah Pasien
              </Link>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>HEWAN & PEMILIK</th>
                    <th>JENIS / RAS</th>
                    <th>STATUS VAKSIN</th>
                    <th>TERAKHIR</th>
                    <th className="text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                        Memuat data pasien...
                      </td>
                    </tr>
                  ) : filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                        Belum ada data pasien.
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="profile-cell">
                            <div className="name-box">
                              <div className="p-name">{p.name}</div>
                              <div className="o-name">{p.owners?.full_name || 'Tanpa Pemilik'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-val">{p.species} · {p.breed || '---'}</td>
                        <td><span className={`badge s-green`}>Aman</span></td>
                        <td className="text-val">{p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : '---'}</td>
                        <td className="text-right">
                          <button className="d-btn">Detail</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 32px; }

        .topbar { height: 80px; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; background: #fff; border-bottom: 1.5px solid #f0f0f0; }
        .t-title { font-size: 18px; font-weight: 900; color: #1a1a1a; letter-spacing: -0.3px; }
        .t-sub { font-size: 12px; color: #a19db5; font-weight: 600; margin-top: 2px; }
        
        .search-box { position: relative; width: 280px; }
        .search-box svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #a19db5; }
        .search-box input { width: 100%; padding: 12px 16px 12px 42px; background: #fdfbff; border: 1.5px solid #ece4ff; border-radius: 12px; font-size: 13px; outline: none; transition: all 0.2s; font-weight: 600; font-family: inherit; }
        .search-box input:focus { border-color: #8e52fc; background: #fff; }

        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
        .m-card { background: #fff; padding: 24px; border-radius: 16px; border: 1.5px solid #f0f0f0; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .m-label { font-size: 10.5px; font-weight: 800; color: #666; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px; }
        .m-val { font-size: 32px; font-weight: 900; color: #1a1a1a; letter-spacing: -1px; }

        .data-card { background: #fff; border-radius: 28px; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); overflow: hidden; }
        .card-top-flex { padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #f0f0f0; gap: 40px; }
        .title-text { font-size: 15px; font-weight: 800; color: #1a1a1a; line-height: 1.3; min-width: 150px; }
        
        .add-btn-huge { flex: 1; background: #8e52fc; color: #fff; border-radius: 12px; height: 44px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 13.5px; font-weight: 800; transition: all 0.2s; }
        .add-btn-huge:hover { background: #7a3eeb; }

        .table-container { width: 100%; }
        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 16px 32px; text-align: left; font-size: 10.5px; font-weight: 900; color: #666; text-transform: uppercase; background: #fdfbff; border-bottom: 1.5px solid #f0f0f0; letter-spacing: 0.5px; }
        tbody td { padding: 20px 32px; font-size: 13.5px; color: #1a1a1a; border-bottom: 1px solid #f9f7ff; vertical-align: middle; }

        .profile-cell { display: flex; align-items: center; gap: 16px; }
        .p-name { font-weight: 700; color: #1a1a1a; font-size: 14px; margin-bottom: 2px; }
        .o-name { font-size: 12px; color: #666; font-weight: 600; }
        
        .badge { padding: 6px 14px; border-radius: 12px; font-size: 11px; font-weight: 800; display: inline-block; }
        .s-red { background: #fff5f5; color: #ff4757; }
        .s-green { background: #f0fff4; color: #2ed573; }
        
        .text-val { font-weight: 600; color: #444; font-size: 13px; }
        .d-btn { background: #fff; border: 1.5px solid #ece4ff; padding: 6px 20px; border-radius: 10px; color: #1a1a1a; font-weight: 700; font-size: 12.5px; cursor: pointer; transition: all 0.2s; }
        .d-btn:hover { border-color: #8e52fc; color: #8e52fc; }
        .text-right { text-align: right; }
      `}</style>
    </div>
  );
}
