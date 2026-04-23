'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import { createClient } from '@/utils/supabase/client';

export default function RekamMedis() {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    // Baca URL param ?id=... untuk pre-select pasien (misal setelah redirect dari form tambah)
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl) {
      setSelectedPatientId(idFromUrl);
    }
  }, []);

  useEffect(() => {
    if (selectedPatientId != null) {
      setTimeline([]);
      fetchTimeline(selectedPatientId);
    }
  }, [selectedPatientId]);

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*, owners(full_name)')
        .order('name');

      if (error) throw error;
      setPatients(data || []);

      // Hanya set pasien pertama jika TIDAK ada ?id= di URL
      const params = new URLSearchParams(window.location.search);
      const idFromUrl = params.get('id');
      if (!idFromUrl && data && data.length > 0) {
        setSelectedPatientId(String(data[0].id));
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchTimeline = async (patientId: string) => {
    try {
      setLoadingTimeline(true);
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patientId)
        .order('treatment_date', { ascending: false });

      if (error) throw error;
      setTimeline(data || []);
    } catch (err) {
      console.error('Error fetching timeline:', err);
      setTimeline([]);
    } finally {
      setLoadingTimeline(false);
    }
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredPatients = patients.filter((p) => {
    const petName = String(p?.name || '').toLowerCase();
    const ownerName = String(p?.owners?.full_name || '').toLowerCase();
    return petName.includes(q) || ownerName.includes(q);
  });

  const activeP = patients.find(p => String(p?.id) === String(selectedPatientId));

  const formatDate = (value: any) => {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  /**
   * FUNGSI PARSING DATA RINGKASAN YANG DISELARASKAN
   *
   * Kolom yang digunakan (sesuai form TambahEntriMedis):
   * - treatment_type : 'vaksin' | 'pemeriksaan' | 'operasi' | 'grooming'
   * - action_taken   : untuk vaksin → "Vaksinasi: <nama_produk>"
   *                    untuk non-vaksin → tindakan medis / resep yang diketik staf
   * - diagnosis_notes: keluhan / anamnesa
   * - doctor_name    : nama dokter / staf
   * - treatment_date : tanggal tindakan
   * - weight_kg      : berat badan (opsional)
   */
  const parseRecord = (item: any) => {
    const type = String(item?.treatment_type || '').toLowerCase();
    const isVaksin = type === 'vaksin' || type.includes('vaksin');
    const actionTaken = String(item?.action_taken || '');
    const diagnosisNotes = String(item?.diagnosis_notes || '');

    // Ekstrak nama vaksin dari action_taken (format: "Vaksinasi: <nama>")
    let vaccineName = '-';
    if (isVaksin) {
      const match = actionTaken.match(/^Vaksinasi:\s*(.+)/i);
      vaccineName = match ? match[1].trim() : actionTaken || '-';
    }

    return { isVaksin, vaccineName, actionTaken, diagnosisNotes };
  };

  const getTreatmentLabel = (type: string) => {
    const map: Record<string, string> = {
      vaksin: 'VAKSINASI',
      pemeriksaan: 'PEMERIKSAAN',
      operasi: 'OPERASI',
      grooming: 'GROOMING',
    };
    return map[type?.toLowerCase()] || type?.toUpperCase() || 'TINDAKAN';
  };

  return (
    <div className="admin-body">
      <AdminSidebar active="rekam-medis" />
      <main className="main-content">
        <AdminTopbar title="Riwayat Medis Digital" subtitle="Pusat data kesehatan pasien PetCare terpadu" />

        <div className="scroll-area">
          <div className="history-grid">

            {/* ===================== SIDEBAR DAFTAR PASIEN ===================== */}
            <aside className="patient-side">
              <div className="side-card">
                <div className="side-head">
                  <h3 className="side-title">Daftar Pasien</h3>
                  <span className="count-badge">{filteredPatients.length}</span>
                </div>
                <div className="side-search">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari nama/pemilik..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="patient-list">
                  {loadingPatients ? (
                    <div className="loading-state">
                      <div className="spinner" />
                      <p>Memuat data...</p>
                    </div>
                  ) : filteredPatients.length === 0 ? (
                    <div className="empty-side">
                      <div className="empty-icon">🔎</div>
                      <p>{patients.length === 0 ? 'Belum ada pasien.' : 'Pasien tidak ditemukan.'}</p>
                    </div>
                  ) : filteredPatients.map((p) => {
                    const pid = String(p?.id);
                    const isActive = String(selectedPatientId) === pid;
                    return (
                      <div
                        key={pid}
                        className={`p-item ${isActive ? 'active' : ''}`}
                        onClick={() => setSelectedPatientId(pid)}
                      >
                        <div className="p-ava">
                          {String(p?.species || '').toLowerCase() === 'kucing' ? '🐱' : '🐶'}
                        </div>
                        <div className="p-info">
                          <div className="p-name">{p?.name || '-'}</div>
                          <div className="p-owner">{p?.owners?.full_name || '-'}</div>
                        </div>
                        {isActive && <div className="active-indicator" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* ===================== AREA DETAIL PASIEN ===================== */}
            <section className="detail-main">
              {activeP ? (
                <>
                  {/* Header Informasi Pasien */}
                  <div className="header-card">
                    <div className="h-left">
                      <div className="large-ava-wrapper">
                        <div className="large-ava">
                          {activeP.species?.toLowerCase() === 'kucing' ? '🐱' : '🐶'}
                        </div>
                      </div>
                      <div className="h-details">
                        <div className="h-top">
                          <h2 className="h-name">{activeP.name}</h2>
                          <span className="h-id">ID: {String(activeP.id).slice(0, 8).toUpperCase()}</span>
                        </div>
                        <div className="h-specs">
                          <span>{activeP.species}</span> • <span>{activeP.breed || 'Mix Breed'}</span> • <span>{activeP.gender}</span>
                        </div>
                        <div className="h-pills">
                          <span className="pill green">Status: Terdaftar</span>
                          <span className="pill purple">{timeline.length} Riwayat Tindakan</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-right">
                      <Link
                        href={`/admin/rekam-medis/tambah?id=${encodeURIComponent(String(activeP.id))}`}
                        className="h-btn purple"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Tambah Rekam Medis
                      </Link>
                    </div>
                  </div>

                  {/* Ringkasan Statistik */}
                  {timeline.length > 0 && (
                    <div className="summary-strip">
                      <div className="sum-item">
                        <div className="sum-val">{timeline.length}</div>
                        <div className="sum-lbl">Total Kunjungan</div>
                      </div>
                      <div className="sum-divider" />
                      <div className="sum-item">
                        <div className="sum-val">
                          {timeline.filter(r => {
                            const t = String(r?.treatment_type || '').toLowerCase();
                            return t === 'vaksin' || t.includes('vaksin');
                          }).length}
                        </div>
                        <div className="sum-lbl">Vaksinasi</div>
                      </div>
                      <div className="sum-divider" />
                      <div className="sum-item">
                        <div className="sum-val">
                          {timeline.filter(r => {
                            const t = String(r?.treatment_type || '').toLowerCase();
                            return t !== 'vaksin' && !t.includes('vaksin');
                          }).length}
                        </div>
                        <div className="sum-lbl">Medis / Perawatan</div>
                      </div>
                      <div className="sum-divider" />
                      <div className="sum-item">
                        <div className="sum-val">{formatDate(timeline[0]?.treatment_date)}</div>
                        <div className="sum-lbl">Kunjungan Terakhir</div>
                      </div>
                    </div>
                  )}

                  {/* Timeline Riwayat Medis */}
                  <div className="timeline-card">
                    <div className="t-head">
                      <div>
                        <h3 className="t-title">Riwayat Tindakan Medis</h3>
                        <p className="t-sub">Kronologi pengobatan & vaksinasi — terbaru ditampilkan pertama</p>
                      </div>
                    </div>

                    <div className="t-list">
                      {loadingTimeline ? (
                        <div className="loading-state">
                          <div className="spinner" />
                          <p>Memuat riwayat medis...</p>
                        </div>
                      ) : timeline.length === 0 ? (
                        <div className="empty-timeline">
                          <div className="empty-icon">📂</div>
                          <p>Belum ada catatan medis untuk pasien ini.</p>
                          <Link
                            href={`/admin/rekam-medis/tambah?id=${encodeURIComponent(String(activeP.id))}`}
                            className="empty-add-btn"
                          >
                            + Tambah Rekam Medis Pertama
                          </Link>
                        </div>
                      ) : timeline.map((item, i) => {
                        const { isVaksin, vaccineName, actionTaken, diagnosisNotes } = parseRecord(item);
                        const treatmentType = String(item?.treatment_type || '').toLowerCase();

                        return (
                          <div key={item?.id ?? i} className="t-item">
                            <div className="t-marker">
                              <div className={`t-dot ${isVaksin ? 'v-dot' : 'treat-dot'}`} />
                              {i < timeline.length - 1 && <div className="t-line" />}
                            </div>

                            <div className={`t-bubble ${isVaksin ? 'v-bubble' : 'treat-bubble'}`}>
                              <div className="b-head">
                                <span className={`type-badge badge-${treatmentType}`}>
                                  {getTreatmentLabel(treatmentType)}
                                </span>
                                <div className="b-date">{formatDate(item?.treatment_date)}</div>
                              </div>

                              <div className="b-content">
                                {/* ====== TAMPILAN VAKSIN ====== */}
                                {isVaksin ? (
                                  <>
                                    <div className="v-detail-box">
                                      <div className="v-label">VAKSIN YANG DIBERIKAN</div>
                                      <div className="v-name">{vaccineName}</div>
                                    </div>
                                    {diagnosisNotes && diagnosisNotes.trim() !== '' && (
                                      <div className="b-note note-catatan" style={{ marginTop: '12px' }}>
                                        <span className="note-head">Catatan Kondisi:</span>
                                        {diagnosisNotes}
                                      </div>
                                    )}
                                    {item?.weight_kg && (
                                      <div className="b-weight">
                                        Berat saat vaksin: <strong>{item.weight_kg} kg</strong>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  /* ====== TAMPILAN PEMERIKSAAN / MEDIS ====== */
                                  <div className="m-detail-group">
                                    <div className="b-note note-diagnosis">
                                      <span className="note-head note-head-gray">Keluhan / Diagnosis:</span>
                                      {diagnosisNotes || '-'}
                                    </div>
                                    <div className="b-note note-action">
                                      <span className="note-head note-head-blue">Tindakan Medis / Obat:</span>
                                      {actionTaken || '-'}
                                    </div>
                                    {item?.weight_kg && (
                                      <div className="b-weight">
                                        Berat badan: <strong>{item.weight_kg} kg</strong>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="b-doc">
                                  Ditangani oleh: <strong>{item?.doctor_name || 'Staf Klinik'}</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="welcome-state">
                  <div className="welcome-inner">
                    <div className="welcome-icon">🏥</div>
                    <h3>Pilih Data Pasien</h3>
                    <p>Klik nama pasien di panel kiri untuk melihat riwayat medis lengkap.</p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #f8f9fd; font-family: 'Plus Jakarta Sans', sans-serif; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
        .scroll-area { padding: 32px; overflow-y: auto; flex: 1; scroll-behavior: smooth; }
        .history-grid { display: grid; grid-template-columns: 320px 1fr; gap: 32px; max-width: 1400px; margin: 0 auto; width: 100%; }

        /* ---- Sidebar pasien ---- */
        .side-card { background: #fff; border-radius: 28px; border: 1px solid #eef0f7; box-shadow: 0 10px 40px rgba(0,0,0,0.02); height: calc(100vh - 160px); display: flex; flex-direction: column; position: sticky; top: 0; }
        .side-head { padding: 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f8f9fb; }
        .side-title { font-size: 15px; font-weight: 800; color: #1a1a1a; }
        .count-badge { background: #f0f3ff; color: #8e52fc; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; }
        .side-search { padding: 16px 24px; position: relative; }
        .side-search svg { position: absolute; left: 38px; top: 50%; transform: translateY(-50%); color: #a19db5; }
        .side-search input { width: 100%; padding: 12px 16px 12px 48px; background: #f8f9fd; border: 1px solid #eef0f7; border-radius: 14px; font-size: 13px; outline: none; box-sizing: border-box; }
        .patient-list { overflow-y: auto; flex: 1; padding: 0 12px 20px; }
        .empty-side { padding: 34px 18px; text-align: center; color: #a19db5; }
        .empty-side .empty-icon { font-size: 22px; margin-bottom: 8px; }
        .p-item { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 18px; cursor: pointer; transition: 0.2s; position: relative; margin-bottom: 4px; }
        .p-item:hover { background: #fafafe; }
        .p-item.active { background: #f4eeff; }
        .active-indicator { position: absolute; left: 0; top: 20%; bottom: 20%; width: 4px; background: #8e52fc; border-radius: 0 4px 4px 0; }
        .p-ava { width: 42px; height: 42px; border-radius: 12px; background: #fff; border: 1px solid #eef0f7; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .p-name { font-size: 14px; font-weight: 700; color: #1a1a1a; }
        .p-owner { font-size: 11px; color: #a19db5; margin-top: 1px; }

        /* ---- Header pasien aktif ---- */
        .header-card { background: #0c071b; border-radius: 32px; padding: 32px 40px; display: flex; justify-content: space-between; align-items: center; color: #fff; margin-bottom: 20px; min-height: 160px; overflow: hidden; }
        .h-left { display: flex; align-items: center; gap: 28px; }
        .large-ava-wrapper { padding: 4px; background: rgba(255,255,255,0.1); border-radius: 22px; }
        .large-ava { width: 80px; height: 80px; border-radius: 20px; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 40px; }
        .h-name { font-size: 24px; font-weight: 900; }
        .h-id { font-size: 10px; background: rgba(142,82,252,0.2); padding: 4px 12px; border-radius: 100px; color: #d463f2; margin-left: 12px; vertical-align: middle; }
        .h-specs { font-size: 13px; color: #a19db5; margin-top: 6px; }
        .h-pills { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
        .pill { padding: 5px 14px; border-radius: 10px; font-size: 11px; font-weight: 700; }
        .pill.green { background: #2ed573; color: #fff; }
        .pill.purple { background: rgba(142,82,252,0.25); color: #c77dff; }
        .h-right { flex-shrink: 0; }
        .h-btn.purple { display: flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #8e52fc 0%, #6c31e0 100%); color: #fff; padding: 14px 24px; border-radius: 18px; font-weight: 800; font-size: 14px; text-decoration: none; box-shadow: 0 10px 20px rgba(142,82,252,0.3); transition: 0.3s; white-space: nowrap; }
        .h-btn.purple:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(142,82,252,0.4); }

        /* ---- Ringkasan strip ---- */
        .summary-strip { background: #fff; border-radius: 20px; border: 1px solid #eef0f7; padding: 20px 32px; display: flex; align-items: center; gap: 24px; margin-bottom: 20px; }
        .sum-item { text-align: center; flex: 1; }
        .sum-val { font-size: 22px; font-weight: 900; color: #1a1a1a; }
        .sum-lbl { font-size: 11px; color: #a19db5; margin-top: 2px; font-weight: 600; }
        .sum-divider { width: 1px; height: 40px; background: #eef0f7; }

        /* ---- Timeline ---- */
        .timeline-card { background: #fff; border-radius: 32px; border: 1px solid #eef0f7; padding: 40px; }
        .t-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .t-title { font-size: 18px; font-weight: 800; }
        .t-sub { font-size: 13px; color: #a19db5; margin-top: 2px; }
        .t-item { display: flex; gap: 30px; padding-bottom: 32px; }
        .t-marker { display: flex; flex-direction: column; align-items: center; }
        .t-dot { width: 14px; height: 14px; border-radius: 50%; background: #eef0f7; z-index: 2; margin-top: 6px; flex-shrink: 0; }
        .t-dot.v-dot { background: #8e52fc; box-shadow: 0 0 0 4px rgba(142,82,252,0.12); }
        .t-dot.treat-dot { background: #0097e6; box-shadow: 0 0 0 4px rgba(0,151,230,0.10); }
        .t-line { width: 2px; flex: 1; background: #f0f0f8; margin-top: 6px; min-height: 20px; }
        .t-bubble { flex: 1; border: 1px solid #eef0f7; border-radius: 24px; padding: 24px; }
        .v-bubble { border-color: #ece4ff; }
        .treat-bubble { border-color: #e0f4ff; }

        /* Badges per tipe */
        .type-badge { padding: 5px 12px; border-radius: 8px; font-size: 10px; font-weight: 900; }
        .badge-vaksin { background: #f4eeff; color: #8e52fc; }
        .badge-pemeriksaan { background: #f0faff; color: #0097e6; }
        .badge-operasi { background: #fff5f5; color: #e84040; }
        .badge-grooming { background: #f0fff8; color: #2ed573; }

        .b-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .b-date { font-size: 12px; color: #a19db5; font-weight: 600; }

        /* Konten vaksin */
        .v-detail-box { background: #fdfbff; border: 1px solid #ece4ff; border-left: 4px solid #8e52fc; border-radius: 0 12px 12px 0; padding: 14px 18px; }
        .v-label { font-size: 10px; font-weight: 900; color: #8e52fc; letter-spacing: 0.5px; margin-bottom: 4px; }
        .v-name { font-size: 17px; font-weight: 800; color: #1a1a1a; }

        /* Konten medis */
        .m-detail-group { display: flex; flex-direction: column; gap: 10px; }
        .b-note { font-size: 14px; color: #444; line-height: 1.6; background: #f8f9fd; padding: 14px 16px; border-radius: 12px; }
        .note-diagnosis { background: #f8f9fd; }
        .note-action { background: #f0faff; border-left: 4px solid #0097e6; border-radius: 0 12px 12px 0; }
        .note-catatan { background: #f8f9fd; }
        .note-head { display: block; font-size: 10px; font-weight: 900; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.4px; color: #a19db5; }
        .note-head-gray { color: #8a80a0; }
        .note-head-blue { color: #0097e6; }

        .b-weight { font-size: 12px; color: #a19db5; margin-top: 10px; }
        .b-doc { font-size: 12px; color: #a19db5; margin-top: 16px; border-top: 1px solid #f0ecfb; padding-top: 12px; }

        /* Empty timeline */
        .empty-timeline { text-align: center; padding: 50px 40px; color: #a19db5; }
        .empty-timeline .empty-icon { font-size: 32px; margin-bottom: 12px; }
        .empty-add-btn { display: inline-block; margin-top: 16px; background: #8e52fc; color: #fff; padding: 12px 24px; border-radius: 14px; font-size: 14px; font-weight: 800; text-decoration: none; }

        /* Welcome state */
        .welcome-state { background: #fff; border-radius: 32px; height: 100%; display: flex; align-items: center; justify-content: center; border: 2px dashed #eef0f7; min-height: 400px; text-align: center; }
        .welcome-inner { padding: 40px; }
        .welcome-icon { font-size: 48px; margin-bottom: 16px; }
        .welcome-state h3 { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
        .welcome-state p { color: #a19db5; font-size: 14px; }

        /* Loading */
        .loading-state { text-align: center; padding: 40px; color: #a19db5; }
        .spinner { width: 24px; height: 24px; border: 3px solid #f0f3ff; border-top: 3px solid #8e52fc; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}