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
  const [availableVaccines, setAvailableVaccines] = useState<any[]>([]);
  const [selectedVaccineId, setSelectedVaccineId] = useState('');

  const [formData, setFormData] = useState({
    patientId: '',
    treatmentDate: new Date().toISOString().split('T')[0],
    doctorName: '',
    treatmentType: 'pemeriksaan',
    weightKg: '',
    diagnosisNotes: '',
    actionTaken: '',
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('petcare_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user?.name) setFormData(prev => ({ ...prev, doctorName: user.name }));
      }
    } catch (_) { /* abaikan */ }

    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl) {
      setFormData(prev => ({ ...prev, patientId: idFromUrl }));
    }

    fetchPatients();
    fetchAvailableVaccines();
  }, []);

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('id, name, owners(full_name)')
      .order('name');
    if (error) console.error('Gagal fetch pasien:', error);
    setPatients((data || []).map(p => ({ ...p, id: String(p.id) })));
  };

  const fetchAvailableVaccines = async () => {
    const { data, error } = await supabase
      .from('vaksin')
      .select('id, nama_produk, stok_sekarang')
      .gt('stok_sekarang', 0)
      .order('nama_produk');

    if (error) { console.error('Gagal fetch vaksin:', error); return; }
    setAvailableVaccines((data || []).map(v => ({ ...v, id: String(v.id) })));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // LOGIKA INTI VAKSIN:
  //
  // Ketika pasien divaksin (termasuk H-1 dari jadwal), sistem akan:
  //  1. Cari jadwal vaksin aktif (`scheduled`) untuk pasien + nama vaksin ini.
  //     Jika ditemukan, tandai SEMUA jadwal aktif tersebut jadi `completed`.
  //     (Ini menghapus notifikasi yang sudah tidak relevan.)
  //  2. Hitung jadwal berikutnya = tanggal_tindakan + 1 tahun.
  //     Tidak pernah dihitung dari jadwal lama, sehingga tidak ada "pergeseran".
  //  3. Buat 1 jadwal baru dengan status `scheduled`.
  //
  // Dengan demikian, H-1 = selesai, tidak ada notifikasi sisa, dan jadwal
  // berikutnya selalu dihitung mundur dari tanggal vaksin dilakukan.
  // ─────────────────────────────────────────────────────────────────────────────
  const processVaccineSchedule = async (
    patientId: string,
    vaccineName: string,
    treatmentDateStr: string, // format: YYYY-MM-DD
  ) => {
    // 1. Selesaikan semua jadwal aktif untuk pasien + vaksin ini
    //    (menangani kasus H-1 maupun tepat waktu maupun telat)
    const { error: completeErr } = await supabase
      .from('vaccination_schedules')
      .update({ status: 'completed' })
      .eq('patient_id', patientId)
      .eq('vaccine_name', vaccineName)
      .eq('status', 'scheduled');

    if (completeErr) {
      // Bukan error fatal — mungkin memang belum ada jadwal sebelumnya (vaksin pertama)
      console.warn('Tidak ada jadwal aktif yang ditemukan / gagal update:', completeErr.message);
    }

    // 2. Hitung jadwal berikutnya dari tanggal tindakan (BUKAN dari jadwal lama)
    const treatmentDate = new Date(treatmentDateStr);
    const nextDate = new Date(treatmentDate);
    nextDate.setFullYear(nextDate.getFullYear() + 1);
    const nextDateStr = nextDate.toISOString().split('T')[0];

    // 3. Buat jadwal baru
    const { error: schedErr } = await supabase
      .from('vaccination_schedules')
      .insert([{
        patient_id:        patientId,
        vaccine_name:      vaccineName,
        next_vaccine_date: nextDateStr,
        status:            'scheduled',
      }]);

    if (schedErr) {
      console.warn('Gagal membuat jadwal vaksin berikutnya:', schedErr.message);
    }

    return nextDateStr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientId) {
      alert('Silakan pilih pasien terlebih dahulu!');
      return;
    }
    if (!formData.doctorName.trim()) {
      alert('Nama dokter / staf wajib diisi!');
      return;
    }

    let finalActionTaken = formData.actionTaken.trim();
    let finalDiagnosis   = formData.diagnosisNotes.trim();

    if (formData.treatmentType === 'vaksin') {
      if (!selectedVaccineId) {
        alert('Silakan pilih produk vaksin yang tersedia!');
        return;
      }

      let selectedVaccine = availableVaccines.find(
        v => String(v.id) === String(selectedVaccineId)
      );

      // Fallback jika state belum terisi (race condition)
      if (!selectedVaccine) {
        console.warn('Vaksin tidak ada di state — fallback query ke Supabase...');
        const { data: freshData, error: freshErr } = await supabase
          .from('vaksin')
          .select('id, nama_produk, stok_sekarang')
          .eq('id', selectedVaccineId)
          .single();

        if (freshErr || !freshData) {
          alert('Gagal mengambil data vaksin. Pastikan stok masih tersedia lalu coba lagi.');
          return;
        }
        selectedVaccine = { ...freshData, id: String(freshData.id) };
      }

      finalActionTaken = `Vaksinasi: ${selectedVaccine.nama_produk}`;
      if (!finalDiagnosis) {
        finalDiagnosis = 'Kondisi hewan sehat. Pemberian vaksin rutin.';
      }
    } else {
      if (!finalActionTaken) {
        alert('Mohon isi kolom Tindakan Medis / Resep Obat!');
        return;
      }
      if (!finalDiagnosis) {
        alert('Mohon lengkapi kolom Keluhan & Diagnosa!');
        return;
      }
    }

    setLoading(true);

    try {
      // ── 1. Simpan rekam medis ─────────────────────────────────────────────
      const { error: recordError } = await supabase
        .from('medical_records')
        .insert([{
          patient_id:      formData.patientId,
          treatment_date:  formData.treatmentDate,
          doctor_name:     formData.doctorName.trim(),
          treatment_type:  formData.treatmentType,
          weight_kg:       formData.weightKg ? parseFloat(formData.weightKg) : null,
          diagnosis_notes: finalDiagnosis,
          action_taken:    finalActionTaken,
        }]);

      if (recordError) throw recordError;

      // ── 2. Proses lanjutan khusus vaksin ─────────────────────────────────
      if (formData.treatmentType === 'vaksin' && selectedVaccineId) {
        // 2a. Ambil nama vaksin & stok terkini langsung dari DB (data segar)
        const { data: vaccineData, error: vaccineErr } = await supabase
          .from('vaksin')
          .select('stok_sekarang, nama_produk')
          .eq('id', selectedVaccineId)
          .single();

        if (vaccineErr) throw vaccineErr;

        if (vaccineData) {
          // 2b. Kurangi stok 1 dosis
          const { error: stockErr } = await supabase
            .from('vaksin')
            .update({ stok_sekarang: vaccineData.stok_sekarang - 1 })
            .eq('id', selectedVaccineId);

          if (stockErr) throw stockErr;

          // 2c. Selesaikan jadwal lama & buat jadwal baru (logika inti)
          const nextVaccineDate = await processVaccineSchedule(
            formData.patientId,
            vaccineData.nama_produk,
            formData.treatmentDate,
          );

          console.log(
            `✅ Vaksin selesai. Jadwal berikutnya: ${nextVaccineDate}`
          );
        }
      }

      alert('Data berhasil disimpan!');
      router.push(`/admin/rekam-medis?id=${encodeURIComponent(formData.patientId)}`);
      router.refresh();

    } catch (err: any) {
      console.error('Error saat menyimpan:', err);
      alert(`Gagal menyimpan: ${err?.message || 'Terjadi kesalahan tidak diketahui.'}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedPatient = patients.find(p => String(p.id) === String(formData.patientId));

  return (
    <div className="admin-body">
      <AdminSidebar active="rekam-medis" />
      <main className="main-content">

        <div className="topbar-plain">
          <Link href="/admin/rekam-medis" className="back-link">← Kembali ke Riwayat</Link>
          <h1>Tambah Entri Medis Baru</h1>
          {selectedPatient && (
            <div className="patient-hint">
              Pasien: <strong>{selectedPatient.name}</strong>
              {selectedPatient.owners?.full_name && (
                <> — Pemilik: <strong>{selectedPatient.owners.full_name}</strong></>
              )}
            </div>
          )}
        </div>

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-card">

            <div className="section-title">Identitas Pasien</div>
            <div className="form-section">
              <label>Pilih Pasien</label>
              <select
                required
                className="f-input"
                value={formData.patientId}
                onChange={e => setFormData({ ...formData, patientId: e.target.value })}
              >
                <option value="">-- Pilih Pasien --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.owners?.full_name || 'Pemilik tidak diketahui'}
                  </option>
                ))}
              </select>
            </div>

            <div className="section-title" style={{ marginTop: '8px' }}>Detail Tindakan</div>
            <div className="form-grid">
              <div className="form-section">
                <label>Tanggal Tindakan</label>
                <input
                  type="date"
                  className="f-input"
                  required
                  value={formData.treatmentDate}
                  onChange={e => setFormData({ ...formData, treatmentDate: e.target.value })}
                />
              </div>
              <div className="form-section">
                <label>Jenis Tindakan</label>
                <select
                  className="f-input"
                  value={formData.treatmentType}
                  onChange={e => {
                    setSelectedVaccineId('');
                    setFormData({ ...formData, treatmentType: e.target.value, actionTaken: '' });
                  }}
                >
                  <option value="pemeriksaan">Pemeriksaan Rutin</option>
                  <option value="vaksin">Vaksinasi</option>
                  <option value="operasi">Operasi / Bedah</option>
                  <option value="grooming">Medical Grooming</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-section">
                <label>Nama Dokter / Staf Penanganan</label>
                <input
                  type="text"
                  className="f-input"
                  required
                  placeholder="cth. drh. Andi Pratama"
                  value={formData.doctorName}
                  onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                />
              </div>
              <div className="form-section">
                <label>Berat Badan (kg) — Opsional</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="f-input"
                  placeholder="0.0"
                  value={formData.weightKg}
                  onChange={e => setFormData({ ...formData, weightKg: e.target.value })}
                />
              </div>
            </div>

            <hr className="divider" />

            <div className="form-section">
              <label>Keluhan & Diagnosa (Anamnesa)</label>
              <textarea
                rows={3}
                className="f-textarea"
                required={formData.treatmentType !== 'vaksin'}
                placeholder={
                  formData.treatmentType === 'vaksin'
                    ? '(Opsional) cth. Kondisi hewan sehat, siap divaksin.'
                    : 'Tuliskan keluhan pemilik dan hasil diagnosa pemeriksaan...'
                }
                value={formData.diagnosisNotes}
                onChange={e => setFormData({ ...formData, diagnosisNotes: e.target.value })}
              />
            </div>

            {formData.treatmentType === 'vaksin' ? (
              <div className="highlight-box box-vaksin">
                <div className="hb-icon">💉</div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#8e52fc' }}>Pilih Produk Vaksin dari Stok</label>
                  {availableVaccines.length === 0 ? (
                    <div className="no-stock-warn">
                      ⚠️ Tidak ada stok vaksin tersedia. Tambahkan di menu{' '}
                      <Link href="/admin/vaksin/tambah" style={{ color: '#8e52fc', fontWeight: 700 }}>
                        Stok Vaksin
                      </Link>.
                    </div>
                  ) : (
                    <select
                      required
                      className="f-input"
                      style={{ borderLeft: '4px solid #8e52fc' }}
                      value={selectedVaccineId}
                      onChange={e => setSelectedVaccineId(e.target.value)}
                    >
                      <option value="">-- Pilih Vaksin yang Tersedia --</option>
                      {availableVaccines.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.nama_produk} (Sisa stok: {v.stok_sekarang} dosis)
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Info box: menjelaskan logika jadwal ke user admin */}
                  <div className="schedule-info-box">
                    <span className="sib-icon">📅</span>
                    <div>
                      <strong>Logika Penjadwalan Otomatis</strong>
                      <p>
                        Jadwal vaksin sebelumnya (termasuk H-1) akan otomatis ditandai
                        <em> selesai</em>. Jadwal berikutnya dihitung <strong>1 tahun dari tanggal tindakan hari ini</strong>,
                        bukan dari jadwal lama.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="highlight-box box-medis">
                <div className="hb-icon">🩺</div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#0097e6' }}>Tindakan Medis / Resep Obat</label>
                  <textarea
                    rows={3}
                    required
                    className="f-textarea"
                    style={{ borderLeft: '4px solid #0097e6' }}
                    placeholder="Tuliskan tindakan yang dilakukan, obat yang diresepkan, dosis, dll..."
                    value={formData.actionTaken}
                    onChange={e => setFormData({ ...formData, actionTaken: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="button" onClick={() => router.back()} className="btn-secondary">
                Batal
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading
                  ? <><span className="btn-spinner" /> Menyimpan...</>
                  : 'Simpan Rekam Medis'
                }
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
        h1 { font-size: 24px; font-weight: 900; color: #1a1a1a; margin: 10px 0 6px; }
        .patient-hint { font-size: 13px; color: #a19db5; }
        .form-container { max-width: 820px; }
        .form-card { background: #fff; padding: 40px; border-radius: 24px; border: 1px solid #eef0f7; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
        .section-title { font-size: 11px; font-weight: 900; color: #8e52fc; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 16px; }
        .form-section { margin-bottom: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .divider { border: none; border-top: 1px dashed #eef0f7; margin: 28px 0; }
        label { display: block; font-size: 11px; font-weight: 800; color: #a19db5; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.8px; }
        .f-input, .f-textarea { width: 100%; padding: 13px 16px; border: 1.5px solid #eef0f7; border-radius: 14px; font-size: 14px; outline: none; transition: 0.2s; background: #fdfbff; font-family: inherit; box-sizing: border-box; }
        .f-input:focus, .f-textarea:focus { border-color: #8e52fc; background: #fff; box-shadow: 0 0 0 3px rgba(142,82,252,0.06); }
        .highlight-box { display: flex; gap: 16px; padding: 24px; border-radius: 20px; border: 2px dashed #eef0f7; margin-bottom: 20px; }
        .box-vaksin { background: #faf6ff; border-color: #ddd0ff; }
        .box-medis  { background: #f0f9ff; border-color: #b8e3ff; }
        .hb-icon { font-size: 24px; margin-top: 2px; flex-shrink: 0; }
        .no-stock-warn { font-size: 13px; color: #e84040; background: #fff5f5; padding: 12px 16px; border-radius: 10px; margin-top: 4px; }

        /* Info box jadwal otomatis */
        .schedule-info-box {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          background: #f3eeff;
          border: 1px solid #d4bbff;
          border-radius: 12px;
          padding: 12px 14px;
          margin-top: 14px;
          font-size: 12px;
          color: #5a3e8a;
          line-height: 1.55;
        }
        .schedule-info-box strong { display: block; font-size: 12px; font-weight: 800; margin-bottom: 3px; color: #7c3aed; }
        .schedule-info-box p { margin: 0; }
        .sib-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }

        .form-actions { display: flex; justify-content: flex-end; gap: 14px; margin-top: 36px; border-top: 1px solid #f0f0f8; padding-top: 28px; }
        .btn-primary { background: linear-gradient(135deg, #8e52fc 0%, #6c31e0 100%); color: #fff; border: none; padding: 14px 30px; border-radius: 16px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s; box-shadow: 0 8px 15px rgba(142,82,252,0.2); display: flex; align-items: center; gap: 8px; font-family: inherit; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 20px rgba(142,82,252,0.3); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
        .btn-secondary { background: #fff; border: 1.5px solid #eef0f7; padding: 14px 28px; border-radius: 16px; font-weight: 700; font-size: 14px; color: #a19db5; cursor: pointer; transition: 0.2s; font-family: inherit; }
        .btn-secondary:hover { background: #fdfbff; color: #1a1a1a; border-color: #d1c4e9; }
        .btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}