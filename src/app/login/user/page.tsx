'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserLogin() {
  const router = useRouter();
  const [wa, setWa] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    // Mock login logic
    if (wa === '081234567890' && pass === '123456') {
      router.push('/beranda');
    } else {
      alert('Password berhasil, mengarahkan ke dashboard...');
      router.push('/beranda');
    }
  };

  return (
    <div className="login-v-body">
      <style jsx>{`
        .login-v-body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fdfbff; font-family: 'Nunito', sans-serif; }
        .login-wrap { width: 100%; max-width: 440px; padding: 24px; position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; }
        
        .brand-header { text-align: center; margin-bottom: 32px; }
        .logo-box { width: 56px; height: 56px; background: linear-gradient(135deg, #d463f2 0%, #8e52fc 100%); border-radius: 16px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 8px 24px rgba(142, 82, 252, 0.3); }
        .b-title { font-size: 20px; font-weight: 900; color: #c084fc; letter-spacing: -0.3px; }
        .b-sub { font-size: 10px; font-weight: 800; color: #1a1a1a; text-transform: uppercase; letter-spacing: 2px; margin-top: -2px; }

        .auth-panel { background: #fff; width: 100%; border-radius: 28px; padding: 40px 32px; border: 1.5px solid #f0f0f0; box-shadow: 0 16px 50px rgba(142, 82, 252, 0.04); }
        .panel-h1 { font-size: 22px; font-weight: 900; color: #1a1a1a; text-align: center; margin-bottom: 6px; letter-spacing: -0.5px; }
        .panel-p { font-size: 13.5px; font-weight: 600; color: #a19db5; text-align: center; margin-bottom: 32px; }

        .input-wrap { margin-bottom: 24px; }
        .input-wrap label { display: block; font-size: 12px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; }
        .i-box { position: relative; width: 100%; }
        .i-box input { width: 100%; padding: 14px 16px; padding-right: 48px; border: 1.5px solid #ece4ff; border-radius: 12px; font-size: 14px; font-weight: 600; color: #1a1a1a; outline: none; transition: all 0.2s; font-family: inherit; }
        .i-box input::placeholder { color: #d0c8dd; font-weight: 600; }
        .i-box input:focus { border-color: #8e52fc; background: #fff; }
        .i-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #a19db5; cursor: pointer; display: flex; }
        
        .btn-masuk { width: 100%; height: 52px; background: linear-gradient(135deg, #d463f2 0%, #8e52fc 100%); border-radius: 14px; color: #fff; border: none; font-size: 15px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; transition: all 0.2s; box-shadow: 0 10px 24px rgba(142, 82, 252, 0.2); }
        .btn-masuk:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(142, 82, 252, 0.3); }

        .akt-link { text-align: center; font-size: 12px; font-weight: 600; color: #a19db5; margin-top: 24px; }
        .akt-link a { color: #8e52fc; font-weight: 800; text-decoration: none; }

        .divider { border-top: 1px solid #f0f0f0; margin: 32px 0 24px; }
        .switch-link { text-align: center; font-size: 12px; font-weight: 600; color: #a19db5; }
        .switch-link a { color: #d463f2; font-weight: 800; text-decoration: none; }
      `}</style>
      
      <div className="login-wrap">
        <div className="brand-header">
          <div className="logo-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div className="b-title">PetCare</div>
          <div className="b-sub">Owner Portal</div>
        </div>

        <div className="auth-panel">
          <h1 className="panel-h1">Masuk ke Akun</h1>
          <p className="panel-p">Akses riwayat kesehatan hewan Anda</p>

          <div className="input-wrap">
            <label>Nomor WhatsApp</label>
            <div className="i-box">
              <input type="tel" placeholder="081234567890" value={wa} onChange={e => setWa(e.target.value)} />
              <div className="i-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.24 9.77a19.79 19.79 0 0 1-3.07-8.67A2 2 0 012.18 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.91 9.14a16 16 0 006.95 6.95l1.41-1.41a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
            </div>
          </div>

          <div className="input-wrap">
            <label>Password</label>
            <div className="i-box">
              <input type={showPass ? 'text' : 'password'} placeholder="Masukkan password" value={pass} onChange={e => setPass(e.target.value)} />
              <div className="i-icon" onClick={() => setShowPass(!showPass)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
            </div>
          </div>

          <button className="btn-masuk" onClick={handleLogin}>
            Masuk <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>

          <div className="akt-link">
            Belum aktivasi? <Link href="/register">Klik di sini</Link>
          </div>

          <div className="divider"></div>

          <div className="switch-link">
            Staf Klinik? <Link href="/login/admin">Masuk Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
