'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SettingsSidebar from '@/components/SettingsSidebar';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function AdminStaf() {
  const supabase = createClient();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      console.log("Mencoba mengambil data dari Supabase...");
      
      // Mengambil SEMUA data dari tabel 'staf' tanpa filter aneh-aneh dari Supabase
      const { data, error } = await supabase
        .from('staf') 
        .select('*');

      if (error) throw error;

      // DEBUGGING: Cek data mentah dari database di console browser (F12)
      console.log("Data mentah dari DB:", data);

      // Memfilter Admin Utama di sisi frontend agar aman dari salah ketik huruf besar/kecil di database
      const filteredStaff = (data || []).filter(
        (s) => s.role !== 'Admin Utama' && s.role !== 'admin utama'
      );
      
      // Mengurutkan staf berdasarkan abjad nama secara manual
      filteredStaff.sort((a, b) => 
        (a.full_name || '').localeCompare(b.full_name || '')
      );

      setStaffList(filteredStaff);
      
    } catch (error: any) {
      console.error("Gagal mengambil data staf:", error.message);
      alert("Gagal memuat data staf: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus staf "${name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase.from('staf').delete().eq('id', id);
      if (error) throw error;
      
      setStaffList(prev => prev.filter(s => s.id !== id));
    } catch (error: any) {
      console.error("Gagal menghapus staf:", error.message);
      alert("Gagal menghapus staf: " + error.message);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Aktif' ? 'Sibuk' : 'Aktif';
    
    try {
      const { error } = await supabase
        .from('staf')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setStaffList(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch (error: any) {
      console.error("Gagal update status:", error.message);
      alert("Gagal update status: " + error.message);
    }
  };

  return (
    <div className="admin-body">
      <AdminSidebar active="pengaturan" />
      <main className="main-content">
        <AdminTopbar title="Manajemen Staf" subtitle="Kelola akses dan akun tim klinik" />
        
        <div className="scroll-area">
          <div className="settings-flex">
            <SettingsSidebar />
            
            <div className="form-card">
              <div className="card-header-flex">
                <h2 className="card-title">Daftar Tim<br/>Klinik</h2>
                <Link href="/admin/pengaturan/staf/tambah" className="add-btn-purple">
                  + Tambah Staf
                </Link>
              </div>
              
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>NAMA</th>
                      <th>PERAN</th>
                      <th>STATUS</th>
                      <th style={{ textAlign: 'right' }}>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#a19db5' }}>
                          Memuat data staf...
                        </td>
                      </tr>
                    ) : staffList.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#a19db5' }}>
                          Tidak ada staf yang terdaftar.
                        </td>
                      </tr>
                    ) : (
                      staffList.map((s) => (
                        <tr key={s.id}>
                          {/* Pastikan nama kolom di database benar-benar: full_name, role, status */}
                          <td className="fw-bold">{s.full_name}</td>
                          <td className="text-val">{s.role}</td>
                          <td>
                            <span className={s.status === 'Aktif' ? 'text-green' : 'text-orange'}>
                              {s.status === 'Aktif' ? '● Online' : '● Sibuk'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => toggleStatus(s.id, s.status)}
                                className="btn-status"
                              >
                                {s.status === 'Aktif' ? 'Set Sibuk' : 'Set Online'}
                              </button>
                              <button 
                                onClick={() => handleDelete(s.id, s.full_name)}
                                className="btn-delete"
                              >
                                Hapus
                              </button>
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
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 32px; }

        .settings-flex { display: flex; gap: 32px; align-items: flex-start; }

        .form-card { flex: 1; background: #fff; border-radius: 24px; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); overflow: hidden; }
        .card-header-flex { padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #f9f7ff; }
        .card-title { font-size: 15px; font-weight: 800; color: #1a1a1a; line-height: 1.3; }
        
        .add-btn-purple { display: flex; align-items: center; justify-content: center; width: 100%; max-width: 500px; height: 48px; background: #8e52fc; color: #fff; text-decoration: none; border-radius: 12px; font-size: 14px; font-weight: 800; transition: all 0.2s; flex: 1; margin-left: 24px; }
        .add-btn-purple:hover { background: #7a3eeb; }

        .table-container { width: 100%; }
        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 16px 32px; text-align: left; font-size: 11px; font-weight: 900; color: #a19db5; text-transform: uppercase; background: #fdfbff; border-bottom: 1.5px solid #f0f0f0; letter-spacing: 0.5px; }
        tbody td { padding: 20px 32px; font-size: 13.5px; color: #1a1a1a; border-bottom: 1px solid #f9f7ff; vertical-align: middle; }

        .fw-bold { font-weight: 700; color: #1a1a1a; }
        .text-val { font-weight: 600; color: #666; }
        .text-green { color: #2ed573; font-weight: 700; }
        .text-orange { color: #ffa502; font-weight: 700; }
        
        .btn-status { background: #f0f0ff; color: #8e52fc; border: none; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-status:hover { background: #8e52fc; color: #fff; }

        .btn-delete { background: #ffebee; color: #ff4757; border: none; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-delete:hover { background: #ff4757; color: #fff; }
      `}</style>
    </div>
  );
}
