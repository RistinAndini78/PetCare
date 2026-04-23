'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function TambahStaf() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    nama: '',
    email: '',
    peran: '',
    password: '',
    whatsapp: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.nama || !form.email || !form.peran || !form.password) {
      setErrorMsg('Semua kolom harus diisi.');
      return;
    }

    if (form.password.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      return;
    }

    // Validasi nomor WhatsApp (opsional tapi jika diisi harus valid)
    if (form.whatsapp) {
      const waClean = form.whatsapp.replace(/[^\d]/g, '');
      if (waClean.length < 9 || waClean.length > 15) {
        setErrorMsg('Nomor WhatsApp tidak valid (9–15 digit).');
        return;
      }
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Buat akun di Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw new Error('Gagal mendaftarkan akun login: ' + authError.message);

      const newUserId = authData.user?.id;
      if (!newUserId) throw new Error('Gagal mendapatkan ID pengguna baru.');

      // Normalisasi nomor WA ke format E.164 tanpa '+' (62xxx)
      let waFormatted = '';
      if (form.whatsapp) {
        const waClean = form.whatsapp.replace(/[^\d]/g, '');
        waFormatted = waClean.startsWith('0')
          ? '62' + waClean.slice(1)
          : waClean.startsWith('62')
          ? waClean
          : '62' + waClean;
      }

      // 2. Simpan profil ke tabel 'staf' termasuk kolom whatsapp
      const { error: dbError } = await supabase.from('staf').insert([
        {
          id: newUserId,
          full_name: form.nama,
          role: form.peran,
          status: 'Aktif',
          whatsapp: waFormatted || null,
        },
      ]);

      if (dbError)
        throw new Error('Akun login terbuat, namun gagal menyimpan profil: ' + dbError.message);

      alert('Staf baru berhasil ditambahkan!');
      router.push('/admin/pengaturan/staf');
      router.refresh();
    } catch (err: any) {
      console.error('Error Tambah Staf:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="header">
        <Link href="/admin/pengaturan/staf" className="back-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </Link>
        <h1 className="title">Tambah Staf Baru</h1>
      </div>

      <div className="content">
        <div className="form-card">
          {errorMsg && (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', fontWeight: '600' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="form-group">
            <label>Nama Lengkap</label>
            <input type="text" name="nama" placeholder="Masukkan nama staf" className="f-input" value={form.nama} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email Staf</label>
            <input type="email" name="email" placeholder="email@happypaws.id" className="f-input" value={form.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Peran / Jabatan</label>
            <input type="text" name="peran" placeholder="Misal: Dokter Klinik / Resepsionis" className="f-input" value={form.peran} onChange={handleChange} />
          </div>

          {/* ── KOLOM BARU: Nomor WhatsApp ── */}
          <div className="form-group">
            <label>
              Nomor WhatsApp{' '}
              <span style={{ fontWeight: 400, color: '#a19db5', fontSize: '11px' }}>(opsional)</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span className="wa-prefix">+62</span>
              <input
                type="tel"
                name="whatsapp"
                placeholder="812 3456 7890"
                className="f-input"
                style={{ paddingLeft: '52px' }}
                value={form.whatsapp}
                onChange={handleChange}
              />
            </div>
            <p className="field-hint">
              Nomor ini akan tampil di halaman Konsultasi untuk pemilik hewan.
            </p>
          </div>

          <div className="form-group">
            <label>Password Awal</label>
            <input type="password" name="password" placeholder="Minimal 6 karakter" className="f-input" value={form.password} onChange={handleChange} />
          </div>

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Menyimpan Data...' : 'Simpan Data Staf'}
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
        .f-input { width: 100%; padding: 14px 16px; background: #fdfbff; border: 1.5px solid #ece4ff; border-radius: 12px; font-size: 13.5px; color: #1a1a1a; transition: all 0.2s; font-weight: 500; font-family: inherit; box-sizing: border-box; }
        .f-input:focus { outline: none; border-color: #8e52fc; background: #fff; box-shadow: 0 0 0 4px rgba(142, 82, 252, 0.1); }
        .f-input::placeholder { color: #a19db5; }
        .wa-prefix { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 13.5px; font-weight: 700; color: #8e52fc; pointer-events: none; }
        .field-hint { font-size: 11px; color: #a19db5; margin-top: 6px; line-height: 1.5; }
        .submit-btn { width: 100%; padding: 16px; background: #8e52fc; color: #fff; border: none; border-radius: 12px; font-size: 14px; font-weight: 800; margin-top: 12px; transition: all 0.2s; }
        .submit-btn:hover:not(:disabled) { background: #7a3eeb; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(142, 82, 252, 0.2); }
      `}</style>
    </div>
  );
}