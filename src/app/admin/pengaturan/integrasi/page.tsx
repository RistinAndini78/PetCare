'use client';

import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SettingsSidebar from '@/components/SettingsSidebar';

export default function AdminIntegrasiSettings() {
  return (
    <div className="admin-body">
      <AdminSidebar active="pengaturan" />
      <main className="main-content">
        <AdminTopbar title="Integrasi" subtitle="Hubungkan sistem dengan layanan pihak ketiga" />
        
        <div className="scroll-area">
          <div className="settings-flex">
            <SettingsSidebar />
            
            <div className="form-card">
              <div className="card-header">
                <h2 className="card-title">Koneksi Layanan</h2>
              </div>
              <div className="card-body">
                <div className="conn-list">
                  <div className="conn-box">
                    <div className="c-info">
                      <div className="c-name">WhatsApp Business API</div>
                      <div className="c-desc">Digunakan untuk pengiriman reminder otomatis.</div>
                    </div>
                    <div className="c-badge ok">Terhubung</div>
                  </div>

                  <div className="conn-box">
                    <div className="c-info">
                      <div className="c-name">Google Calendar</div>
                      <div className="c-desc">Sinkronkan jadwal konsultasi dengan kalender Google.</div>
                    </div>
                    <div className="c-badge none">Belum Terhubung</div>
                  </div>
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

        .form-card { flex: 1; background: #fff; border-radius: 24px; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); overflow: hidden; }
        .card-header { padding: 24px 32px; border-bottom: 1.5px solid #fdfbff; }
        .card-title { font-size: 16px; font-weight: 800; color: #1a1a1a; }
        
        .card-body { padding: 32px; }
        .conn-list { display: flex; flex-direction: column; gap: 16px; }
        
        .conn-box { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; background: #fff; border: 1.5px solid #f0f0f0; border-radius: 20px; }
        
        .c-name { font-size: 15px; font-weight: 800; color: #1a1a1a; }
        .c-desc { font-size: 12px; color: #a19db5; font-weight: 600; margin-top: 4px; }
        
        .c-badge { padding: 7px 16px; border-radius: 12px; font-size: 11px; font-weight: 900; }
        .ok { background: #f0fff4; color: #2ed573; }
        .none { background: #f5f5f5; color: #a19db5; }
      `}</style>
    </div>
  );
}
