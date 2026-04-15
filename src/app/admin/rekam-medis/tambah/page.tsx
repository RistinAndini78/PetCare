'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { createClient } from '@/utils/supabase/client';

export default function TambahEntriMedis() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  
  // State untuk integrasi stok vaksin
  const [availableVaccines, setAvailableVaccines] = useState<any[]>([]);
  const [selectedVaccineId, setSelectedVaccineId] = useState('');

  const [formData, setFormData] = useState({
    patientId: '',
    treatmentDate: new Date().toISOString().split('T')[0],
    doctorName: 'drh. Andi Pratama',
    treatmentType: 'pemeriksaan',
    weightKg: '',
    diagnosisNotes: ''
  });

  useEffect(() => {
    fetchPatients();
    fetchAvailableVaccines();
  }, []);

  const fetchPatients = async () => {
    const { data } = await supabase
      .from('patients')
      .select('id, name, owners(full_name)')
      .order('name');
    setPatients(data || []);
  };

  const fetchAvailableVaccines = async () => {
    const { data } = await supabase
      .from('vaksin')
      .select('id, nama_produk, stok_sekarang')
      .gt('stok_sekarang', 0)
      .order('nama_produk');
    setAvailableVaccines(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!formData.patientId) return alert("Silakan pilih pasien terlebih dahulu!");
    if (formData.treatmentType === 'vaksin' && !selectedVaccineId) {
      return alert("Silakan pilih produk vaksin yang tersedia!");
    }

    setLoading(true);

    try {
      // 1. SIMPAN REKAM MEDIS
      const { error: recordError } = await supabase
        .from('medical_records')
        .insert([{
          patient_id: formData.patientId,
          treatment_date: formData.treatmentDate,
          doctor_name: formData.doctorName,
          treatment_type: formData.treatmentType,
          weight_kg: formData.weightKg ? parseFloat(formData.weightKg) : null,
          diagnosis_notes: formData.diagnosisNotes
        }]);

      if (recordError) throw recordError;

      // 2. LOGIKA KHUSUS VAKSIN (Sinkronisasi Stok & Jadwal AI)
      if (formData.treatmentType === 'vaksin' && selectedVaccineId) {
        // Ambil data stok terbaru untuk menghindari selisih data
        const { data: vData } = await supabase
          .from('vaksin')
          .select('stok_sekarang, nama_produk')
          .eq('id', selectedVaccineId)
          .single();

        if (vData) {
          // A. Kurangi Stok
          await supabase
            .from('vaksin')
            .update({ stok_sekarang: vData.stok_sekarang - 1 })
            .eq('id', selectedVaccineId);

          // B. Buat Jadwal Vaksin Selanjutnya (Memicu Reminder AI)
          // Menghitung H+1 Tahun secara otomatis
          const nextDate = new Date(formData.treatmentDate);
          nextDate.setFullYear(nextDate.getFullYear() + 1);

          const { error: scheduleError } = await supabase
            .from('vaccination_schedules')
            .insert([{
              patient_id: formData.patientId,
              vaccine_name: vData.nama_produk,
              next_vaccine_date: nextDate.toISOString().split('T')[0],
              status: 'scheduled'
            }]);

          if (scheduleError) console.error("Gagal menjadwalkan:", scheduleError);
        }
      }

      alert("Data berhasil disimpan! Stok telah terpotong & jadwal pengingat telah dibuat.");
      router.push('/admin/rekam-medis');
      router.refresh();

    } catch (err: any) {
      console.error("Error:", err);
      alert(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-body">
      <AdminSidebar active="rekam-medis" />
      <main className="main-content">
        <div className="topbar-plain">
          <Link href="/admin/rekam-medis" className="back-link">← Kembali ke Riwayat</Link>
          <h1>Tambah Entri Medis Baru</h1>
        </div>

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-card">
            <div className="form-section">
              <label>Identitas Pasien</label>
              <select
                required
                className="f-input"
                value={formData.patientId}
                onChange={e => setFormData({ ...formData, patientId: e.target.value })}
              >
                <option value="">-- Cari Pasien --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - {p.owners?.full_name}</option>
                ))}
              </select>
            </div>

            <div className="form-grid">
              <div className="form-section">
                <label>Tanggal Tindakan</label>
                <input type="date" className="f-input" value={formData.treatmentDate} onChange={e => setFormData({ ...formData, treatmentDate: e.target.value })} />
              </div>

              <div className="form-section">
                <label>Jenis Tindakan</label>
                <select className="f-input" value={formData.treatmentType} onChange={e => {
                  setFormData({ ...formData, treatmentType: e.target.value });
                  if (e.target.value !== 'vaksin') setSelectedVaccineId('');
                }}>
                  <option value="pemeriksaan">Pemeriksaan Rutin</option>
                  <option value="vaksin">Vaksinasi</option>
                  <option value="operasi">Operasi/Bedah</option>
                  <option value="grooming">Medical Grooming</option>
                </select>
              </div>
            </div>

            {formData.treatmentType === 'vaksin' && (
              <div className="form-section highlight-box">
                <label>Pilih Produk Vaksin (Update Stok Otomatis)</label>
                <select
                  required
                  className="f-input"
                  value={selectedVaccineId}
                  onChange={e => {
                    const vId = e.target.value;
                    setSelectedVaccineId(vId);
                    const vData = availableVaccines.find(x => x.id === vId);
                    if (vData) setFormData({ ...formData, diagnosisNotes: `Pemberian Vaksin ${vData.nama_produk}` });
                  }}
                >
                  <option value="">-- Pilih Stok Tersedia --</option>
                  {availableVaccines.map(v => (
                    <option key={v.id} value={v.id}>{v.nama_produk} (Sisa: {v.stok_sekarang})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-section">
              <label>Berat Badan (kg)</label>
              <input type="number" step="0.1" className="f-input" placeholder="0.0" value={formData.weightKg} onChange={e => setFormData({ ...formData, weightKg: e.target.value })} />
            </div>

            <div className="form-section">
              <label>Diagnosa & Hasil Pemeriksaan</label>
              <textarea
                rows={4}
                className="f-textarea"
                placeholder="Tuliskan catatan medis secara detail..."
                value={formData.diagnosisNotes}
                onChange={e => setFormData({ ...formData, diagnosisNotes: e.target.value })}
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => router.back()} className="btn-secondary">Batal</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Menyimpan...' : 'Simpan & Update Sistem'}
              </button>
            </div>
          </div>
        </form>
      </main>

      <style jsx>{`
        .admin-body { display: flex; background: #f8f9fd; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
        .main-content { margin-left: 220px; flex: 1; padding: 40px; }
        .topbar-plain { margin-bottom: 30px; }
        .back-link { color: #8e52fc; text-decoration: none; font-weight: 700; font-size: 14px; }
        h1 { font-size: 24px; font-weight: 900; color: #1a1a1a; margin-top: 10px; }
        
        .form-container { max-width: 800px; }
        .form-card { background: #fff; padding: 40px; border-radius: 24px; border: 1px solid #eef0f7; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
        
        .form-section { margin-bottom: 24px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .highlight-box { background: #f4eeff; padding: 24px; border-radius: 20px; border: 2px dashed #8e52fc; }
        
        label { display: block; font-size: 11px; font-weight: 800; color: #a19db5; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px; }
        .f-input, .f-textarea { width: 100%; padding: 14px 18px; border: 1.5px solid #eef0f7; border-radius: 14px; font-size: 14px; outline: none; transition: 0.2s; background: #fdfbff; }
        .f-input:focus { border-color: #8e52fc; background: #fff; }
        
        .form-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 40px; }
        .btn-primary { background: linear-gradient(135deg, #8e52fc 0%, #6c31e0 100%); color: #fff; border: none; padding: 14px 30px; border-radius: 16px; font-weight: 800; cursor: pointer; transition: 0.3s; box-shadow: 0 8px 15px rgba(142, 82, 252, 0.2); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 20px rgba(142, 82, 252, 0.3); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-secondary { background: #fff; border: 1.5px solid #eef0f7; padding: 14px 30px; border-radius: 16px; font-weight: 700; color: #a19db5; cursor: pointer; }
      `}</style>
    </div>
  );
}