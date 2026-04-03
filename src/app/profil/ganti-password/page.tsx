'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GantiPassword() {
  const router = useRouter();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSave = () => {
    alert('Password berhasil diperbarui!');
    router.push('/profil');
  };

  return (
    <div className="app bg-white">
      <header className="header-simple">
        <style jsx>{`
          .bg-white { background: #fff; min-height: 100vh; }
          .header-simple { padding: 56px 20px 24px; display: flex; align-items: center; gap: 20px; border-bottom: 1px solid #f0f0f0; }
          .back-circle { width: 40px; height: 40px; border-radius: 12px; background: #f4eeff; display: flex; align-items: center; justify-content: center; color: #8e52fc; border: none; cursor: pointer; }
          .title-bold { font-size: 17px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
          
          .content { padding: 32px 28px; }
          .icon-box { text-align: center; margin-bottom: 40px; }
          .lock-circle { width: 64px; height: 64px; border-radius: 20px; background: #f4eeff; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: #8e52fc; }
          .hint-center { font-size: 13.5px; font-weight: 600; color: #a19db5; text-align: center; line-height: 1.6; max-width: 280px; margin: 0 auto; }

          .form-item { margin-bottom: 24px; }
          .form-item label { display: block; font-size: 11px; font-weight: 900; color: #a19db5; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
          .form-input { width: 100%; padding: 16px 20px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 16px; font-size: 14.5px; color: #1a1a1a; outline: none; transition: all 0.2s; font-weight: 600; }
          .form-input:focus { border-color: #c084fc; background: #fff; box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.08); }
          .note-small { font-size: 11px; color: #a19db5; font-weight: 600; margin-top: 8px; }

          .save-btn { width: 100%; height: 58px; background: linear-gradient(135deg, #d463f2 0%, #8e52fc 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #fff; border: none; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.25s; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.2); margin-top: 12px; }
          .save-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(142, 82, 252, 0.3); }
        `}</style>
        <button onClick={() => router.back()} className="back-circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div className="title-bold">Ganti Password</div>
      </header>

      <div className="content">
        <div className="icon-box">
          <div className="lock-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div className="hint-center">Gunakan kombinasi yang kuat untuk menjaga keamanan akun Anda.</div>
        </div>

        <div className="form-item">
          <label>Password Lama</label>
          <input type="password" placeholder="••••••••" className="form-input" value={oldPass} onChange={e => setOldPass(e.target.value)} />
        </div>

        <div className="form-item" style={{ marginBottom: '12px' }}>
          <label>Password Baru</label>
          <input type="password" placeholder="••••••••" className="form-input" value={newPass} onChange={e => setNewPass(e.target.value)} />
          <div className="note-small">Minimal 8 karakter, kombinasi huruf dan angka.</div>
        </div>

        <div className="form-item">
          <label>Konfirmasi Password Baru</label>
          <input type="password" placeholder="••••••••" className="form-input" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
        </div>

        <button className="save-btn" onClick={handleSave}>Simpan Password Baru</button>
      </div>
    </div>
  );
}
