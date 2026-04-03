'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfil() {
  const router = useRouter();
  const [name, setName] = useState('Siti Rahayu');
  const [email, setEmail] = useState('siti.rahayu@email.com');
  const [address, setAddress] = useState('Jl. Melati No. 45, Kebayoran Lama, Jakarta Selatan');

  const handleSave = () => {
    alert('Profil berhasil diperbarui!');
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
          .ava-box { text-align: center; margin-bottom: 40px; position: relative; }
          .ava-circle { width: 100px; height: 100px; border-radius: 50%; background: #8e52fc; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: 800; color: #fff; position: relative; }
          .cam-badge { position: absolute; bottom: 0; right: 0; width: 32px; height: 32px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; color: #a19db5; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1.5px solid #f0f0f0; }
          .ava-hint { font-size: 13px; font-weight: 700; color: #a19db5; }

          .form-item { margin-bottom: 24px; }
          .form-item label { display: block; font-size: 11px; font-weight: 900; color: #a19db5; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
          .form-input { width: 100%; padding: 16px 20px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 16px; font-size: 14.5px; color: #1a1a1a; outline: none; transition: all 0.2s; font-weight: 600; }
          .form-input:focus { border-color: #c084fc; background: #fff; box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.08); }
          .form-textarea { resize: none; min-height: 100px; line-height: 1.6; }
          .disabled-box { background: #f7f7f7; border-color: #f0f0f0; color: #a19db5; cursor: not-allowed; }
          .note-small { font-size: 11px; color: #a19db5; font-weight: 600; margin-top: 8px; }

          .save-btn { width: 100%; height: 58px; background: linear-gradient(135deg, #d463f2 0%, #8e52fc 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #fff; border: none; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.25s; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.2); margin-top: 12px; }
          .save-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(142, 82, 252, 0.3); }
        `}</style>
        <button onClick={() => router.back()} className="back-circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div className="title-bold">Edit Profil</div>
      </header>

      <div className="content">
        <div className="ava-box">
          <div className="ava-circle">
            S
            <div className="cam-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </div>
          <div className="ava-hint">Ketuk untuk ganti foto</div>
        </div>

        <div className="form-item">
          <label>Nama Lengkap</label>
          <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="form-item">
          <label>Email</label>
          <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="form-item">
          <label>No. WhatsApp</label>
          <input type="text" className="form-input disabled-box" value="+62 812-3456-7890" disabled />
          <div className="note-small">Nomor WhatsApp tidak dapat diubah di sini.</div>
        </div>

        <div className="form-item">
          <label>Alamat Utama</label>
          <textarea className="form-input form-textarea" value={address} onChange={e => setAddress(e.target.value)} rows={3}></textarea>
        </div>

        <button className="save-btn" onClick={handleSave}>Simpan Perubahan</button>
      </div>
    </div>
  );
}
