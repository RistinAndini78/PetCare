'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SettingsSidebar from '@/components/SettingsSidebar';

export default function AdminNotificationSettings() {
  const [reminderVaksin, setReminderVaksin] = useState(true);
  const [laporanHarian, setLaporanHarian] = useState(false);

  return (
    <div className="admin-body">
      <AdminSidebar active="pengaturan" />
      <main className="main-content">
        <AdminTopbar title="Notifikasi" subtitle="Kelola pemberitahuan sistem" />
        
        <div className="scroll-area">
          <div className="settings-flex">
            <SettingsSidebar />
            
            <div className="form-card">
              <div className="card-header">
                <h2 className="card-title">Konfigurasi Notifikasi</h2>
              </div>
              <div className="card-body">
                <div className="config-list">
                  <div className="config-item">
                    <div className="c-info">
                      <div className="c-name">Reminder Vaksin</div>
                      <div className="c-desc">Kirim pengingat otomatis ke WhatsApp pemilik</div>
                    </div>
                    <div className={`switch ${reminderVaksin ? 'on' : ''}`} onClick={() => setReminderVaksin(!reminderVaksin)}>
                      <div className="knob"></div>
                    </div>
                  </div>

                  <div className="config-item">
                    <div className="c-info">
                      <div className="c-name">Laporan Harian Staf</div>
                      <div className="c-desc">Kirim rekap harian ke email admin</div>
                    </div>
                    <div className={`switch ${laporanHarian ? 'on' : ''}`} onClick={() => setLaporanHarian(!laporanHarian)}>
                      <div className="knob"></div>
                    </div>
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
        .card-header { padding: 24px 32px; border-bottom: 1px solid #f0f0f0; }
        .card-title { font-size: 16px; font-weight: 800; color: #1a1a1a; }
        
        .card-body { padding: 32px; }
        .config-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 12px; }
        .config-item { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; background: #f9f7ff; border-radius: 16px; border: 1.5px solid #ece4ff; }
        .c-name { font-size: 14.5px; font-weight: 800; color: #1a1a1a; }
        .c-desc { font-size: 12px; color: #a19db5; font-weight: 600; margin-top: 4px; }

        .switch { width: 44px; height: 26px; background: #d0c8dd; border-radius: 20px; position: relative; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .switch.on { background: #8e52fc; }
        .knob { width: 20px; height: 20px; background: #fff; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
        .switch.on .knob { left: 21px; }
      `}</style>
    </div>
  );
}
