'use client';

import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import Link from 'next/link';

export default function EditJamOperasional() {
  return (
    <div className="admin-body">
      <AdminSidebar active="pengaturan" />
      <main className="main-content">
        <AdminTopbar title="Edit Jam Operasional" backUrl="/admin/operasional" />
        
        <div className="scroll-area centered-content">
          <div className="edit-card">
            <div className="day-row">
              <span className="day-label">Senin - Jumat</span>
              <div className="time-inputs">
                <div className="time-box">
                  <input type="text" defaultValue="08:00 AM" />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div className="time-box">
                  <input type="text" defaultValue="08:00 PM" />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
              </div>
            </div>

            <div className="day-row">
              <span className="day-label">Sabtu</span>
              <div className="time-inputs">
                <div className="time-box">
                  <input type="text" defaultValue="09:00 AM" />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div className="time-box">
                  <input type="text" defaultValue="06:00 PM" />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
              </div>
            </div>

            <div className="day-row last-row">
              <span className="day-label">Minggu</span>
              <div className="time-inputs">
                <div className="time-box">
                  <input type="text" defaultValue="09:00 AM" />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div className="time-box">
                  <input type="text" defaultValue="06:00 PM" />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
              </div>
            </div>

            <button className="save-btn" onClick={() => alert('Jadwal disimpan!')}>
              Simpan Perubahan
            </button>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 60px 32px; }
        .centered-content { display: flex; justify-content: center; }

        .edit-card { width: 100%; max-width: 640px; background: #fff; border-radius: 32px; border: 1.5px solid #f0f0f0; box-shadow: 0 20px 60px rgba(142, 82, 252, 0.05); padding: 48px; }
        
        .day-row { display: flex; align-items: center; justify-content: space-between; padding: 24px 0; border-bottom: 1.5px dashed #f0f0f0; }
        .last-row { border-bottom: none; margin-bottom: 24px; }
        
        .day-label { font-size: 15px; font-weight: 800; color: #1a1a1a; }
        .time-inputs { display: flex; gap: 16px; }
        
        .time-box { position: relative; width: 180px; }
        .time-box input { width: 100%; padding: 12px 18px; padding-right: 44px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 14px; font-size: 14px; color: #1a1a1a; outline: none; transition: all 0.2s; font-weight: 600; }
        .time-box input:focus { border-color: #c084fc; background: #fff; }
        .time-box svg { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #a19db5; }

        .save-btn { width: 100%; height: 56px; background: #8e52fc; border-radius: 18px; color: #fff; border: none; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.25s; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.15); }
        .save-btn:hover { background: #7a3eeb; transform: translateY(-2px); box-shadow: 0 14px 40px rgba(142, 82, 252, 0.25); }
      `}</style>
    </div>
  );
}
