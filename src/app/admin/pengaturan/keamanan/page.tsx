'use client';

import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SettingsSidebar from '@/components/SettingsSidebar';
import { useRouter } from 'next/navigation';

export default function AdminSecuritySettings() {
  const router = useRouter();

  return (
    <div className="admin-body">
      <AdminSidebar active="pengaturan" />
      <main className="main-content">
        <AdminTopbar title="Keamanan" subtitle="Kelola keamanan akun dan data" />
        
        <div className="scroll-area">
          <div className="settings-flex">
            <SettingsSidebar />
            
            <div className="form-card">
              <div className="card-header">
                <h2 className="card-title">Ganti Password</h2>
              </div>
              <div className="card-body">
                <div className="security-info">
                  <div className="sec-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <div className="sec-text">
                    <p>Amankan akun Anda dengan mengganti password secara berkala.</p>
                    <span>Terakhir diubah: 3 bulan yang lalu</span>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button className="submit-btn" onClick={() => router.push('/admin/pengaturan/keamanan/ganti-password')}>
                    Ubah Password Sekarang
                  </button>
                </div>
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
        .security-info { display: flex; align-items: center; gap: 20px; background: #f9f7ff; padding: 24px; border-radius: 20px; border: 1px solid #ece4ff; margin-bottom: 32px; }
        .sec-icon { width: 56px; height: 56px; border-radius: 16px; background: #fff; color: #8e52fc; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(142, 82, 252, 0.1); }
        .sec-text p { font-size: 14.5px; font-weight: 700; color: #1a1a1a; }
        .sec-text span { font-size: 12px; font-weight: 600; color: #a19db5; display: block; margin-top: 4px; }

        .form-actions { margin-top: 32px; }
        .submit-btn { width: 100%; height: 56px; background: #8e52fc; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #fff; border: none; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.25s; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.15); }
        .submit-btn:hover { background: #7a3eeb; transform: translateY(-2px); box-shadow: 0 14px 40px rgba(142, 82, 252, 0.25); }
      `}</style>
    </div>
  );
}
