'use client';

import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import { useRouter } from 'next/navigation';

export default function RekamMedisBaru() {
  const router = useRouter();

  return (
    <div className="admin-body">
      <AdminSidebar active="rekam-medis" />
      <main className="main-content">
        <AdminTopbar title="Input Rekam Medis Baru" name="drh. Andi Pratama" />
        
        <div className="scroll-area">
          <div className="rekam-grid">
            {/* Left Column: Data Riwayat Medis */}
            <div className="rekam-card main-card">
              <div className="card-header">
                <div className="h-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
                <h2 className="title-text">Data Riwayat Medis</h2>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label>Nama Pasien (Hewan)</label>
                  <select className="form-select">
                    <option>Pilih Hewan...</option>
                    <option>Luna</option>
                    <option>Buddy</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Berat Badan (kg)</label>
                  <input type="text" placeholder="Misal: 4.5" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Keluhan / Diagnosis</label>
                  <textarea rows={4} placeholder="Masukkan ringkasan kondisi hewan saat ini..." className="form-input"></textarea>
                </div>
                <div className="form-group">
                  <label>Tindakan Medis</label>
                  <select className="form-select">
                    <option>Pilih Tindakan...</option>
                    <option>Vaksinasi</option>
                    <option>Operasi Ringan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Catatan Dokter</label>
                  <textarea rows={3} placeholder="Catatan tambahan (resep obat, dll)..." className="form-input"></textarea>
                </div>
              </div>
            </div>

            {/* Right Column: Smart Scheduler */}
            <div className="rekam-card sidebar-card">
              <div className="card-header">
                <div className="h-icon purple"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M12 16c1.1 0 2 .9 2 2H10c0-1.1.9-2 2-2z"/></svg></div>
                <h2 className="title-text">Inovasi Smart Scheduler</h2>
              </div>
              <div className="card-body">
                <div className="scheduler-box">
                  <div className="bot-icon">🤖</div>
                  <div className="sch-label">Jadwal Perawatan Berikutnya</div>
                  <div className="sch-input-wrap">
                    <input type="text" disabled placeholder="Pilih tindakan dulu..." className="sch-input" />
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <div className="sch-hint">Dihitung otomatis oleh sistem berdasarkan jenis tindakan</div>
                </div>

                <div className="form-actions">
                  <button className="submit-btn" onClick={() => { alert('Rekam medis disimpan!'); router.push('/admin/rekam-medis'); }}>
                    Simpan Rekam Medis
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

        .rekam-grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: 24px; align-items: flex-start; }
        
        .rekam-card { background: #fff; border-radius: 28px; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); overflow: hidden; }
        .card-header { padding: 24px 32px; border-bottom: 1.5px solid #fdfbff; display: flex; align-items: center; gap: 12px; }
        .h-icon { width: 36px; height: 36px; border-radius: 10px; background: #f4eeff; display: flex; align-items: center; justify-content: center; color: #8e52fc; }
        .h-icon.purple { background: #f4eeff; color: #8e52fc; }
        .title-text { font-size: 16px; font-weight: 800; color: #1a1a1a; }
        
        .card-body { padding: 32px; }
        .form-group { margin-bottom: 24px; }
        .form-group label { display: block; font-size: 13px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; }
        .form-input, .form-select { width: 100%; padding: 14px 20px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 16px; font-size: 14px; color: #1a1a1a; outline: none; transition: all 0.2s; font-weight: 600; font-family: inherit; }
        .form-input:focus, .form-select:focus { border-color: #c084fc; background: #fff; }
        textarea.form-input { resize: none; line-height: 1.6; }

        .scheduler-box { background: #fdfbff; border: 1.5px dashed #ece4ff; border-radius: 24px; padding: 32px 24px; text-align: center; margin-bottom: 32px; }
        .bot-icon { font-size: 32px; margin-bottom: 16px; }
        .sch-label { font-size: 13px; font-weight: 800; color: #1a1a1a; margin-bottom: 12px; }
        .sch-input-wrap { position: relative; width: 100%; margin-bottom: 16px; }
        .sch-input { width: 100%; padding: 12px 18px; padding-right: 42px; background: #fff; border: 1.5px solid #f0f0f0; border-radius: 14px; font-size: 13px; color: #a19db5; outline: none; cursor: not-allowed; }
        .sch-input-wrap svg { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #a19db5; }
        .sch-hint { font-size: 10.5px; color: #a19db5; font-weight: 600; line-height: 1.4; }

        .submit-btn { width: 100%; height: 56px; background: linear-gradient(135deg, #d463f2 0%, #8e52fc 100%); border-radius: 18px; color: #fff; border: none; font-size: 14.5px; font-weight: 800; cursor: pointer; box-shadow: 0 10px 24px rgba(142, 82, 252, 0.25); transition: all 0.2s; }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(142, 82, 252, 0.35); }
      `}</style>
    </div>
  );
}
