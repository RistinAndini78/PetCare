'use client';

import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SettingsSidebar from '@/components/SettingsSidebar';

export default function PengaturanAdmin() {
  return (
    <div className="admin-body">
      <AdminSidebar active="pengaturan" />
      <main className="main-content">
        <AdminTopbar title="Profil Klinik" subtitle="Kelola informasi dasar klinik Anda" />
        
        <div className="scroll-area">
          <div className="settings-flex">
            <SettingsSidebar />
            
            <div className="form-card">
              <div className="card-header">
                <h2 className="card-title">Informasi Dasar</h2>
              </div>
              <div className="card-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Nama Klinik</label>
                    <input type="text" defaultValue="Klinik Hewan Sehat Selalu" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>No. Telepon</label>
                    <input type="tel" defaultValue="(031) 1234-5678" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" defaultValue="info@sehatselalu.com" className="form-input" />
                  </div>
                  <div className="form-group full-width">
                    <label>Alamat</label>
                    <textarea defaultValue="Jl. Hewan Sehat No. 12, Surabaya" rows={3} className="form-input"></textarea>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button className="submit-btn" onClick={() => alert('Profil diperbarui')}>
                    Simpan Perubahan
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
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .full-width { grid-column: span 2; }
        
        .form-group label { display: block; font-size: 13px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; }
        .form-input { width: 100%; padding: 14px 18px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 16px; font-size: 14px; color: #1a1a1a; outline: none; transition: all 0.2s; }
        .form-input:focus { border-color: #c084fc; background: #fff; box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.08); }
        textarea.form-input { resize: none; }

        .form-actions { margin-top: 32px; }
        .submit-btn { width: 100%; height: 56px; background: #8e52fc; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #fff; border: none; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.25s; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.15); }
        .submit-btn:hover { background: #7a3eeb; transform: translateY(-2px); box-shadow: 0 14px 40px rgba(142, 82, 252, 0.25); }
      `}</style>
    </div>
  );
}
