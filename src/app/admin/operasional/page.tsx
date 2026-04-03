'use client';

import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SettingsSidebar from '@/components/SettingsSidebar';
import Link from 'next/link';

export default function AdminOperasional() {
  return (
    <div className="admin-body">
      <AdminSidebar active="pengaturan" />
      <main className="main-content">
        <AdminTopbar title="Jam Operasional" subtitle="Atur waktu buka dan tutup klinik" />
        
        <div className="scroll-area">
          <div className="settings-flex">
            <SettingsSidebar />
            
            <div className="form-card">
              <div className="card-header">
                <h2 className="card-title">Atur Jadwal Kerja</h2>
              </div>
              <div className="card-body">
                <div className="schedule-list">
                  <div className="s-row">
                    <span className="s-day">Senin - Jumat</span>
                    <span className="s-time">08:00 AM - 08:00 PM</span>
                  </div>
                  <div className="s-row">
                    <span className="s-day">Sabtu</span>
                    <span className="s-time">09:00 AM - 06:00 PM</span>
                  </div>
                  <div className="s-row">
                    <span className="s-day">Minggu</span>
                    <span className="s-time">09:00 AM - 06:00 PM</span>
                  </div>
                </div>
                
                <Link href="/admin/operasional/edit" className="edit-link-btn">
                  Update Jadwal
                </Link>
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

        .form-card { flex: 1; background: #fff; border-radius: 28px; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); overflow: hidden; }
        .card-header { padding: 24px 32px; border-bottom: 1.5px solid #fdfbff; }
        .card-title { font-size: 16px; font-weight: 800; color: #1a1a1a; }
        
        .card-body { padding: 32px; }
        .schedule-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .s-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: #f9f7ff; border-radius: 16px; border: 1px solid #ece4ff; }
        .s-day { font-size: 14px; font-weight: 700; color: #1a1a1a; }
        .s-time { font-size: 14.5px; font-weight: 800; color: #8e52fc; }

        .edit-link-btn { width: 100%; height: 52px; background: #8e52fc; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #fff; text-decoration: none; font-size: 14px; font-weight: 800; transition: all 0.25s; box-shadow: 0 8px 24px rgba(142, 82, 252, 0.15); }
        .edit-link-btn:hover { background: #7a3eeb; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(142, 82, 252, 0.25); }
      `}</style>
    </div>
  );
}
