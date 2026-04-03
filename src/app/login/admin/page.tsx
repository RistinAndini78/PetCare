'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [user, setUser] = useState('admin');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [activeProfile, setActiveProfile] = useState('Admin');
  const router = useRouter();

  const profiles = [
    { id: 'Admin', name: 'Admin', ava: 'A', bg: 'var(--ink)' },
    { id: 'drh. Budi', name: 'drh. Budi', ava: 'B', bg: 'var(--pr)' },
    { id: 'drh. Siti', name: 'drh. Siti', ava: 'S', bg: 'var(--sc)' },
    { id: 'drh. Andi', name: 'drh. Andi', ava: 'A', bg: '#666' },
  ];

  const selProfile = (profile: any) => {
    setActiveProfile(profile.id);
    if (profile.id === 'Admin') setUser('admin');
    else if (profile.id === 'drh. Budi') setUser('drh_budi');
    else if (profile.id === 'drh. Siti') setUser('drh_siti');
    else if (profile.id === 'drh. Andi') setUser('drh_andi');
  };

  const handleLogin = () => {
    const profileMap: any = {
      'Admin': { name: 'drh. Andi Pratama', role: 'Admin Utama' },
      'drh. Budi': { name: 'drh. Budi', role: 'Dokter Klinik' },
      'drh. Siti': { name: 'drh. Siti', role: 'Dokter Klinik' },
      'drh. Andi': { name: 'drh. Andi Pratama', role: 'Admin Utama' }
    };

    if (pass === 'admin123') {
      const selected = profileMap[activeProfile] || profileMap['Admin'];
      localStorage.setItem('petcare_user', JSON.stringify(selected));
      alert('Selamat datang, ' + selected.name + '!');
      router.push('/admin/beranda');
    } else {
      alert('Kata sandi salah!');
    }
  };

  return (
    <div className="app" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
      <style jsx>{`
        .login-container { width:100%; max-width:400px; padding:20px; animation:fadeInUp .6s ease both; }
        .brand-section { text-align:center; margin-bottom:32px; }
        .brand-name { font-family:'Nunito',sans-serif; font-size:32px; font-weight:900; color:var(--pr); letter-spacing:-0.5px; }
        .brand-sub { font-size:12px; font-weight:700; color:var(--muted); letter-spacing:3px; text-transform:uppercase; margin-top:-4px; }
        .form-card { background:#fff; border-radius:24px; padding:32px; box-shadow:0 10px 40px rgba(142, 82, 252, 0.08); border:1.5px solid var(--border); }
        .form-title { font-size:24px; font-weight:800; color:var(--ink); margin-bottom:8px; text-align:center; }
        .form-desc { font-size:14px; color:var(--muted); margin-bottom:28px; text-align:center; }
        
        .profile-selection { display:flex; gap:10px; margin-bottom:24px; justify-content:center; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; }
        .profile-selection::-webkit-scrollbar { display:none; }
        .profile-card { flex:1; min-width:80px; padding:12px 6px; border:1.5px solid var(--border); border-radius:18px; text-align:center; cursor:pointer; transition:all .2s; background:var(--white); }
        .profile-card:hover { border-color:var(--pr-pale); background:var(--bg); }
        .profile-card.active { border-color:var(--pr); background:var(--pr-pale); box-shadow:0 0 0 4px var(--pr-pale); }
        .profile-ava { width:42px; height:42px; border-radius:12px; background:var(--pr); color:#fff; display:flex; align-items:center; justify-content:center; font-size:18px; margin:0 auto 8px; font-weight:800; font-family:'Nunito',sans-serif; }
        .profile-name { font-size:10px; font-weight:700; color:var(--ink); white-space:nowrap; }

        .input-group { margin-bottom:16px; }
        .input-group label { display:block; font-size:12px; font-weight:700; color:var(--muted); margin-bottom:6px; letter-spacing:0.3px; }
        .input-wrap { position:relative; }
        .input-wrap input { width:100%; padding:12px 40px 12px 14px; border:1.5px solid var(--border); border-radius:12px; font-size:14px; font-weight:500; color:var(--ink); background:#fafafa; outline:none; transition:border-color .2s, box-shadow .2s; box-sizing:border-box; font-family:var(--font-poppins),sans-serif; }
        .input-wrap input:focus { border-color:var(--pr); box-shadow:0 0 0 3px rgba(142,82,252,.1); background:#fff; }
        .input-wrap input::placeholder { color:#b0a0cc; }
        .input-icon { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:var(--muted); cursor:pointer; display:flex; align-items:center; }
      `}</style>

      <div className="login-container">
        <div className="brand-section">
          <svg className="dog-logo" viewBox="0 0 90 90" fill="none" style={{ width: '80px', height: '80px', marginBottom: '12px' }}>
            <circle cx="45" cy="44" r="28" fill="#8e52fc" fillOpacity="0.15"/>
            <path d="M45 15 C25 15 15 35 15 50 C15 65 30 75 45 75 C60 75 75 65 75 50 C75 35 65 15 45 15" fill="#8e52fc" fillOpacity="0.1"/>
            <circle cx="45" cy="43" r="21" fill="#8e52fc"/>
            <circle cx="37" cy="38" r="5" fill="#fff"/>
            <circle cx="53" cy="38" r="5" fill="#fff"/>
            <circle cx="37.5" cy="38" r="2.5" fill="#1a0a2d"/>
            <circle cx="53.5" cy="38" r="2.5" fill="#1a0a2d"/>
            <ellipse cx="45" cy="48" rx="4" ry="2.5" fill="#d463f2" fillOpacity="0.6"/>
            <path d="M40 54 Q45 58 50 54" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
          <div className="brand-name">PetCare</div>
          <div className="brand-sub">Admin Dashboard</div>
        </div>

        <div className="form-card">
          <div className="form-title">Login Admin</div>
          <div className="form-desc">Silakan masuk untuk mengelola klinik</div>

          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', textAlign: 'center' }}>Pilih Profil Login</div>
          
          <div className="profile-selection">
            {profiles.map((p) => (
              <div 
                key={p.id} 
                className={`profile-card ${activeProfile === p.id ? 'active' : ''}`}
                onClick={() => selProfile(p)}
              >
                <div className="profile-ava" style={{ background: p.bg }}>{p.ava}</div>
                <div className="profile-name">{p.name}</div>
              </div>
            ))}
          </div>

          <div className="input-group">
            <label>Username / Email</label>
            <div className="input-wrap">
              <input 
                type="text" 
                placeholder="Masukkan username" 
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Kata Sandi</label>
            <div className="input-wrap">
              <input 
                type={showPass ? 'text' : 'password'} 
                placeholder="Masukkan kata sandi" 
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              <span className="input-icon" onClick={() => setShowPass(!showPass)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </span>
            </div>
          </div>

          <button className="btn-primary" onClick={handleLogin}>
            Masuk Dashboard
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--muted)' }}>
            Bukan Staf Klinik? <Link href="/login/user" style={{ color: 'var(--pr)', fontWeight: 700, textDecoration: 'none' }}>Masuk sebagai Pemilik</Link>
          </div>
        </div>
      </div>
    </div>
  );
}




