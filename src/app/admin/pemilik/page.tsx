'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';

export default function DataPemilik() {
  const [searchQuery, setSearchQuery] = useState('');
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('owners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOwners(data || []);
    } catch (err) {
      console.error('Error fetching owners:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOwners = owners.filter(o => 
    (o.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (o.phone || '').includes(searchQuery) ||
    (o.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-body">
      <AdminSidebar active="pemilik" />
      <main className="main-content">
        <AdminTopbar title="Data Pemilik" subtitle="Semua pemilik hewan terdaftar" />
        
        <div className="scroll-area">
          <div className="data-card">
            <div className="card-head-flex">
              <div className="title-box">
                <h2 className="title-text">Daftar Pemilik Hewan</h2>
                <div className="sub-text">{owners.length} pemilik terdaftar</div>
              </div>
              <div className="action-box">
                <div className="inner-search">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" placeholder="Cari..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <button className="add-btn">
                  <Link href="/admin/pemilik/tambah" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', textDecoration: 'none' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>Tambah Pemilik</span>
                  </Link>
                </button>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nama Pemilik</th>
                    <th>No. WhatsApp</th>
                    <th>Email</th>
                    <th>Kota</th>
                    <th>Hewan</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                        <div className="spinner"></div>
                        <p style={{ color: '#a19db5', fontSize: '13px', marginTop: '12px' }}>Memuat data pemilik...</p>
                      </td>
                    </tr>
                  ) : filteredOwners.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: '#a19db5', fontSize: '14px' }}>Belum ada data pemilik terdaftar.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOwners.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <div className="owner-profile">
                            <div className="o-ava">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                            <span className="o-name">{o.full_name}</span>
                          </div>
                        </td>
                        <td className="text-val">{o.phone}</td>
                        <td className="text-muted">{o.email}</td>
                        <td className="text-val">{o.address?.split(' - ')[1] || '---'}</td>
                        <td><span className="p-chip">0 Hewan</span></td>
                        <td><button className="d-btn">Detail</button></td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .spinner { width: 32px; height: 32px; border: 3px solid #f4eeff; border-top-color: #8e52fc; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 32px; }

        .data-card { background: #fff; border-radius: 28px; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); overflow: hidden; }
        
        .card-head-flex { padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f9f7ff; }
        .title-text { font-size: 16px; font-weight: 800; color: #1a1a1a; }
        .sub-text { font-size: 12px; color: #a19db5; font-weight: 600; margin-top: 2px; }

        .action-box { display: flex; gap: 16px; align-items: center; }
        .inner-search { position: relative; width: 220px; }
        .inner-search svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #a19db5; }
        .inner-search input { width: 100%; padding: 10px 16px 10px 44px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 12px; font-size: 13px; outline: none; }
        
        .add-btn { background: linear-gradient(135deg, #d463f2 0%, #8e52fc 100%); color: #fff; border: none; border-radius: 14px; padding: 12px 24px; font-size: 14px; font-weight: 800; display: flex; align-items: center; gap: 10px; cursor: pointer; box-shadow: 0 8px 20px rgba(142, 82, 252, 0.3); transition: all 0.25s; text-decoration: none; }
        .add-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(142, 82, 252, 0.4); }
        .var-btn { background: #fff; color: #8e52fc; border: 1.5px solid #ece4ff; box-shadow: none; }
        .var-btn:hover { background: #f4eeff; border-color: #8e52fc; box-shadow: none; transform: translateY(-2px); }

        .table-container { width: 100%; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 18px 32px; text-align: left; font-size: 11.5px; font-weight: 800; color: #a19db5; text-transform: uppercase; background: #fdfbff; border-bottom: 1.5px solid #f9f7ff; }
        tbody td { padding: 18px 32px; font-size: 14.5px; color: #1a1a1a; border-bottom: 1px solid #f9f7ff; vertical-align: middle; }

        .owner-profile { display: flex; align-items: center; gap: 16px; }
        .o-ava { width: 40px; height: 40px; border-radius: 12px; background: #f4eeff; display: flex; align-items: center; justify-content: center; color: #8e52fc; }
        .o-name { font-weight: 700; color: #1a1a1a; }
        
        .text-val { font-weight: 600; color: #666; }
        .text-muted { color: #a19db5; font-size: 13px; }
        .p-chip { font-weight: 700; color: #1a1a1a; }
        
        .d-btn { background: #fff; border: 1px solid #f0f0f0; padding: 6px 20px; border-radius: 10px; color: #8e52fc; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .d-btn:hover { background: #f4eeff; border-color: #8e52fc; }
      `}</style>
    </div>
  );
}
