'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { supabase } from '@/utils/supabase/client';

export default function TambahPemilik() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('owners')
        .insert([
          {
            full_name: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            address: `${formData.address}${formData.city ? ' - ' + formData.city : ''}`
          }
        ]);

      if (insertError) throw insertError;

      router.push('/admin/pemilik');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-body">
      <AdminSidebar active="pemilik" />
      <main className="main-content">
        <div className="topbar">
          <Link href="/admin/pemilik" className="back-btn" title="Kembali">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div className="t-right">
            <div className="t-title">Registrasi Pemilik</div>
            <div className="t-sub">Tambahkan klien baru beserta data aksesnya</div>
          </div>
        </div>

        <div className="scroll-area">
          <form className="form-card" onSubmit={handleSubmit}>
            <div className="card-header">
              <div className="header-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              </div>
              <div className="header-text">
                <h2>Formulir Registrasi Pemilik</h2>
                <p>Data WhatsApp harus aktif untuk pengiriman riwayat medis otomatis ke nomor yang terdaftar.</p>
              </div>
            </div>

            <div className="card-body">
              {error && (
                <div style={{ background: '#fff5f5', color: '#ff4757', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: 600, border: '1px solid #ffebeb' }}>
                  ⚠️ {error}
                </div>
              )}

              <div className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Informasi Dasar
              </div>
              
              <div className="grid-2">
                <div className="form-group">
                  <label>NAMA LENGKAP</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama sesuai identitas" 
                      className="f-input with-icon" 
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>NO. WHATSAPP</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <input 
                      type="text" 
                      placeholder="Contoh: 081234567890" 
                      className="f-input with-icon" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>ALAMAT EMAIL</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input 
                      type="email" 
                      placeholder="email@contoh.com" 
                      className="f-input with-icon" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>KOTA DOMISILI</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <input 
                      type="text" 
                      placeholder="Pilih kota domisili" 
                      className="f-input with-icon" 
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>ALAMAT LENGKAP</label>
                  <textarea 
                    placeholder="Nama jalan, nomor rumah, RT/RW, dan patokan..." 
                    rows={3} 
                    className="f-textarea"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <div className="section-title" style={{ marginTop: '40px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Akses Portal & Keamanan
              </div>
              
              <div className="alert-box">
                <div className="alert-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div className="alert-txt">
                  Kata sandi ini digunakan pelanggan untuk masuk ke aplikasi <b>PetCare Owner Portal</b> dan memonitor riwayat kesehatan peliharaannya.
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>KATA SANDI AWAL (DEFAULT)</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                    <input type="text" defaultValue="123456" className="f-input with-icon" disabled style={{ background: '#f8f6fb', opacity: 0.7 }} />
                  </div>
                </div>
                <div className="form-group">
                  <label>STATUS PEMILIK</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="#1dd1a1" stroke="#1dd1a1" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    <input type="text" defaultValue="Aktivasi Otomatis" className="f-input with-icon disabled-input" disabled />
                  </div>
                </div>
              </div>

              <div className="bottom-actions">
                <Link href="/admin/pemilik" className="btn-cancel">Batal & Kembali</Link>
                <button type="submit" className="btn-save" disabled={loading}>
                  <span>{loading ? 'Menyimpan...' : 'Simpan & Daftarkan Pemilik Baru'}</span>
                  {!loading && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #f8f6fb; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 40px; display: flex; justify-content: center; }

        .topbar { padding: 24px 40px 0; display: flex; align-items: flex-start; justify-content: space-between; }
        .back-btn { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; color: #a19db5; text-decoration: none; margin-left: -12px; border-radius: 12px; transition: all 0.2s; }
        .back-btn:hover { background: #fff; color: #8e52fc; box-shadow: 0 4px 12px rgba(142, 82, 252, 0.05); }
        
        .t-right { text-align: right; }
        .t-title { font-size: 24px; font-weight: 900; color: #1a1a1a; letter-spacing: -0.5px; }
        .t-sub { font-size: 13.5px; color: #a19db5; font-weight: 600; margin-top: 4px; }

        .form-card { background: #fff; width: 100%; max-width: 860px; border-radius: 24px; border: 1px solid rgba(142, 82, 252, 0.1); box-shadow: 0 20px 40px rgba(142, 82, 252, 0.04); overflow: hidden; margin-bottom: 24px; }
        
        .card-header { padding: 36px 40px; background: linear-gradient(135deg, #7a3eeb 0%, #aa7af1 100%); color: #fff; display: flex; align-items: center; gap: 20px; }
        .header-icon { width: 56px; height: 56px; border-radius: 16px; background: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
        .header-text h2 { font-size: 22px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.3px; }
        .header-text p { font-size: 14px; opacity: 0.9; font-weight: 500; margin: 0; line-height: 1.5; }
        
        .card-body { padding: 48px 40px; }

        .section-title { font-size: 15px; font-weight: 800; color: #1a1a1a; margin-bottom: 28px; display: flex; align-items: center; gap: 12px; border-bottom: 2px solid #f8f6fb; padding-bottom: 16px; }
        .section-title svg { color: #8e52fc; }
        
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 32px; }
        .form-group label { display: block; font-size: 11px; font-weight: 800; color: #666; margin-bottom: 10px; letter-spacing: 0.8px; text-transform: uppercase; }
        .full-width { grid-column: span 2; }
        
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 16px; color: #a19db5; transition: all 0.2s; pointer-events: none; }
        
        .f-input, .f-textarea { width: 100%; border: 1.5px solid #ece4ff; border-radius: 14px; font-size: 14.5px; color: #1a1a1a; transition: all 0.25s; font-weight: 500; font-family: inherit; background: #fdfbff; }
        .f-input { padding: 16px 20px; height: 54px; }
        .f-input.with-icon { padding-left: 48px; }
        .f-textarea { padding: 16px 20px; resize: none; line-height: 1.5; }
        
        .f-input:focus, .f-textarea:focus { outline: none; border-color: #8e52fc; background: #fff; box-shadow: 0 4px 12px rgba(142, 82, 252, 0.08); }
        .input-wrapper:focus-within .input-icon { color: #8e52fc; }
        .f-input::placeholder, .f-textarea::placeholder { color: #b5b1c9; font-weight: 400; }
        
        .disabled-input { background: #f4eeff; color: #8e52fc; font-weight: 700; border-color: transparent; }

        .alert-box { background: rgba(142, 82, 252, 0.05); border: 1.5px dashed rgba(142, 82, 252, 0.2); border-radius: 16px; padding: 20px 24px; display: flex; align-items: flex-start; gap: 16px; color: #444; font-size: 14px; margin-bottom: 32px; line-height: 1.6; }
        .alert-icon { color: #8e52fc; flex-shrink: 0; margin-top: 2px; }
        .alert-txt b { color: #1a1a1a; font-weight: 700; }

        .bottom-actions { display: flex; gap: 20px; margin-top: 56px; align-items: center; justify-content: flex-end; }
        .btn-cancel { padding: 16px 32px; color: #a19db5; font-size: 14.5px; font-weight: 700; cursor: pointer; transition: all 0.2s; text-decoration: none; border-radius: 14px; }
        .btn-cancel:hover { background: #f8f6fb; color: #1a1a1a; }
        
        .btn-save { padding: 16px 36px; background: #1a1a1a; color: #fff; border: none; border-radius: 14px; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 12px; }
        .btn-save:hover { background: #8e52fc; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(142, 82, 252, 0.25); }
      `}</style>
    </div>
  );
}
