'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SettingsSidebar from '@/components/SettingsSidebar';
import { createClient } from '@/utils/supabase/client';

export default function AdminAccountSettings() {
  const supabase = createClient();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pesan, setPesan] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [email, setEmail] = useState('');
  const [nama, setNama] = useState('Memuat data...');
  const [role, setRole] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Cadangan saat edit dibatalkan
  const [tempEmail, setTempEmail] = useState('');
  const [tempWhatsapp, setTempWhatsapp] = useState('');

  useEffect(() => {
    fetchDataAkun();
  }, []);

  const fetchDataAkun = async () => {
    setLoading(true);
    try {
      // 1. Ambil email dari Supabase Auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (user && user.email) {
        setEmail(user.email);
        setTempEmail(user.email);
      }

      // 2. Ambil nama & role dari localStorage
      const storedUser = localStorage.getItem('petcare_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setNama(parsedUser.name || 'Pengguna');
        if (parsedUser.role === 'admin') setRole('Admin Utama');
        else if (parsedUser.role === 'dokter') setRole('Dokter Klinik');
        else setRole(parsedUser.role);
      }

      // 3. Ambil nomor WhatsApp dari tabel staf berdasarkan UID
      if (user?.id) {
        const { data: stafData, error: stafError } = await supabase
          .from('staf')
          .select('whatsapp')
          .eq('id', user.id)
          .single();

        if (!stafError && stafData?.whatsapp) {
          setWhatsapp(stafData.whatsapp);
          setTempWhatsapp(stafData.whatsapp);
        }
      }
    } catch (error: any) {
      console.error('Gagal memuat data:', error.message);
      setNama('Pengguna Tidak Dikenal');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEmail(tempEmail);
    setWhatsapp(tempWhatsapp);
    setIsEditing(false);
    setPesan(null);
  };

  const handleSave = async () => {
    if (!email || !email.includes('@')) {
      setPesan({ text: 'Format email tidak valid!', type: 'error' });
      return;
    }

    // Validasi nomor WA jika diisi
    if (whatsapp) {
      const waClean = whatsapp.replace(/[^\d]/g, '');
      if (waClean.length < 9 || waClean.length > 15) {
        setPesan({ text: 'Nomor WhatsApp tidak valid (9–15 digit).', type: 'error' });
        return;
      }
    }

    setSaving(true);
    setPesan(null);

    try {
      // 1. Update email di Supabase Auth
      const { error: authUpdateError } = await supabase.auth.updateUser({ email });
      if (authUpdateError) throw authUpdateError;

      // 2. Normalisasi & simpan nomor WA ke tabel staf
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        let waFormatted: string | null = null;
        if (whatsapp) {
          const waClean = whatsapp.replace(/[^\d]/g, '');
          waFormatted = waClean.startsWith('0')
            ? '62' + waClean.slice(1)
            : waClean.startsWith('62')
            ? waClean
            : '62' + waClean;
        }

        const { error: stafUpdateError } = await supabase
          .from('staf')
          .update({ whatsapp: waFormatted })
          .eq('id', user.id);

        if (stafUpdateError) throw stafUpdateError;

        if (waFormatted) setWhatsapp(waFormatted);
        setTempWhatsapp(waFormatted || '');
      }

      setPesan({ text: 'Data akun berhasil diperbarui!', type: 'success' });
      setTempEmail(email);
      setIsEditing(false);
      setTimeout(() => setPesan(null), 4000);
    } catch (error: any) {
      console.error('Gagal update akun:', error.message);
      setPesan({ text: 'Gagal menyimpan: ' + error.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Format tampilan nomor WA: 6281234... → +62 812-3456-7890
  const formatWaDisplay = (raw: string) => {
    if (!raw) return '—';
    const digits = raw.replace(/[^\d]/g, '');
    if (digits.startsWith('62') && digits.length > 2) {
      const local = digits.slice(2);
      return '+62 ' + local.replace(/(\d{3,4})(\d{4})(\d{0,4})/, '$1-$2-$3').replace(/-$/, '');
    }
    return '+' + raw;
  };

  return (
    <div className="admin-body">
      <AdminSidebar active="pengaturan" />
      <main className="main-content">
        <AdminTopbar title="Akun Saya" subtitle="Kelola data pribadi Anda" name={nama} />

        <div className="scroll-area">
          <div className="settings-flex">
            <SettingsSidebar />

            <div className="form-card">
              <div className="card-header">
                <h2 className="card-title">Data Akun</h2>
              </div>
              <div className="card-body">
                {pesan && (
                  <div className={`alert-box ${pesan.type}`}>
                    {pesan.type === 'success' ? '✅ ' : '⚠️ '} {pesan.text}
                  </div>
                )}

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#a19db5' }}>
                    Menarik data akun dari database...
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Nama Pengguna</label>
                      <div className="read-only-box disabled-box">{nama}</div>
                    </div>

                    <div className="form-group">
                      <label>Email Login</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-input"
                          autoFocus
                        />
                      ) : (
                        <div className="read-only-box">{email}</div>
                      )}
                    </div>

                    {/* ── KOLOM BARU: Nomor WhatsApp ── */}
                    <div className="form-group">
                      <label>
                        Nomor WhatsApp
                        <span className="label-hint"> · tampil di halaman Konsultasi</span>
                      </label>
                      {isEditing ? (
                        <div style={{ position: 'relative' }}>
                          <span className="wa-prefix">+62</span>
                          <input
                            type="tel"
                            value={whatsapp.startsWith('62') ? whatsapp.slice(2) : whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '52px' }}
                            placeholder="812 3456 7890"
                          />
                        </div>
                      ) : (
                        <div className="read-only-box" style={{ color: whatsapp ? '#1a1a1a' : '#a19db5' }}>
                          {formatWaDisplay(whatsapp)}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Role / Jabatan</label>
                      <div className="read-only-box disabled-box" style={{ textTransform: 'capitalize' }}>
                        {role}
                      </div>
                    </div>

                    <div className="form-actions">
                      {isEditing ? (
                        <div className="btn-group">
                          <button onClick={handleCancel} className="cancel-btn" disabled={saving}>
                            Batal
                          </button>
                          <button onClick={handleSave} className="submit-btn" disabled={saving}>
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setIsEditing(true)} className="edit-btn">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit Data
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 32px; }
        .settings-flex { display: flex; gap: 32px; align-items: flex-start; }
        .form-card { flex: 1; background: #fff; border-radius: 28px; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); overflow: hidden; }
        .card-header { padding: 24px 32px; border-bottom: 1.5px solid #fdfbff; }
        .card-title { font-size: 16px; font-weight: 800; color: #1a1a1a; }
        .card-body { padding: 32px; }
        .form-group { margin-bottom: 24px; }
        .form-group label { display: block; font-size: 13px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; }
        .label-hint { font-size: 11px; font-weight: 500; color: #a19db5; }
        .form-input { width: 100%; padding: 14px 18px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 16px; font-size: 14px; color: #1a1a1a; outline: none; transition: all 0.2s; box-sizing: border-box; font-family: inherit; }
        .form-input:focus { border-color: #c084fc; background: #fff; box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.08); }
        .read-only-box { width: 100%; padding: 14px 18px; background: #fff; border: 1.5px solid #f0f0f0; border-radius: 16px; font-size: 14px; color: #1a1a1a; font-weight: 600; }
        .disabled-box { background: #fdfbff; color: #a19db5; border-color: #f5f5f5; cursor: not-allowed; font-weight: 500; }
        .wa-prefix { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); font-size: 14px; font-weight: 700; color: #8e52fc; pointer-events: none; }
        .form-actions { margin-top: 32px; }
        .btn-group { display: flex; gap: 16px; }
        .submit-btn { flex: 1; height: 52px; background: #8e52fc; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #fff; border: none; font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 20px rgba(142, 82, 252, 0.15); }
        .submit-btn:hover:not(:disabled) { background: #7a3eeb; transform: translateY(-2px); box-shadow: 0 12px 25px rgba(142, 82, 252, 0.25); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .cancel-btn { padding: 0 24px; height: 52px; background: #fff; border: 1.5px solid #ece4ff; border-radius: 16px; color: #8a80a0; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .cancel-btn:hover:not(:disabled) { background: #fdfbff; color: #1a1a1a; border-color: #d1c4e9; }
        .edit-btn { width: 100%; height: 52px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #8e52fc; font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .edit-btn:hover { background: #f4eeff; border-color: #d1c4e9; }
        .alert-box { padding: 16px 20px; border-radius: 14px; font-size: 13px; font-weight: 600; margin-bottom: 24px; line-height: 1.5; }
        .alert-box.success { background: #f0fff4; color: #166534; border: 1px solid #bbf7d0; }
        .alert-box.error { background: #fff5f5; color: #ff4757; border: 1px solid #ffebeb; }
      `}</style>
    </div>
  );
}