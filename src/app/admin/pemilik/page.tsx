'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function DataPemilik() {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      // Mengambil data pemilik dan menghitung jumlah pasien terkait
      const { data, error } = await supabase
        .from('owners')
        .select('*, patients(count)')
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
        <AdminTopbar title="Data Pemilik" subtitle="Kelola informasi kontak dan profil pemilik hewan" />
        
        <div className="scroll-area">
          <div className="data-card">
            <div className="card-head-flex">
              <div className="title-box">
                <h2 className="title-text">Daftar Pemilik Hewan</h2>
                <div className="sub-text">{owners.length} pemilik terdaftar dalam sistem</div>
              </div>
              <div className="action-box">
                <div className="inner-search">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" placeholder="Cari nama atau WhatsApp..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <Link href="/admin/pemilik/tambah" className="add-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>Tambah Pemilik</span>
                </Link>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nama Pemilik</th>
                    <th>Kontak WhatsApp</th>
                    <th>Total Hewan</th>
                    <th>Alamat</th>
                    <th className="text-right">Manajemen Profil</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '60px' }}>
                        <div className="spinner"></div>
                        <p style={{ color: '#a19db5', fontSize: '13px', marginTop: '16px' }}>Menyinkronkan data pemilik...</p>
                      </td>
                    </tr>
                  ) : filteredOwners.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '60px' }}>
                        <p style={{ color: '#a19db5', fontSize: '14px' }}>Data pemilik tidak ditemukan.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOwners.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <div className="owner-profile">
                            <div className="o-ava">
                               {o.full_name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="o-name">{o.full_name}</div>
                                <div className="o-email">{o.email || 'Email belum diatur'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-val">
                            <div className="wa-box">
                                <span>{o.phone}</span>
                            </div>
                        </td>
                        <td>
                          <span className="p-chip" style={{ background: o.patients[0]?.count > 0 ? '#f0fff4' : '#f9f9f9', color: o.patients[0]?.count > 0 ? '#2ed573' : '#a19db5' }}>
                            {o.patients[0]?.count || 0} Ekor
                          </span>
                        </td>
                        <td className="text-val address-cell">
                          {o.address || 'Alamat belum diisi'}
                        </td>
                        <td className="text-right">
                          <div className="action-row-btns">
                            <Link href={`/admin/pemilik/${o.id}`} className="d-btn detail">
                              Profil
                            </Link>
                            {/* TOMBOL EDIT: Mengarah ke halaman edit khusus pemilik */}
                            <Link href={`/admin/pemilik/edit/${o.id}`} className="d-btn edit">
                              Edit
                            </Link>
                          </div>
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
        .spinner { width: 28px; height: 28px; border: 3px solid #f4eeff; border-top-color: #8e52fc; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .admin-body { display: flex; min-height: 100vh; background: #f8f9fd; font-family: 'Plus Jakarta Sans', sans-serif; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 32px; }

        .data-card { background: #fff; border-radius: 30px; border: 1px solid #eef0f7; box-shadow: 0 10px 40px rgba(0,0,0,0.02); overflow: hidden; }
        
        .card-head-flex { padding: 32px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f8f9fb; }
        .title-text { font-size: 20px; font-weight: 900; color: #1a1a1a; letter-spacing: -0.5px; }
        .sub-text { font-size: 13px; color: #a19db5; font-weight: 600; margin-top: 4px; }

        .action-box { display: flex; gap: 16px; align-items: center; }
        .inner-search { position: relative; width: 260px; }
        .inner-search svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #a19db5; }
        .inner-search input { width: 100%; padding: 12px 16px 12px 48px; background: #f8f9fd; border: 1px solid #eef0f7; border-radius: 14px; font-size: 13.5px; outline: none; transition: 0.3s; }
        .inner-search input:focus { border-color: #8e52fc; background: #fff; }
        
        .add-btn { background: linear-gradient(135deg, #8e52fc 0%, #6c31e0 100%); color: #fff; border: none; border-radius: 16px; padding: 12px 24px; font-size: 14px; font-weight: 800; display: flex; align-items: center; gap: 10px; cursor: pointer; box-shadow: 0 10px 20px rgba(142, 82, 252, 0.2); transition: 0.3s; text-decoration: none; }
        .add-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(142, 82, 252, 0.3); }

        .table-container { width: 100%; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 18px 32px; text-align: left; font-size: 11px; font-weight: 800; color: #a19db5; text-transform: uppercase; background: #fdfbff; border-bottom: 1px solid #f0f0f0; letter-spacing: 1px; }
        tbody td { padding: 20px 32px; font-size: 14.5px; color: #1a1a1a; border-bottom: 1px solid #f8f9fb; vertical-align: middle; }

        .owner-profile { display: flex; align-items: center; gap: 16px; }
        .o-ava { width: 44px; height: 44px; border-radius: 14px; background: #f4eeff; display: flex; align-items: center; justify-content: center; color: #8e52fc; font-weight: 800; font-size: 18px; border: 1px solid #e8dfff; }
        .o-name { font-weight: 800; color: #1a1a1a; font-size: 15px; }
        .o-email { font-size: 12px; color: #a19db5; font-weight: 500; }
        
        .text-val { font-weight: 700; color: #444; font-size: 14px; }
        .address-cell { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; color: #7a7a7a; }
        .p-chip { font-weight: 800; font-size: 11px; display: inline-block; padding: 6px 14px; border-radius: 10px; }
        
        .action-row-btns { display: flex; gap: 8px; justify-content: flex-end; }
        .d-btn { padding: 8px 18px; border-radius: 12px; font-weight: 800; font-size: 12.5px; text-decoration: none; transition: 0.2s; border: 1.5px solid transparent; }
        .d-btn.detail { background: #f4eeff; color: #8e52fc; }
        .d-btn.detail:hover { background: #8e52fc; color: #fff; }
        .d-btn.edit { background: #fff; border-color: #eef0f7; color: #1a1a1a; }
        .d-btn.edit:hover { border-color: #8e52fc; color: #8e52fc; }
        
        .text-right { text-align: right; }
      `}</style>
    </div>
  );
}