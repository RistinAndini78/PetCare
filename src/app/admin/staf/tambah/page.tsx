'use client';

import Link from 'next/link';

export default function TambahStaf() {
  return (
    <div className="page-wrapper">
      <div className="header">
        <Link href="/admin/staf" className="back-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </Link>
        <h1 className="title">Tambah Staf Baru</h1>
      </div>

      <div className="content">
        <div className="form-card">
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input type="text" placeholder="Masukkan nama staf" className="f-input" />
          </div>
          
          <div className="form-group">
            <label>Email Staf</label>
            <input type="email" placeholder="email@happypaws.id" className="f-input" />
          </div>

          <div className="form-group">
            <label>Peran / Jabatan</label>
            <input type="text" placeholder="Dokter Klinik" className="f-input" />
          </div>

          <div className="form-group">
            <label>Password Awal</label>
            <input type="password" placeholder="********" className="f-input" />
          </div>

          <button className="submit-btn" onClick={() => window.history.back()}>
            Simpan Data Staf
          </button>
        </div>
      </div>

      <style jsx global>{`
        .page-wrapper { min-height: 100vh; background: #f9f7ff; display: flex; flex-direction: column; }
        .header { height: 72px; padding: 0 24px; display: flex; align-items: center; gap: 16px; background: #fff; border-bottom: 1px solid #f0ecfb; }
        .back-btn { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid #ece4ff; display: flex; align-items: center; justify-content: center; color: #1a1a1a; transition: all 0.2s; text-decoration: none; }
        .back-btn:hover { background: #fdfbff; border-color: #8e52fc; color: #8e52fc; }
        .title { font-size: 16px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }

        .content { flex: 1; display: flex; align-items: flex-start; justify-content: center; padding: 40px 24px; }
        .form-card { width: 100%; max-width: 480px; background: #fff; border-radius: 20px; padding: 32px; border: 1.5px solid #ece4ff; box-shadow: 0 12px 32px rgba(142, 82, 252, 0.04); }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 12.5px; font-weight: 800; color: #444; margin-bottom: 8px; }
        .f-input { width: 100%; padding: 14px 16px; background: #fdfbff; border: 1.5px solid #ece4ff; border-radius: 12px; font-size: 13.5px; color: #1a1a1a; transition: all 0.2s; font-weight: 500; font-family: inherit; }
        .f-input:focus { outline: none; border-color: #8e52fc; background: #fff; box-shadow: 0 0 0 4px rgba(142, 82, 252, 0.1); }
        .f-input::placeholder { color: #a19db5; }

        .submit-btn { width: 100%; padding: 16px; background: #8e52fc; color: #fff; border: none; border-radius: 12px; font-size: 14px; font-weight: 800; margin-top: 12px; cursor: pointer; transition: all 0.2s; }
        .submit-btn:hover { background: #7a3eeb; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(142, 82, 252, 0.2); }
      `}</style>
    </div>
  );
}
