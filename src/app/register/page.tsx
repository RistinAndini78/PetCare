'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [showP1, setShowP1] = useState(false);
  const [showP2, setShowP2] = useState(false);

  return (
    <div className="app">
      <style jsx>{`
        .top-area{background:var(--pr);padding: 50px 0 60px;display:flex;flex-direction:column;align-items:center;position:relative;overflow:hidden;}
        .blob-tl{width:100px;height:100px;top:-20px;left:-20px;background:rgba(255,255,255,.2); position: absolute; border-radius: 50%;}
        .blob-tr{width:80px;height:80px;top:-10px;right:-10px;background:rgba(255,255,255,.15); position: absolute; border-radius: 50%;}
        .dog-logo{width:80px;height:80px;animation:float 3s ease-in-out infinite;}
        .brand-name{font-family:'Nunito',sans-serif;font-size:26px;font-weight:900;color:#fff;margin-top:8px;}
        .brand-sub{font-size:11px;font-weight:600;color:rgba(255,255,255,.65);letter-spacing:2px;text-transform:uppercase;}
        .form-card{background:#fff;border-radius:32px 32px 0 0;margin-top:-24px;padding:28px 24px 40px;width:100%;box-sizing:border-box;flex:1;box-shadow:0 -4px 32px rgba(0,0,0,.08);animation:fadeUp .4s ease; position: relative; z-index: 1;}
        .form-title{font-size:22px;font-weight:800;color:var(--text);}
        .form-subtitle{font-size:22px;font-weight:800;color:var(--pr);}
        .form-footer{text-align:center;margin-top:16px;font-size:13px;color:var(--muted); }
        .form-footer :global(a){color:var(--pr);font-weight:700;text-decoration:none;}
        .info-box{background:var(--pr-pale);border-radius:12px;padding:12px;border:1.5px solid var(--border);margin-bottom:18px;font-size:12.5px;color:var(--text);line-height:1.6;}
        
        .btn-primary { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      <div className="top-area">
        <div className="blob blob-tl"></div>
        <div className="blob blob-tr"></div>
        <svg className="dog-logo" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="39" r="25" fill="#d4a574"/>
          <ellipse cx="25" cy="22" rx="10" ry="13" fill="#c4956a" transform="rotate(-15 25 22)"/>
          <ellipse cx="55" cy="22" rx="10" ry="13" fill="#c4956a" transform="rotate(15 55 22)"/>
          <circle cx="40" cy="38" r="19" fill="#e8c49a"/>
          <circle cx="33" cy="33" r="4.5" fill="#fff"/><circle cx="47" cy="33" r="4.5" fill="#fff"/>
          <circle cx="33.5" cy="33" r="2.5" fill="#2d1200"/><circle cx="47.5" cy="33" r="2.5" fill="#2d1200"/>
          <circle cx="35" cy="32" r="1" fill="#fff"/><circle cx="49" cy="32" r="1" fill="#fff"/>
          <ellipse cx="40" cy="43" rx="4.5" ry="2.8" fill="#c4956a"/>
          <path d="M35 48 Q40 54 45 48" stroke="#c4956a" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <ellipse cx="40" cy="50" rx="3.5" ry="3" fill="#e74c3c"/>
          <rect x="15" y="53" width="16" height="12" rx="8" fill="#d4a574"/>
          <rect x="49" y="53" width="16" height="12" rx="8" fill="#d4a574"/>
        </svg>
        <div className="brand-name">PetCare</div>
        <div className="brand-sub">Smart System</div>
      </div>

      <div className="form-card">
        <div className="form-title">Selamat Datang!</div>
        <div className="form-subtitle">Daftar Admin</div>
        <br />
        <div className="info-box">â„¹ï¸ Halaman ini untuk <strong>admin/dokter klinik</strong>. Akun pemilik hewan dibuat otomatis oleh admin saat mendaftarkan pasien.</div>
        
        <div className="input-group">
          <label>Nama Lengkap</label>
          <div className="input-wrap">
            <input type="text" placeholder="Nama lengkap Anda" />
          </div>
        </div>
        
        <div className="input-group">
          <label>Nama Klinik</label>
          <div className="input-wrap">
            <input type="text" placeholder="Nama klinik hewan" />
          </div>
        </div>
        
        <div className="input-group">
          <label>Nomor WhatsApp</label>
          <div className="input-wrap">
            <input type="tel" placeholder="08xxxxxxxxxx" />
          </div>
        </div>
        
        <div className="input-group">
          <label>Kata Sandi</label>
          <div className="input-wrap">
            <input type={showP1 ? 'text' : 'password'} placeholder="Min. 8 karakter" />
            <span className="input-icon" style={{ cursor: 'pointer' }} onClick={() => setShowP1(!showP1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
          </div>
        </div>
        
        <div className="input-group">
          <label>Konfirmasi Kata Sandi</label>
          <div className="input-wrap">
            <input type={showP2 ? 'text' : 'password'} placeholder="Ulangi kata sandi" />
            <span className="input-icon" style={{ cursor: 'pointer' }} onClick={() => setShowP2(!showP2)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
          </div>
        </div>

        <button className="btn-primary" onClick={() => router.push('/admin/beranda')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          Daftarkan Klinik
        </button>
        
        <div className="form-footer">Sudah punya akun? <Link href="/login/admin">Masuk di sini</Link></div>
      </div>
    </div>
  );
}




