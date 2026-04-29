'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';


export default function UserLogin() {
  const router = useRouter();
  const supabase = createClient();
  
  const [wa, setWa] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const normalizeWaDigits = (value: string) => value.replace(/\D/g, '');

  const toWaVariants = (raw: string) => {
    // simpan beberapa varian yang mungkin ada di DB: 08..., 62..., +62...
    const digits = normalizeWaDigits(raw);
    if (!digits) return [];

    let local = digits;
    if (local.startsWith('62')) local = '0' + local.substring(2);
    if (local.startsWith('620')) local = '0' + local.substring(3);

    const internationalDigits = local.startsWith('0') ? '62' + local.substring(1) : digits;
    const internationalPlus = '+' + internationalDigits;

    return Array.from(new Set([
      raw.trim(),
      local,
      internationalDigits,
      internationalPlus,
      '+' + digits,
      digits,
    ])).filter(Boolean);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wa || !pass) return alert('Silakan isi nomor WA dan password!');
    
    setLoading(true);

    try {
      const variants = toWaVariants(wa);
      if (variants.length === 0) {
        alert('Nomor WhatsApp tidak valid');
        return;
      }

      const { data: owners, error } = await supabase
        .from('owners')
        .select('id, full_name, phone, email, address, created_at, password')
        .in('phone', variants)
        .limit(5);

      if (error) throw error;

      const inputDigits = normalizeWaDigits(wa);
      const ownerMatch = (owners || []).find((o: any) => normalizeWaDigits(String(o.phone || '')) === inputDigits)
        || (owners || [])[0];

      if (!ownerMatch) {
        alert('Nomor WA tidak terdaftar. Silakan hubungi klinik.');
        return;
      }

      const dbPass = String((ownerMatch as any)?.password || '123456');
      if (pass !== dbPass) {
        alert('Nomor WA atau Password salah');
        return;
      }

      localStorage.setItem('petcare_owner', JSON.stringify({
        id: ownerMatch.id,
        full_name: ownerMatch.full_name,
        phone: ownerMatch.phone,
        email: ownerMatch.email,
      }));

      router.push('/beranda');
      router.refresh();

    } catch (error: any) {
      console.error("Login Error:", error?.message || error);
      alert('Gagal Masuk: ' + (error?.message || 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-v-body">
      <style jsx>{`
        /* Style tetap sama seperti sebelumnya */
        .login-v-body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fdfbff; font-family: 'Plus Jakarta Sans', sans-serif; }
        .login-wrap { width: 100%; max-width: 440px; padding: 24px; position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; }
        .brand-header { text-align: center; margin-bottom: 32px; }
        .logo-box { width: 56px; height: 56px; background: #f4eeff; border-radius: 16px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: #8e52fc; box-shadow: 0 4px 12px rgba(142, 82, 252, 0.08); }
        .b-title { font-size: 20px; font-weight: 900; color: #c084fc; letter-spacing: -0.3px; }
        .b-sub { font-size: 10px; font-weight: 800; color: #1a1a1a; text-transform: uppercase; letter-spacing: 2px; margin-top: -2px; }
        .auth-panel { background: #fff; width: 100%; border-radius: 28px; padding: 40px 32px; border: 1.5px solid #f0f0f0; box-shadow: 0 16px 50px rgba(142, 82, 252, 0.04); }
        .panel-h1 { font-size: 22px; font-weight: 900; color: #1a1a1a; text-align: center; margin-bottom: 6px; letter-spacing: -0.5px; }
        .panel-p { font-size: 13.5px; font-weight: 600; color: #a19db5; text-align: center; margin-bottom: 32px; }
        .input-wrap { margin-bottom: 24px; }
        .input-wrap label { display: block; font-size: 11px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .i-box { position: relative; width: 100%; }
        .i-box input { width: 100%; padding: 14px 16px; border: 1.5px solid #ece4ff; border-radius: 14px; font-size: 14px; font-weight: 600; color: #1a1a1a; outline: none; transition: 0.2s; }
        .i-box input:focus { border-color: #8e52fc; box-shadow: 0 0 0 4px rgba(142, 82, 252, 0.1); }
        .i-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #a19db5; cursor: pointer; display: flex; }
        .btn-masuk { width: 100%; height: 52px; background: linear-gradient(135deg, #d463f2 0%, #8e52fc 100%); border-radius: 16px; color: #fff; border: none; font-size: 15px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; transition: 0.2s; }
        .btn-masuk:disabled { opacity: 0.6; cursor: not-allowed; }
        .akt-link { text-align: center; font-size: 12px; font-weight: 600; color: #a19db5; margin-top: 24px; }
        .akt-link a { color: #8e52fc; font-weight: 800; text-decoration: none; }
        .divider { border-top: 1px solid #f0f0f0; margin: 32px 0 24px; }
        .switch-link { text-align: center; font-size: 12px; font-weight: 600; color: #a19db5; }
        .switch-link a { color: #d463f2; font-weight: 800; text-decoration: none; }
      `}</style>
      
      <div className="login-wrap">
        <div className="brand-header">
          <div className="logo-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          
          <div className="b-title">PetCare</div>
          <div className="b-sub">Owner Portal</div>
        </div>

        <form className="auth-panel" onSubmit={handleLogin}>
          <h1 className="panel-h1">Masuk ke Akun</h1>
          <p className="panel-p">Akses riwayat kesehatan hewan Anda</p>

          <div className="input-wrap">
            <label>Nomor WhatsApp</label>
            <div className="i-box">
              <input 
                type="tel" 
                placeholder="6281234567890" 
                value={wa} 
                onChange={e => setWa(e.target.value)} 
                required
              />
              <div className="i-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.24 9.77a19.79 19.79 0 0 1-3.07-8.67A2 2 0 012.18 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.91 9.14a16 16 0 006.95 6.95l1.41-1.41a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
            </div>
          </div>

          <div className="input-wrap">
            <label>Password</label>
            <div className="i-box">
              <input 
                type={showPass ? 'text' : 'password'} 
                placeholder="Masukkan password" 
                value={pass} 
                onChange={e => setPass(e.target.value)} 
                required
              />
              <div className="i-icon" onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁️'}
              </div>
            </div>
          </div>

          <button type="submit" className="btn-masuk" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'} 
            {!loading && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
          </button>

          <div className="akt-link" style={{ lineHeight: 1.6 }}>
            Akun pemilik <b>dibuat oleh klinik</b>. Jika belum bisa login, silakan hubungi admin klinik untuk didaftarkan.
          </div>

          <div className="divider"></div>

          <div className="switch-link">
            Staf Klinik? <Link href="/login/admin">Masuk Dashboard</Link>
          </div>
        </form>
      </div>
    </div>
  );
}