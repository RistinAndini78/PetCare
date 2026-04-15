'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { createClient } from '@/utils/supabase/client';

export default function TambahPasien() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState<any[]>([]);
  
  // 1. Data form disederhanakan, hanya menyimpan ownerId
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    birthDate: '',
    gender: 'Jantan',
    colorMarks: '',
    ownerId: '' 
  });

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    const { data } = await supabase.from('owners').select('id, full_name, phone').order('full_name');
    setOwners(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. Validasi ketat: Wajib memilih pemilik
      if (!formData.ownerId) throw new Error('Silakan pilih pemilik yang terdaftar terlebih dahulu.');

      // 3. Langsung simpan data pasien
      const { error: patientError } = await supabase
        .from('patients')
        .insert([{
          name: formData.name,
          species: formData.species,
          breed: formData.breed,
          birth_date: formData.birthDate || null,
          gender: formData.gender,
          color_marks: formData.colorMarks,
          owner_id: formData.ownerId
        }]);

      if (patientError) throw patientError;

      router.push('/admin/pasien');
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-body">
      <AdminSidebar active="pasien" />
      <main className="main-content">
        <div className="topbar">
          <Link href="/admin/pasien" className="back-btn" title="Kembali">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div className="t-right">
            <div className="t-title">Tambah Pasien Baru</div>
            <div className="t-sub">Daftarkan hewan peliharaan ke sistem</div>
          </div>
        </div>

        <form className="scroll-area" onSubmit={handleSubmit}>
          <div className="form-card">
            <div className="card-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8e52fc" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 10h.01M16 10h.01M12 14v.01M10 16a2 2 0 0 0 4 0"/></svg>
              <span>Informasi Hewan</span>
            </div>
            <div className="card-body">
              <div className="grid-2">
                <div className="form-group">
                  <label>Nama Hewan</label>
                  <input 
                    type="text" 
                    placeholder="Masukkan nama hewan" 
                    className="f-input" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Jenis Hewan</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Kucing, Anjing" 
                    className="f-input" 
                    required
                    value={formData.species}
                    onChange={e => setFormData({...formData, species: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Ras / Breed</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Persia / Golden Retriever" 
                    className="f-input" 
                    value={formData.breed}
                    onChange={e => setFormData({...formData, breed: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Tanggal Lahir (Opsional)</label>
                  <input 
                    type="date" 
                    className="f-input" 
                    value={formData.birthDate}
                    onChange={e => setFormData({...formData, birthDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Jenis Kelamin</label>
                  <select 
                    className="f-input"
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="Jantan">Jantan</option>
                    <option value="Betina">Betina</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Warna / Ciri Khas</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Putih belang coklat" 
                    className="f-input" 
                    value={formData.colorMarks}
                    onChange={e => setFormData({...formData, colorMarks: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-card">
            <div className="card-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8e52fc" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Informasi Pemilik</span>
            </div>
            <div className="card-body">
              {/* 4. Bagian checkbox dihapus, select dibuat full-width */}
              <div className="form-group full-width">
                <label>Cari & Pilih Pemilik Terdaftar</label>
                <select 
                  className="f-input"
                  value={formData.ownerId}
                  onChange={e => setFormData({...formData, ownerId: e.target.value})}
                  required
                >
                  <option value="">-- Ketik atau Pilih Pemilik --</option>
                  {owners.map(o => (
                    <option key={o.id} value={o.id}>{o.full_name} ({o.phone})</option>
                  ))}
                </select>
                <span style={{ fontSize: '11px', color: '#a19db5', marginTop: '6px', display: 'block' }}>
                  *Jika pemilik belum terdaftar, silakan tambahkan melalui menu Manajemen Pemilik.
                </span>
              </div>
            </div>
          </div>

          <div className="bottom-actions">
            <button type="button" className="btn-cancel" onClick={() => router.back()}>Batal</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Pasien Baru'}
            </button>
          </div>
        </form>
      </main>

      <style jsx global>{`
        /* --- CSS SAMA PERSIS SEPERTI SEBELUMNYA --- */
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 40px; }

        .topbar { padding: 24px 40px 0; display: flex; align-items: flex-start; justify-content: space-between; }
        .back-btn { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; color: #a19db5; text-decoration: none; margin-left: -12px; border-radius: 12px; transition: all 0.2s; }
        .back-btn:hover { background: #f4eeff; color: #8e52fc; }
        
        .t-title { font-size: 20px; font-weight: 900; color: #1a1a1a; letter-spacing: -0.5px; margin-top: 6px; }
        .t-sub { font-size: 13px; color: #a19db5; font-weight: 600; margin-top: 2px; }

        .form-card { background: #fff; border-radius: 24px; border: 1.5px solid #ece4ff; box-shadow: 0 8px 24px rgba(142, 82, 252, 0.03); margin-bottom: 24px; overflow: hidden; }
        .card-header { padding: 20px 32px; border-bottom: 1.5px solid #f9f7ff; display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 800; color: #1a1a1a; }
        .card-body { padding: 32px; }

        .form-label { font-size: 11.5px; font-weight: 800; color: #666; margin-bottom: 12px; display: flex; gap: 8px; align-items: center; }
        .req { background: #ff4757; color: #fff; padding: 2px 6px; border-radius: 6px; font-size: 9px; letter-spacing: 0.5px; }
        
        .upload-box { border: 2px dashed #ece4ff; background: #fdfbff; border-radius: 16px; padding: 40px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; margin-bottom: 32px; }
        .upload-box:hover { border-color: #8e52fc; background: #fdfbff; }
        .up-txt { font-size: 14px; font-weight: 700; color: #1a1a1a; margin-top: 8px; }
        .up-sub { font-size: 12px; color: #a19db5; font-weight: 500; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .align-bottom { align-items: flex-end; }
        .form-group label { display: block; font-size: 12.5px; font-weight: 800; color: #444; margin-bottom: 8px; }
        .full-width { grid-column: span 2; }
        .f-input { width: 100%; padding: 14px 18px; background: #fdfbff; border: 1.5px solid #ece4ff; border-radius: 12px; font-size: 13.5px; color: #1a1a1a; transition: all 0.2s; font-weight: 500; font-family: inherit; }
        .f-input:focus { outline: none; border-color: #8e52fc; background: #fff; box-shadow: 0 0 0 4px rgba(142, 82, 252, 0.1); }
        .f-input::placeholder { color: #a19db5; }

        .or-txt { font-size: 13px; color: #666; font-weight: 600; padding-bottom: 16px; }

        .bottom-actions { display: flex; gap: 16px; margin-top: 32px; }
        .btn-cancel { padding: 16px 32px; background: #fff; color: #1a1a1a; border: 1.5px solid #ece4ff; border-radius: 14px; font-size: 14.5px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .btn-cancel:hover { border-color: #8e52fc; color: #8e52fc; }
        .btn-save { flex: 1; padding: 16px; background: #8e52fc; color: #fff; border: none; border-radius: 14px; font-size: 14.5px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .btn-save:hover { background: #7a3eeb; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(142, 82, 252, 0.2); }
      `}</style>
    </div>
  );
}