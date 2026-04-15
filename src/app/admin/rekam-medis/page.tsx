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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      fetchTimeline(selectedPatientId);
    }
  }, [selectedPatientId]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*, owners(full_name)')
        .order('name');

      if (error) throw error;
      setPatients(data || []);
      if (data && data.length > 0) {
        setSelectedPatientId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patientId)
        .order('treatment_date', { ascending: false });

      if (error) throw error;
      setTimeline(data || []);
    } catch (err) {
      console.error('Error fetching timeline:', err);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.owners?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeP = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="admin-body">
      <AdminSidebar active="rekam-medis" />
      <main className="main-content">
        <AdminTopbar title="Riwayat Medis Digital" subtitle="Pusat data kesehatan pasien PetCare terpadu" />
        
        <div className="scroll-area">
          <div className="history-grid">
            {/* Sidebar Pasien */}
            <aside className="patient-side">
              <div className="side-card">
                <div className="side-head">
                  <h3 className="side-title">Daftar Pasien</h3>
                  <span className="count-badge">{filteredPatients.length}</span>
                </div>
                <div className="side-search">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" placeholder="Cari nama/pemilik..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="patient-list">
                  {loading ? (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>Memuat data...</p>
                    </div>
                  ) : filteredPatients.map((p) => (
                    <div key={p.id} className={`p-item ${selectedPatientId === p.id ? 'active' : ''}`} onClick={() => setSelectedPatientId(p.id)}>
                      <div className="p-ava">{p.species?.toLowerCase() === 'kucing' ? '🐱' : '🐶'}</div>
                      <div className="p-info">
                        <div className="p-name">{p.name}</div>
                        <div className="p-owner">{p.owners?.full_name}</div>
                      </div>
                      {selectedPatientId === p.id && <div className="active-indicator" />}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Content Detail */}
            <section className="detail-main">
              {activeP ? (
                <>
                  <div className="header-card">
                    <div className="h-left">
                      <div className="large-ava-wrapper">
                        <div className="large-ava">{activeP.species?.toLowerCase() === 'kucing' ? '🐱' : '🐶'}</div>
                      </div>
                      <div className="h-details">
                        <div className="h-top">
                          <h2 className="h-name">{activeP.name}</h2>
                          <span className="h-id">ID: {activeP.id?.slice(0,8).toUpperCase()}</span>
                        </div>
                        <div className="h-specs">
                          <span>{activeP.species}</span> • <span>{activeP.breed || 'Mix Breed'}</span> • <span>{activeP.gender}</span>
                        </div>
                        <div className="h-pills">
                          <span className="pill green">Status: Sehat</span>
                          <span className="pill gray">{activeP.weight_kg || '--'} kg</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-right">
                      <Link href="/admin/rekam-medis/tambah" className="h-btn purple">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Tambah Rekam Medis
                      </Link>
                    </div>
                  </div>

                  <div className="timeline-card">
                    <div className="t-head">
                      <div>
                        <h3 className="t-title">Riwayat Tindakan Medis</h3>
                        <p className="t-sub">Menampilkan kronologi pengobatan pasien</p>
                      </div>
                      <button className="export-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Export Data
                      </button>
                    </div>

                    <div className="t-list">
                      {timeline.length === 0 ? (
                        <div className="empty-timeline">
                          <div className="empty-icon">📂</div>
                          <p>Belum ada catatan medis.</p>
                        </div>
                      ) : timeline.map((item, i) => {
                        const isVaksin = item.treatment_type?.toLowerCase().includes('vaksin');
                        return (
                          <div key={i} className="t-item">
                            <div className="t-marker">
                              <div className={`t-dot ${isVaksin ? 'v-dot' : ''}`} />
                              <div className="t-line" />
                            </div>
                            <div className={`t-bubble ${isVaksin ? 'v-bubble' : ''}`}>
                              <div className="b-head">
                                <span className={`type-badge ${isVaksin ? 'vaksin' : 'medis'}`}>
                                  {isVaksin ? 'VAKSINASI' : 'MEDIS'}
                                </span>
                                <div className="b-date">{new Date(item.treatment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                              </div>
                              <div className="b-content">
                                {isVaksin && (
                                  <div className="v-detail-box">
                                    <div className="v-label">Vaksin Diberikan:</div>
                                    <div className="v-name">{item.diagnosis_notes.replace('Pemberian Vaksin ', '')}</div>
                                  </div>
                                )}
                                <div className="b-doc">Dokter: <strong>{item.doctor_name}</strong></div>
                                <div className="b-note">"{item.diagnosis_notes}"</div>
                                {item.weight_kg && <div className="b-weight-tag">⚖️ Berat: {item.weight_kg} kg</div>}
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
        
        /* Fixed Topbar, Scrollable Content */
        .scroll-area { padding: 32px; overflow-y: auto; flex: 1; scroll-behavior: smooth; }

        .history-grid { display: grid; grid-template-columns: 320px 1fr; gap: 32px; max-width: 1400px; margin: 0 auto; width: 100%; }
        
        .side-card { background: #fff; border-radius: 28px; border: 1px solid #eef0f7; box-shadow: 0 10px 40px rgba(0,0,0,0.02); height: calc(100vh - 160px); display: flex; flex-direction: column; position: sticky; top: 0; }
        .side-head { padding: 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f8f9fb; }
        .side-title { font-size: 15px; font-weight: 800; color: #1a1a1a; }
        .count-badge { background: #f0f3ff; color: #8e52fc; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; }
        
        .side-search { padding: 16px 24px; position: relative; }
        .side-search svg { position: absolute; left: 38px; top: 50%; transform: translateY(-50%); color: #a19db5; }
        .side-search input { width: 100%; padding: 12px 16px 12px 48px; background: #f8f9fd; border: 1px solid #eef0f7; border-radius: 14px; font-size: 13px; outline: none; }

        .patient-list { overflow-y: auto; flex: 1; padding: 0 12px 20px; }
        .p-item { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 18px; cursor: pointer; transition: 0.2s; position: relative; margin-bottom: 4px; }
        .p-item.active { background: #f4eeff; }
        .active-indicator { position: absolute; left: 0; top: 20%; bottom: 20%; width: 4px; background: #8e52fc; border-radius: 0 4px 4px 0; }
        .p-ava { width: 42px; height: 42px; border-radius: 12px; background: #fff; border: 1px solid #eef0f7; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .p-name { font-size: 14px; font-weight: 700; color: #1a1a1a; }
        .p-owner { font-size: 11px; color: #a19db5; margin-top: 1px; }

        /* HEADER CARD - REFINED */
        .header-card { 
          background: #0c071b; 
          border-radius: 32px; 
          padding: 32px 40px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          color: #fff; 
          margin-bottom: 32px; 
          position: relative; 
          overflow: visible; /* Biar shadow tombol tidak terpotong */
          min-height: 160px;
        }

        .h-left { display: flex; align-items: center; gap: 28px; }
        .large-ava-wrapper { padding: 4px; background: rgba(255,255,255,0.1); border-radius: 22px; }
        .large-ava { width: 80px; height: 80px; border-radius: 20px; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 40px; }
        
        .h-name { font-size: 24px; font-weight: 900; }
        .h-id { font-size: 10px; background: rgba(142, 82, 252, 0.2); padding: 4px 12px; border-radius: 100px; color: #d463f2; margin-left: 12px; vertical-align: middle; }
        .h-specs { font-size: 13px; color: #a19db5; margin-top: 6px; }
        .h-pills { display: flex; gap: 10px; margin-top: 16px; }
        .pill { padding: 5px 14px; border-radius: 10px; font-size: 11px; font-weight: 700; }
        .pill.green { background: #2ed573; color: #fff; }
        .pill.gray { background: rgba(255,255,255,0.1); color: #fff; }

        /* BUTTON FIX */
        .h-right { flex-shrink: 0; }
        .h-btn.purple { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          background: linear-gradient(135deg, #8e52fc 0%, #6c31e0 100%); 
          color: #fff; 
          padding: 14px 24px; 
          border-radius: 18px; 
          font-weight: 800; 
          font-size: 14px; 
          text-decoration: none; 
          box-shadow: 0 10px 20px rgba(142, 82, 252, 0.3); 
          transition: 0.3s; 
          white-space: nowrap; /* Menghindari teks tombol turun ke bawah */
        }
        .h-btn.purple:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(142, 82, 252, 0.4); }

        .timeline-card { background: #fff; border-radius: 32px; border: 1px solid #eef0f7; padding: 40px; }
        .t-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .t-title { font-size: 18px; font-weight: 800; }
        .t-sub { font-size: 13px; color: #a19db5; margin-top: 2px; }

        .t-item { display: flex; gap: 30px; padding-bottom: 40px; }
        .t-marker { display: flex; flex-direction: column; align-items: center; }
        .t-dot { width: 14px; height: 14px; border-radius: 50%; background: #eef0f7; z-index: 2; margin-top: 6px; }
        .t-dot.v-dot { background: #8e52fc; box-shadow: 0 0 0 4px rgba(142,82,252,0.1); }
        .t-line { width: 2px; flex: 1; background: #f8f9fb; margin-top: 4px; }
        
        .t-bubble { flex: 1; background: #fff; border: 1px solid #eef0f7; border-radius: 24px; padding: 24px; }
        .type-badge { padding: 5px 12px; border-radius: 8px; font-size: 10px; font-weight: 900; }
        .type-badge.vaksin { background: #f4eeff; color: #8e52fc; }
        .type-badge.medis { background: #f0faff; color: #0097e6; }

        .v-detail-box { background: #fdfbff; border: 1px solid #ece4ff; border-radius: 16px; padding: 16px; margin: 16px 0; border-left: 4px solid #8e52fc; }
        .v-label { font-size: 10px; font-weight: 800; color: #8e52fc; }
        .v-name { font-size: 16px; font-weight: 800; margin-top: 2px; }
        
        .b-doc { font-size: 12px; color: #a19db5; margin-bottom: 12px; }
        .note-text { font-size: 14px; color: #444; line-height: 1.6; background: #f8f9fd; padding: 14px; border-radius: 12px; }

        .welcome-state { background: #fff; border-radius: 32px; height: 100%; display: flex; align-items: center; justify-content: center; border: 2px dashed #eef0f7; min-height: 400px; }
        .spinner { width: 24px; height: 24px; border: 3px solid #f0f3ff; border-top: 3px solid #8e52fc; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 10px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}