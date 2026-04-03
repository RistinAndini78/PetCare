'use client';

import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';

export default function EditEntriMedis() {
  return (
    <div className="admin-body">
      <AdminSidebar active="rekam-medis" />
      <main className="main-content">
        <div className="topbar">
          <Link href="/admin/rekam-medis" className="back-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div className="t-right">
            <div className="t-title">Edit Rekam Medis</div>
            <div className="t-sub">Perbarui detail tindakan medis pasien</div>
          </div>
        </div>

        <div className="scroll-area">
          <div className="form-card">
            <div className="card-header">
              <div className="header-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              <div className="header-text">
                <h2>Formulir Edit Tindakan</h2>
                <p>Data tindakan medis akan secara otomatis tesinkronasi ke aplikasi <b>Portal Pemilik</b> setelah disimpan.</p>
              </div>
            </div>

            <div className="card-body">
              <div className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 10h.01M16 10h.01M12 14v.01M10 16a2 2 0 0 0 4 0"/></svg>
                Informasi Pasien
              </div>
              
              <div className="grid-1">
                <div className="form-group">
                  <label>NAMA HEWAN - PEMILIK</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" className="f-input with-icon" value="Luna - Siti Rahayu (PCR-0021)" disabled style={{ background: '#f8f6fb', fontWeight: 600, color: '#1a1a1a' }} />
                  </div>
                </div>
              </div>

              <div className="section-title" style={{ marginTop: '40px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                Detail Tindakan Medis
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>TANGGAL TINDAKAN</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <input type="date" className="f-input with-icon" defaultValue="2026-03-05" />
                  </div>
                </div>
                <div className="form-group">
                  <label>DOKTER PENANGGUNG JAWAB</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input type="text" defaultValue="drh. Andi Pratama" className="f-input with-icon" disabled style={{ background: '#f8f6fb' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label>JENIS TINDAKAN</label>
                  <select className="f-input f-select" defaultValue="vaksin">
                    <option value="vaksin">Vaksin / Imunisasi</option>
                    <option value="pemeriksaan">Pemeriksaan Rutin / Rawat Jalan</option>
                    <option value="operasi">Tindakan Bedah / Operasi</option>
                    <option value="grooming">Medical Grooming</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>BERAT BADAN (KG)</label>
                  <input type="number" defaultValue="3.8" step="0.1" className="f-input" />
                </div>
                <div className="form-group full-width">
                  <label>HASIL DIAGNOSA & PENGOBATAN</label>
                  <textarea defaultValue="Kondisi sehat 3.8kg. Reaksi normal pasca vaksinasi FVRCP." rows={4} className="f-textarea"></textarea>
                </div>
              </div>

              <div className="bottom-actions">
                <Link href="/admin/rekam-medis" className="btn-cancel">Batal</Link>
                <div className="action-right">
                  <button className="btn-delete" type="button">Hapus Entri</button>
                  <button className="btn-save">
                    <span>Simpan Perubahan</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
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
        .scroll-area { padding: 40px; display: flex; justify-content: center; }

        .topbar { padding: 24px 40px 0; display: flex; align-items: flex-start; justify-content: space-between; }
        .back-btn { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; color: #a19db5; text-decoration: none; margin-left: -12px; border-radius: 12px; transition: all 0.2s; }
        .back-btn:hover { background: #fff; color: #8e52fc; box-shadow: 0 4px 12px rgba(142, 82, 252, 0.05); }
        
        .t-right { text-align: right; }
        .t-title { font-size: 24px; font-weight: 900; color: #1a1a1a; letter-spacing: -0.5px; }
        .t-sub { font-size: 13.5px; color: #a19db5; font-weight: 600; margin-top: 4px; }

        .form-card { background: #fff; width: 100%; max-width: 860px; border-radius: 24px; border: 1.5px solid #ece4ff; box-shadow: 0 20px 40px rgba(142, 82, 252, 0.04); overflow: hidden; margin-bottom: 24px; }
        
        .card-header { padding: 36px 40px; background: linear-gradient(135deg, #1e90ff 0%, #3e1edc 100%); color: #fff; display: flex; align-items: center; gap: 20px; }
        .header-icon { width: 56px; height: 56px; border-radius: 16px; background: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
        .header-text h2 { font-size: 22px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.3px; }
        .header-text p { font-size: 14px; opacity: 0.9; font-weight: 500; margin: 0; line-height: 1.5; }
        
        .card-body { padding: 48px 40px; }

        .section-title { font-size: 15px; font-weight: 800; color: #1a1a1a; margin-bottom: 28px; display: flex; align-items: center; gap: 12px; border-bottom: 2px solid #f9f7ff; padding-bottom: 16px; }
        .section-title svg { color: #1e90ff; }
        
        .grid-1 { display: grid; grid-template-columns: 1fr; gap: 24px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 32px; }
        .form-group label { display: block; font-size: 11px; font-weight: 800; color: #666; margin-bottom: 10px; letter-spacing: 0.8px; text-transform: uppercase; }
        .full-width { grid-column: span 2; }
        
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 16px; color: #a19db5; transition: all 0.2s; pointer-events: none; }
        
        .f-input, .f-textarea { width: 100%; border: 1.5px solid #ece4ff; border-radius: 14px; font-size: 14.5px; color: #1a1a1a; transition: all 0.25s; font-weight: 500; font-family: inherit; background: #fdfbff; }
        .f-input { padding: 16px 20px; height: 54px; }
        .f-input.with-icon { padding-left: 48px; }
        .f-textarea { padding: 16px 20px; resize: none; line-height: 1.5; }
        
        .f-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a19db5' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 20px center; padding-right: 48px; cursor: pointer; }

        .f-input:focus, .f-textarea:focus { outline: none; border-color: #3e1edc; background: #fff; box-shadow: 0 4px 12px rgba(62, 30, 220, 0.08); }
        .input-wrapper:focus-within .input-icon { color: #3e1edc; }
        
        .bottom-actions { display: flex; gap: 20px; margin-top: 56px; align-items: center; justify-content: space-between; }
        .action-right { display: flex; gap: 16px; align-items: center; }
        .btn-cancel { padding: 16px 32px; color: #a19db5; font-size: 14.5px; font-weight: 700; cursor: pointer; transition: all 0.2s; text-decoration: none; border-radius: 14px; border: 1.5px solid transparent; }
        .btn-cancel:hover { background: #f9f7ff; color: #1a1a1a; }
        
        .btn-delete { padding: 16px 24px; color: #ff4757; background: #fff5f5; font-size: 14.5px; font-weight: 800; cursor: pointer; transition: all 0.2s; border: none; border-radius: 14px; }
        .btn-delete:hover { background: #ff4757; color: #fff; }

        .btn-save { padding: 16px 36px; background: linear-gradient(135deg, #1e90ff 0%, #3e1edc 100%); color: #fff; border: none; border-radius: 14px; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 12px; }
        .btn-save:hover { background: #3e1edc; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(62, 30, 220, 0.25); }
      `}</style>
    </div>
  );
}
