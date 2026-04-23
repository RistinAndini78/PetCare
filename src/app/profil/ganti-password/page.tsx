'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function GantiPassword() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [owner, setOwner] = useState<any | null>(null);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const strength = useMemo(() => {
    const v = newPass || '';
    return {
      hasLen: v.length >= 8,
      hasNum: /\d/.test(v),
      hasLetter: /[a-zA-Z]/.test(v),
    };
  }, [newPass]);

  useEffect(() => {
    const loadOwner = async () => {
      setLoading(true);
      try {
        const stored = localStorage.getItem('petcare_owner');
        const ownerSession = stored ? JSON.parse(stored) : null;
        if (!ownerSession?.id) return router.push('/login/user');

        const { data, error: oErr } = await supabase
          .from('owners')
          .select('id, full_name, phone, password')
          .eq('id', ownerSession.id)
          .single();

        if (oErr) throw oErr;
        setOwner(data);
      } catch (e) {
        setError('Gagal memuat data. Silakan login kembali.');
      } finally {
        setLoading(false);
      }
    };
    loadOwner();
  }, []);

  const handleSave = async () => {
    setError(null); setSuccess(null);
    if (!oldPass || !newPass || !confirmPass) return setError('Semua kolom wajib diisi.');
    if (newPass.length < 8) return setError('Password baru minimal 8 karakter.');
    if (newPass !== confirmPass) return setError('Konfirmasi password tidak cocok.');

    setSaving(true);
    try {
      const { error: uErr } = await supabase
        .from('owners')
        .update({ password: newPass })
        .eq('id', owner.id);

      if (uErr) throw uErr;
      setSuccess('Password berhasil diperbarui!');
      setOldPass(''); setNewPass(''); setConfirmPass('');
    } catch (e) {
      setError('Gagal memperbarui password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <header className="header">
        <button onClick={() => router.back()} className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 className="header-title">Ganti Password</h1>
      </header>

      <main className="content-wrap">
        <div className="glass-card">
          <div className="icon-wrapper">
            <div className="lock-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <p className="hint">Amankan akun Anda dengan password yang kuat dan unik.</p>
          </div>

          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <div className="form-stack">
            {[
              { label: 'Password Lama', val: oldPass, set: setOldPass, show: showOld, setShow: setShowOld },
              { label: 'Password Baru', val: newPass, set: setNewPass, show: showNew, setShow: setShowNew },
              { label: 'Konfirmasi Password', val: confirmPass, set: setConfirmPass, show: showConfirm, setShow: setShowConfirm }
            ].map((f, i) => (
              <div key={i} className="field">
                <label>{f.label}</label>
                <div className="input-wrapper">
                  <input type={f.show ? 'text' : 'password'} value={f.val} onChange={(e) => f.set(e.target.value)} className="input-field" />
                  <button type="button" className="toggle-btn" onClick={() => f.setShow(!f.show)}>{f.show ? '🙈' : '👁️'}</button>
                </div>
              </div>
            ))}

            <div className="strength-meter">
              <div className={`rule ${strength.hasLen ? 'active' : ''}`}>Minimal 8 karakter</div>
              <div className={`rule ${strength.hasLetter ? 'active' : ''}`}>Mengandung huruf</div>
              <div className={`rule ${strength.hasNum ? 'active' : ''}`}>Mengandung angka</div>
            </div>

            <button className="submit-btn" onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Password Baru'}
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`
        .page-container { min-height: 100vh; background: #fcfcfd; padding-bottom: 40px; }
        .header { padding: 40px 20px; display: flex; align-items: center; gap: 16px; }
        .back-btn { width: 44px; height: 44px; border-radius: 14px; background: #fff; border: 1px solid #eee; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #666; }
        .header-title { font-size: 20px; font-weight: 800; color: #1a1a1a; }
        .content-wrap { display: flex; justify-content: center; padding: 0 20px; }
        .glass-card { width: 100%; max-width: 480px; background: #fff; padding: 32px; border-radius: 32px; border: 1px solid #f0f0f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .icon-wrapper { text-align: center; margin-bottom: 32px; }
        .lock-icon { width: 64px; height: 64px; background: #f4eeff; color: #8e52fc; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .hint { color: #6b7280; font-size: 14px; font-weight: 500; }
        .field { margin-bottom: 20px; }
        .field label { display: block; font-size: 12px; font-weight: 800; color: #4b5563; margin-bottom: 8px; text-transform: uppercase; }
        .input-wrapper { position: relative; }
        .input-field { width: 100%; padding: 16px; background: #f9f9fb; border: 1px solid #e5e7eb; border-radius: 16px; font-size: 15px; outline: none; transition: 0.3s; }
        .input-field:focus { background: #fff; border-color: #8e52fc; box-shadow: 0 0 0 4px rgba(142, 82, 252, 0.1); }
        .toggle-btn { position: absolute; right: 12px; top: 12px; background: none; border: none; cursor: pointer; font-size: 16px; }
        .strength-meter { display: flex; gap: 12px; margin-bottom: 24px; }
        .rule { font-size: 11px; font-weight: 700; color: #9ca3af; display: flex; align-items: center; gap: 6px; }
        .rule.active { color: #2ed573; }
        .submit-btn { width: 100%; padding: 18px; background: #8e52fc; color: #fff; border-radius: 16px; font-weight: 800; border: none; cursor: pointer; transition: 0.3s; }
        .submit-btn:hover { background: #7a3eeb; }
        .alert { padding: 16px; border-radius: 16px; font-size: 13px; font-weight: 700; margin-bottom: 20px; }
        .error { background: #fee2e2; color: #991b1b; }
        .success { background: #dcfce7; color: #166534; }
      `}</style>
    </div>
  );
}