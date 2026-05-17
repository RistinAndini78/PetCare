'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function AdminLogin() {
  const router = useRouter();
  const supabase = createClient();

  const [emailInput, setEmailInput] = useState('admin@klinik.com');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!pass) {
      setErrorMsg('Harap masukkan password!');
      return;
    }

    if (!emailInput) {
      setErrorMsg('Harap masukkan email!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: pass,
      });

      if (authError) throw new Error('Password salah atau email tidak terdaftar.');

      let sessionData = {
        id: authData.user.id,
        name: 'Admin Utama',
        role: 'admin'
      };

      localStorage.setItem('petcare_user', JSON.stringify(sessionData));
      
      // Tunggu sebentar agar LocalStorage benar-benar tersimpan sebelum pindah halaman
      setTimeout(() => {
        router.push('/admin/beranda');
      }, 300);

    } catch (error: any) {
      console.error("Login error:", error.message);
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style jsx>{`
        .login-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f9faff; font-family: 'Inter', sans-serif; }
        .login-card { width: 100%; max-width: 420px; padding: 20px; animation: fadeIn 0.8s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .brand-header { text-align: center; margin-bottom: 32px; }
        .logo-box { width: 56px; height: 56px; background: #f4eeff; border-radius: 16px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: #8e52fc; box-shadow: 0 4px 12px rgba(142, 82, 252, 0.08); }
        .brand-name { font-size: 26px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px; }
        .brand-tag { font-size: 10px; font-weight: 700; color: #8e52fc; text-transform: uppercase; letter-spacing: 2px; }
        .auth-panel { background: #ffffff; border-radius: 28px; padding: 40px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04); border: 1px solid #f0f0f5; }
        .title { font-size: 22px; font-weight: 800; color: #1a1a2e; margin-bottom: 6px; text-align: center; }
        .subtitle { font-size: 14px; color: #7f8c9b; text-align: center; margin-bottom: 30px; }
        .input-group { margin-bottom: 20px; }
        .label { display: block; font-size: 11px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .input-rel input { width: 100%; padding: 14px 16px; border: 1.5px solid #edf2f7; border-radius: 12px; font-size: 14px; font-weight: 600; background: #fcfdfe; outline: none; transition: 0.2s; }
        .input-rel input:focus { border-color: #8e52fc; background: #fff; box-shadow: 0 0 0 4px rgba(142, 82, 252, 0.08); }
        .icon-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 18px; }
        .btn-submit { width: 100%; padding: 16px; background: #8e52fc; border: none; border-radius: 14px; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-submit:hover:not(:disabled) { background: #7a3ef2; }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .footer { text-align: center; margin-top: 24px; font-size: 13px; color: #94a3b8; }
        .link { color: #8e52fc; text-decoration: none; font-weight: 700; }
        .error-msg { color: #ff4757; font-size: 12px; font-weight: 700; text-align: center; margin-bottom: 16px; background: #ffebee; padding: 10px; border-radius: 8px; }
      `}</style>

      <div className="login-card">
        <div className="brand-header">
          <div className="logo-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="brand-name">PetCare</div>
          <div className="brand-tag">Staff Portal</div>
        </div>

        <div className="auth-panel">
          <h1 className="title">Halo Admin!</h1>
          <p className="subtitle">Silakan masuk untuk mengelola klinik</p>

          {errorMsg && <div className="error-msg">{errorMsg}</div>}

          <div className="input-group">
            <label className="label">Email Login</label>
            <div className="input-rel">
              <input 
                type="email" 
                value={emailInput} 
                onChange={(e) => setEmailInput(e.target.value)} 
                placeholder="admin@klinik.com" 
                autoFocus
              />
            </div>
          </div>

          <div className="input-group">
            <label className="label">Password</label>
            <div className="input-rel" style={{ position: 'relative' }}>
              <input 
                type={showPass ? 'text' : 'password'} 
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="********"
              />
              <span className="icon-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <button className="btn-submit" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Mengautentikasi...' : 'Masuk Dashboard'}
          </button>

        </div>
      </div>
    </div>
  );
}
