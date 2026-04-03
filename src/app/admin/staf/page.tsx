'use client';

import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SettingsSidebar from '@/components/SettingsSidebar';
import Link from 'next/link';

export default function AdminStaf() {
  const staff = [
    { name: 'drh. Budi', role: 'Dokter Klinik', status: 'Aktif' },
    { name: 'Siska Natalia', role: 'Resepsionis', status: 'Aktif' },
  ];

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
                <Link href="/admin/staf/tambah" className="add-btn-purple">
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
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((s, i) => (
                      <tr key={i}>
                        <td className="fw-bold">{s.name}</td>
                        <td className="text-val">{s.role}</td>
                        <td><span className="text-green">{s.status}</span></td>
                      </tr>
                    ))}
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
      `}</style>
    </div>
  );
}
