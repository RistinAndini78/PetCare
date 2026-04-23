'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SettingsSidebar from '@/components/SettingsSidebar';
import { createClient } from '@/utils/supabase/client';

export default function ProfilKlinik() {
  const supabase = createClient();
  
  // State untuk Data
  const [namaKlinik, setNamaKlinik] = useState('');
  const [jamOperasional, setJamOperasional] = useState('');
  
  // State untuk Status UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pesan, setPesan] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // State untuk Mode Edit
  const [isEditing, setIsEditing] = useState(false);
  
  // State cadangan (untuk restore jika klik Batal)
  const [tempData, setTempData] = useState({ nama: '', jam: '' });

  useEffect(() => {
    fetchProfilKlinik();
  }, []);

  const fetchProfilKlinik = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clinic_profile')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setNamaKlinik(data.nama_klinik || '');
        setJamOperasional(data.jam_operasional || '');
        // Simpan cadangan juga
        setTempData({ nama: data.nama_klinik || '', jam: data.jam_operasional || '' });
      }
    } catch (error: any) {
      console.error("Gagal mengambil profil:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBatalEdit = () => {
    // Kembalikan nilai ke cadangan terakhir
    setNamaKlinik(tempData.nama);
    setJamOperasional(tempData.jam);
    setIsEditing(false);
    setPesan(null);
  };

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setPesan(null);

    try {
      const { error } = await supabase
        .from('clinic_profile')
        .upsert({ 
          id: 1, 
          nama_klinik: namaKlinik, 
          jam_operasional: jamOperasional 
        });

      if (error) throw error;
      
      // Update cadangan dengan data baru yang sukses disimpan
      setTempData({ nama: namaKlinik, jam: jamOperasional });
      
      setPesan({ text: "Profil klinik berhasil diperbarui!", type: 'success' });
      setIsEditing(false); // Kembali ke mode lihat
      
      setTimeout(() => setPesan(null), 4000);
    } catch (error: any) {
      console.error("Gagal menyimpan profil:", error.message);
      setPesan({ text: "Gagal menyimpan: " + error.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-body">
      <AdminSidebar active="pengaturan" />
      <main className="main-content">
        <AdminTopbar title="Profil Klinik" subtitle="Kelola identitas dan jam operasional klinik Anda" />
        
        <div className="scroll-area">
          <div className="settings-flex">
            <SettingsSidebar />
            
            <div className="form-card">
              <div className="card-header-flex">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="header-icon">🏥</div>
                  <div>
                    <h2 className="card-title">Informasi Dasar Klinik</h2>
                    <p className="card-subtitle">Data ini akan ditampilkan ke pelanggan melalui portal dan WhatsApp.</p>
                  </div>
                </div>
              </div>
              
              <div className="card-body">
                {pesan && (
                  <div className={`alert-box ${pesan.type}`}>
                    {pesan.type === 'success' ? '✅ ' : '⚠️ '} {pesan.text}
                  </div>
                )}

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#a19db5' }}>
                    Memuat data profil...
                  </div>
                ) : (
                  <form onSubmit={handleSimpan}>
                    <div className="form-group">
                      <label className="f-label">Nama Klinik</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="f-input" 
                          placeholder="Contoh: PetCare Clinic"
                          value={namaKlinik}
                          onChange={(e) => setNamaKlinik(e.target.value)}
                          required
                          autoFocus
                        />
                      ) : (
                        <div className="read-only-box">{namaKlinik || <span style={{color: '#a19db5', fontStyle: 'italic'}}>Belum diatur</span>}</div>
                      )}
                    </div>

                    <div className="form-group" style={{ marginTop: '24px' }}>
                      <label className="f-label">Jam Operasional</label>
                      {isEditing ? (
                        <textarea 
                          className="f-textarea" 
                          rows={4}
                          placeholder="Contoh:&#10;Senin - Jumat: 08:00 - 20:00&#10;Sabtu - Minggu: 09:00 - 17:00"
                          value={jamOperasional}
                          onChange={(e) => setJamOperasional(e.target.value)}
                          required
                        />
                      ) : (
                        <div className="read-only-box" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                          {jamOperasional || <span style={{color: '#a19db5', fontStyle: 'italic'}}>Belum diatur</span>}
                        </div>
                      )}
                    </div>

                    <div className="form-actions">
                      {isEditing ? (
                        <div className="btn-group">
                          <button 
                            type="button" 
                            onClick={handleBatalEdit} 
                            className="cancel-btn"
                            disabled={saving}
                          >
                            Batal
                          </button>
                          <button 
                            type="submit" 
                            className="btn-save"
                            disabled={saving}
                          >
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                          </button>
                        </div>
                      ) : (
                        <button 
                          type="button" 
                          onClick={() => setIsEditing(true)} 
                          className="edit-btn"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit Data Klinik
                        </button>
                      )}
                    </div>
                  </form>
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

        .form-card { flex: 1; background: #fff; border-radius: 24px; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); overflow: hidden; }
        .card-header-flex { padding: 28px 32px; border-bottom: 1.5px solid #f9f7ff; }
        .header-icon { width: 48px; height: 48px; background: #f4eeff; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .card-title { font-size: 18px; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
        .card-subtitle { font-size: 13px; color: #a19db5; font-weight: 500; }
        
        .card-body { padding: 32px; }

        .form-group { display: flex; flex-direction: column; gap: 10px; }
        .f-label { font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; letter-spacing: 0.5px; }
        
        /* Input Styles (Mode Edit) */
        .f-input, .f-textarea { width: 100%; padding: 16px 20px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 14px; font-size: 14.5px; color: #1a1a1a; font-family: inherit; transition: 0.3s; outline: none; }
        .f-input:focus, .f-textarea:focus { border-color: #8e52fc; background: #fff; box-shadow: 0 4px 12px rgba(142, 82, 252, 0.08); }
        .f-textarea { resize: vertical; min-height: 120px; }

        /* Read Only Styles (Mode Lihat) */
        .read-only-box { width: 100%; padding: 16px 20px; background: #fff; border: 1.5px solid #f0f0f0; border-radius: 14px; font-size: 14.5px; color: #1a1a1a; font-weight: 600; }

        .form-actions { margin-top: 32px; display: flex; justify-content: flex-end; }
        .btn-group { display: flex; gap: 16px; width: 100%; max-width: 400px; justify-content: flex-end; }

        /* Buttons */
        .btn-save { padding: 16px 32px; background: linear-gradient(135deg, #8e52fc 0%, #6c31e0 100%); color: #fff; border: none; border-radius: 14px; font-size: 14px; font-weight: 800; cursor: pointer; transition: 0.3s; box-shadow: 0 8px 20px rgba(142, 82, 252, 0.25); flex: 1; display: flex; justify-content: center; align-items: center; }
        .btn-save:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(142, 82, 252, 0.35); }
        .btn-save:disabled { opacity: 0.7; cursor: not-allowed; }

        .cancel-btn { padding: 0 24px; height: 52px; background: #fff; border: 1.5px solid #ece4ff; border-radius: 14px; color: #8a80a0; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .cancel-btn:hover:not(:disabled) { background: #fdfbff; color: #1a1a1a; border-color: #d1c4e9; }

        .edit-btn { width: auto; min-width: 200px; height: 52px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #8e52fc; font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s; padding: 0 24px; }
        .edit-btn:hover { background: #f4eeff; border-color: #d1c4e9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(142, 82, 252, 0.08); }

        .alert-box { padding: 16px 20px; border-radius: 14px; font-size: 14px; font-weight: 600; margin-bottom: 24px; }
        .alert-box.success { background: #f0fff4; color: #166534; border: 1px solid #bbf7d0; }
        .alert-box.error { background: #fff5f5; color: #ff4757; border: 1px solid #ffebeb; }
      `}</style>
    </div>
  );
}