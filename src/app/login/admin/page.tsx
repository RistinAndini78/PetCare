'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [user, setUser] = useState('admin');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [activeProfile, setActiveProfile] = useState('Admin');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const profiles = [
    { id: 'Admin', name: 'Admin', ava: 'A', bg: 'linear-gradient(135deg, #1e1e2f 0%, #11111d 100%)' },
    { id: 'drh. Budi', name: 'drh. Budi', ava: 'B', bg: 'linear-gradient(135deg, #8e52fc 0%, #6e36d4 100%)' },
    { id: 'drh. Siti', name: 'drh. Siti', ava: 'S', bg: 'linear-gradient(135deg, #d463f2 0%, #a136d4 100%)' },
    { id: 'drh. Andi', name: 'drh. Andi', ava: 'A', bg: 'linear-gradient(135deg, #444 0%, #222 100%)' },
  ];

  const selProfile = (profile: any) => {
    setActiveProfile(profile.id);
    const userMap: any = { 
      'Admin': 'admin', 
      'drh. Budi': 'drh_budi', 
      'drh. Siti': 'drh_siti', 
      'drh. Andi': 'drh_andi' 
    };
    setUser(userMap[profile.id]);
  };

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (pass === 'admin123') {
        const profileMap: any = {
          'Admin': { name: 'drh. Andi Pratama', role: 'Admin Utama' },
          'drh. Budi': { name: 'drh. Budi', role: 'Dokter Klinik' },
          'drh. Siti': { name: 'drh. Siti', role: 'Dokter Klinik' },
          'drh. Andi': { name: 'drh. Andi Pratama', role: 'Admin Utama' }
        };
        const selected = profileMap[activeProfile] || profileMap['Admin'];
        localStorage.setItem('petcare_user', JSON.stringify(selected));
        router.push('/admin/beranda');
      } else {
        alert('Kata sandi salah!');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-page">
      <style jsx>{`
        .login-page { 
          display: flex; justify-content: center; align-items: center; 
          min-height: 100vh; background: #f9faff; 
          font-family: 'Inter', sans-serif;
        }
        .login-card { 
          width: 100%; max-width: 420px; padding: 20px; 
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .brand-header { text-align: center; margin-bottom: 32px; }
        .logo-circle {
          width: 72px; height: 72px; background: #8e52fc; border-radius: 22px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px; box-shadow: 0 12px 30px rgba(142, 82, 252, 0.25);
          color: white;
        }
        .brand-name { font-size: 26px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px; }
        .brand-tag { font-size: 10px; font-weight: 700; color: #8e52fc; text-transform: uppercase; letter-spacing: 2px; }

        .auth-panel { 
          background: #ffffff; border-radius: 28px; padding: 40px; 
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
          border: 1px solid #f0f0f5;
        }
        .title { font-size: 22px; font-weight: 800; color: #1a1a2e; margin-bottom: 6px; text-align: center; }
        .subtitle { font-size: 14px; color: #7f8c9b; text-align: center; margin-bottom: 30px; }

        .profile-list { display: flex; gap: 12px; margin-bottom: 30px; justify-content: center; }
        .p-box { flex: 1; cursor: pointer; text-align: center; transition: 0.3s; }
        .p-ava { 
          width: 46px; height: 46px; border-radius: 14px; margin: 0 auto 8px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 800; font-size: 16px;
          transition: 0.3s; border: 3px solid transparent;
        }
        .p-name { font-size: 10px; font-weight: 700; color: #94a3b8; }
        
        .p-box.active .p-ava { transform: scale(1.1); box-shadow: 0 8px 15px rgba(142, 82, 252, 0.3); border-color: #fff; outline: 2px solid #8e52fc; }
        .p-box.active .p-name { color: #8e52fc; font-weight: 800; }

        .input-group { margin-bottom: 20px; }
        .label { display: block; font-size: 12px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .input-rel { position: relative; }
        .input-rel input { 
          width: 100%; padding: 14px 16px; border: 1.5px solid #edf2f7; border-radius: 12px;
          font-size: 14px; font-weight: 600; background: #fcfdfe; outline: none; transition: 0.2s;
        }
        .input-rel input:focus { border-color: #8e52fc; background: #fff; box-shadow: 0 0 0 4px rgba(142, 82, 252, 0.08); }
        .icon-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #cbd5e1; }

        .btn-submit { 
          width: 100%; padding: 16px; background: #8e52fc; border: none; border-radius: 14px;
          color: #fff; font-size: 15px; font-weight: 700; cursor: pointer;
          transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 10px;
        }
        .btn-submit:hover { background: #7a3ef2; transform: translateY(-1px); box-shadow: 0 10px 20px rgba(142, 82, 252, 0.2); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .footer { text-align: center; margin-top: 24px; font-size: 13px; color: #94a3b8; }
        .link { color: #8e52fc; text-decoration: none; font-weight: 700; }
      `}</style>

      <div className="login-card">
        <div className="brand-header">
          <div className="logo-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V10l-7-7z"/>
              <path d="M14 3v7h7"/>
            </svg>
          </div>
          <div className="brand-name">PetCare</div>
          <div className="brand-tag">Staff Portal</div>
        </div>

        <div className="auth-panel">
          <h1 className="title">Halo Staf!</h1>
          <p className="subtitle">Pilih profil Anda untuk melanjutkan</p>

          <div className="profile-list">
            {profiles.map((p) => (
              <div 
                key={p.id} 
                className={`p-box ${activeProfile === p.id ? 'active' : ''}`}
                onClick={() => selProfile(p)}
              >
                <div className="p-ava" style={{ background: p.bg }}>{p.ava}</div>
                <div className="p-name">{p.name}</div>
              </div>
            ))}
          </div>

          <div className="input-group">
            <label className="label">Username</label>
            <div className="input-rel">
              <input 
                type="text" 
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Username"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="label">Password</label>
            <div className="input-rel">
              <input 
                type={showPass ? 'text' : 'password'} 
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
              />
              <span className="icon-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <button className="btn-submit" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Mengautentikasi...' : 'Masuk Dashboard'}
            {!isLoading && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
          </button>

          <div className="footer">
            Bukan staf? <Link href="/login/user" className="link">Masuk sebagai Pemilik</Link>
          </div>
        </div>
      </div>
    </div>
  );
}