'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { supabase } from '@/utils/supabase/client';

export default function TambahEntriMedis() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    patientId: '',
    treatmentDate: new Date().toISOString().split('T')[0],
    doctorName: 'drh. Andi Pratama',
    treatmentType: 'vaksin',
    weightKg: '',
    diagnosisNotes: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const { data } = await supabase
      .from('patients')
      .select('id, name, owners(full_name)')
      .order('name');
    setPatients(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('medical_records')
        .insert([{
          patient_id: formData.patientId,
          treatment_date: formData.treatmentDate,
          doctor_name: formData.doctorName,
          treatment_type: formData.treatmentType,
          weight_kg: formData.weightKg ? parseFloat(formData.weightKg) : null,
          diagnosis_notes: formData.diagnosisNotes
        }]);

      if (error) throw error;

      router.push('/admin/rekam-medis');
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-body">
      <AdminSidebar active="rekam-medis" />
      <main className="main-content">
        <div className="topbar">
          <Link href="/admin/beranda" className="back-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div className="t-right">
            <div className="t-title">Tambah Entri Medis</div>
            <div className="t-sub">Catat riwayat tindakan atau vaksinasi pasien</div>
          </div>
        </div>

        <form className="scroll-area" onSubmit={handleSubmit}>
          <div className="form-card">
            <div className="card-header">
              <div className="header-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
              </div>
              <div className="header-text">
                <h2>Formulir Rekam Medis Baru</h2>
                <p>Data tindakan medis akan secara otomatis tesinkronasi ke aplikasi <b>Portal Pemilik</b>.</p>
              </div>
            </div>

            <div className="card-body">
              <div className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 10h.01M16 10h.01M12 14v.01M10 16a2 2 0 0 0 4 0"/></svg>
                Pilih Pasien Terdaftar
              </div>
              
              <div className="grid-1">
                <div className="form-group">
                  <label>NAMA HEWAN - PEMILIK</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <select 
                      className="f-input with-icon f-select"
                      required
                      value={formData.patientId}
                      onChange={e => setFormData({...formData, patientId: e.target.value})}
                    >
                      <option value="">Cari dan pilih pasien...</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - {p.owners?.full_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="section-title" style={{ marginTop: '40px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                Detail Tindakan Medis
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>TANGGAL TINDAKAN</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <input 
                      type="date" 
                      className="f-input with-icon" 
                      required
                      value={formData.treatmentDate}
                      onChange={e => setFormData({...formData, treatmentDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>DOKTER PENANGGUNG JAWAB</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input type="text" value={formData.doctorName} className="f-input with-icon" disabled style={{ background: '#f8f6fb' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label>JENIS TINDAKAN</label>
                  <select 
                    className="f-input f-select"
                    value={formData.treatmentType}
                    onChange={e => setFormData({...formData, treatmentType: e.target.value})}
                  >
                    <option value="vaksin">Vaksin / Imunisasi</option>
                    <option value="pemeriksaan">Pemeriksaan Rutin / Rawat Jalan</option>
                    <option value="operasi">Tindakan Bedah / Operasi</option>
                    <option value="grooming">Medical Grooming</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>BERAT BADAN (KG)</label>
                  <input 
                    type="number" 
                    placeholder="Contoh: 3.5" 
                    step="0.1" 
                    className="f-input" 
                    value={formData.weightKg}
                    onChange={e => setFormData({...formData, weightKg: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>HASIL DIAGNOSA & PENGOBATAN</label>
                  <textarea 
                    placeholder="Tuliskan keluhan, hasil pemeriksaan, atau rincian obat yang diberikan..." 
                    rows={4} 
                    className="f-textarea"
                    value={formData.diagnosisNotes}
                    onChange={e => setFormData({...formData, diagnosisNotes: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <div className="bottom-actions">
                <Link href="/admin/beranda" className="btn-cancel">Batal</Link>
                <button type="submit" className="btn-save" disabled={loading}>
                  <span>{loading ? 'Menyimpan...' : 'Simpan Entri Medis'}</span>
                  {!loading && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 40px; display: flex; justify-content: center; }

        .topbar { padding: 24px 40px 0; display: flex; align-items: flex-start; justify-content: space-between; }
        .back-btn { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; color: #a19db5; text-decoration: none; margin-left: -12px; border-radius: 12px; transition: all 0.2s; }
        .back-btn:hover { background: #fff; color: #8e52fc; box-shadow: 0 4px 12px rgba(142, 82, 252, 0.05); }
        
        .t-right { text-align: right; }
        .t-title { font-size: 24px; font-weight: 900; color: #1a1a1a; letter-spacing: -0.5px; }
        .t-sub { font-size: 13.5px; color: #a19db5; font-weight: 600; margin-top: 4px; }

        .form-card { background: #fff; width: 100%; max-width: 860px; border-radius: 24px; border: 1.5px solid #ece4ff; box-shadow: 0 20px 40px rgba(142, 82, 252, 0.04); overflow: hidden; margin-bottom: 24px; }
        
        .card-header { padding: 36px 40px; background: linear-gradient(135deg, #e056fd 0%, #be2edd 100%); color: #fff; display: flex; align-items: center; gap: 20px; }
        .header-icon { width: 56px; height: 56px; border-radius: 16px; background: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
        .header-text h2 { font-size: 22px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.3px; }
        .header-text p { font-size: 14px; opacity: 0.9; font-weight: 500; margin: 0; line-height: 1.5; }
        
        .card-body { padding: 48px 40px; }

        .section-title { font-size: 15px; font-weight: 800; color: #1a1a1a; margin-bottom: 28px; display: flex; align-items: center; gap: 12px; border-bottom: 2px solid #f9f7ff; padding-bottom: 16px; }
        .section-title svg { color: #e056fd; }
        
        .grid-1 { display: grid; grid-template-columns: 1fr; gap: 24px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 32px; }
        .form-group label { display: block; font-size: 11px; font-weight: 800; color: #666; margin-bottom: 10px; letter-spacing: 0.8px; text-transform: uppercase; }
        .full-width { grid-column: span 2; }
        
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 16px; color: #a19db5; transition: all 0.2s; pointer-events: none; }
        
        .f-input, .f-textarea { width: 100%; border: 1.5px solid #ece4ff; border-radius: 14px; font-size: 14.5px; color: #1a1a1a; transition: all 0.25s; font-weight: 500; font-family: inherit; background: #fdfbff; }
        .f-input { padding: 16px 20px; height: 54px; }
        .f-input.with-icon { padding-left: 48px; }
        .f-textarea { padding: 16px 20px; resize: none; line-height: 1.5; }
        
        .f-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a19db5' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 20px center; padding-right: 48px; cursor: pointer; }

        .f-input:focus, .f-textarea:focus { outline: none; border-color: #be2edd; background: #fff; box-shadow: 0 4px 12px rgba(190, 46, 221, 0.08); }
        .input-wrapper:focus-within .input-icon { color: #be2edd; }
        
        .bottom-actions { display: flex; gap: 20px; margin-top: 56px; align-items: center; justify-content: flex-end; }
        .btn-cancel { padding: 16px 32px; color: #a19db5; font-size: 14.5px; font-weight: 700; cursor: pointer; transition: all 0.2s; text-decoration: none; border-radius: 14px; }
        .btn-cancel:hover { background: #f9f7ff; color: #1a1a1a; }
        
        .btn-save { padding: 16px 36px; background: linear-gradient(135deg, #e056fd 0%, #be2edd 100%); color: #fff; border: none; border-radius: 14px; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 12px; }
        .btn-save:hover { background: #be2edd; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(190, 46, 221, 0.25); }
      `}</style>
    </div>
  );
}
