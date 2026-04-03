'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';

export default function RekamMedis() {
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

  const activeP = patients.find(p => p.id === selectedPatientId) || patients[0];

  return (
    <div className="admin-body">
      <AdminSidebar active="rekam-medis" />
      <main className="main-content">
        <AdminTopbar title="Riwayat Medis Digital" subtitle="Akses cepat rekam medis pasien" />
        
        <div className="scroll-area">
          <div className="history-grid">
            {/* Sidebar Pasien */}
            <div className="patient-side">
              <div className="side-card">
                <div className="side-head">
                  <h3 className="side-title">Pilih Pasien</h3>
                </div>
                <div className="side-search">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" placeholder="Cari..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="patient-list">
                  {loading ? (
                    <p style={{ padding: '20px', fontSize: '13px', color: '#a19db5' }}>Memuat pasien...</p>
                  ) : filteredPatients.map((p) => (
                    <div key={p.id} className={`p-item ${selectedPatientId === p.id ? 'active' : ''}`} onClick={() => setSelectedPatientId(p.id)}>
                      <div className="p-ava">
                        {p.species?.toLowerCase() === 'kucing' ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 10h.01M16 10h.01M12 14v.01M10 16a2 2 0 0 0 4 0"/></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 10a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM12 10a2 2 0 1 1 4 0 2 2 0 1 1-4 0z"/><path d="M12 14v2"/></svg>
                        )}
                      </div>
                      <div className="p-info">
                        <div className="p-name">{p.name}</div>
                        <div className="p-owner">{p.owners?.full_name}</div>
                      </div>
                      <div className="p-dot" style={{ background: '#2ed573' }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Detail */}
            <div className="detail-main">
              {activeP ? (
                <>
                  <div className="header-card">
                    <div className="h-left">
                      <div className="large-ava">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 10h.01M16 10h.01M12 14v.01M10 16a2 2 0 0 0 4 0"/></svg>
                      </div>
                      <div>
                        <h2 className="h-name">{activeP.name} <span className="h-id">PCR-{activeP.id?.slice(0,4)}</span></h2>
                        <div className="h-specs">{activeP.species} · {activeP.breed || '---'} · {activeP.gender}</div>
                        <div className={`h-badge s-green`}>Aman</div>
                      </div>
                    </div>
                    <div className="h-right">
                      <Link href="/admin/rekam-medis/edit" className="h-btn gray" style={{textDecoration: 'none', display: 'inline-block', textAlign: 'center'}}>Edit</Link>
                      <Link href="/admin/rekam-medis/tambah" className="h-btn purple" style={{textDecoration: 'none', display: 'inline-block', textAlign: 'center'}}>Tambah Entri</Link>
                    </div>
                  </div>

                  <div className="timeline-card">
                    <div className="t-head">
                      <h3 className="t-title">Riwayat Tindakan</h3>
                      <button className="export-btn">Export PDF</button>
                    </div>
                    <div className="t-list">
                      {timeline.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '40px', color: '#a19db5', fontSize: '14.5px' }}>Belum ada riwayat tindakan untuk pasien ini.</p>
                      ) : timeline.map((item, i) => (
                        <div key={i} className="t-item">
                          <div className="t-marker">
                            <div className="t-dot"></div>
                            <div className="t-line"></div>
                          </div>
                          <div className="t-bubble">
                            <div className="b-head">
                              <div className="b-action">{item.treatment_type?.toUpperCase()}</div>
                              <div className="b-date">{new Date(item.treatment_date).toLocaleDateString('id-ID')}</div>
                            </div>
                            <div className="b-doc">Ditangani oleh: <b>{item.doctor_name}</b></div>
                            <div className="b-note">{item.diagnosis_notes}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ background: '#fff', borderRadius: '24px', padding: '100px', textAlign: 'center', border: '1.5px solid #f0f0f0' }}>
                  <p style={{ color: '#a19db5', fontWeight: 600 }}>Silakan pilih pasien untuk melihat riwayat medis.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 32px; }

        .history-grid { display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: flex-start; }
        
        .side-card { background: #fff; border-radius: 24px; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); overflow: hidden; }
        .side-head { padding: 20px 24px; border-bottom: 1.5px solid #f9f7ff; }
        .side-title { font-size: 14px; font-weight: 800; color: #1a1a1a; }
        .side-search { padding: 12px; position: relative; }
        .side-search svg { position: absolute; left: 24px; top: 50%; transform: translateY(-50%); color: #a19db5; }
        .side-search input { width: 100%; padding: 10px 16px 10px 42px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 12px; font-size: 12.5px; outline: none; }

        .p-item { display: flex; align-items: center; gap: 12px; padding: 16px 20px; cursor: pointer; transition: all 0.2s; border-bottom: 1px solid #fdfbff; }
        .p-item.active { background: #f4eeff; }
        .p-ava { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid #ece4ff; display: flex; align-items: center; justify-content: center; color: #8e52fc; background: #fff; }
        .p-name { font-size: 14px; font-weight: 700; color: #1a1a1a; }
        .p-owner { font-size: 11px; color: #a19db5; font-weight: 600; margin-top: 1px; }
        .p-dot { width: 8px; height: 8px; border-radius: 50%; margin-left: auto; }

        .header-card { background: #0c071b; border-radius: 28px; padding: 28px 32px; display: flex; justify-content: space-between; align-items: center; color: #fff; margin-bottom: 24px; box-shadow: 0 12px 40px rgba(12, 7, 27, 0.15); }
        .h-left { display: flex; align-items: center; gap: 24px; }
        .large-ava { width: 64px; height: 64px; border-radius: 18px; background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: #8e52fc; }
        .h-name { font-size: 22px; font-weight: 800; display: flex; align-items: center; gap: 12px; }
        .h-id { font-size: 11px; font-weight: 700; background: rgba(142, 82, 252, 0.2); border: 1px solid rgba(142, 82, 252, 0.3); padding: 4px 12px; border-radius: 20px; color: #d463f2; letter-spacing: 0.5px; }
        .h-specs { font-size: 13px; color: #a19db5; font-weight: 600; margin-top: 4px; }
        .h-badge { display: inline-block; padding: 6px 14px; border-radius: 12px; font-size: 11px; font-weight: 800; margin-top: 12px; }
        .s-red { background: #ff4757; color: #fff; }
        .s-green { background: #2ed573; color: #fff; }
        .s-yellow { background: #ffa502; color: #fff; }

        .h-right { display: flex; gap: 12px; }
        .h-btn { padding: 12px 24px; border-radius: 14px; font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s; border: none; }
        .h-btn.gray { background: rgba(255,255,255,0.06); color: #fff; border: 1.5px solid rgba(255,255,255,0.1); }
        .h-btn.purple { background: linear-gradient(135deg, #d463f2 0%, #8e52fc 100%); color: #fff; box-shadow: 0 8px 20px rgba(142, 82, 252, 0.4); }

        .timeline-card { background: #fff; border-radius: 28px; border: 1.5px solid #f0f0f0; padding: 24px 32px; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); }
        .t-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .t-title { font-size: 15px; font-weight: 800; color: #1a1a1a; }
        .export-btn { background: #fff; border: 1.5px solid #f0f0f0; padding: 8px 20px; border-radius: 12px; font-size: 13px; font-weight: 700; color: #666; cursor: pointer; }

        .t-item { display: flex; gap: 20px; padding-bottom: 24px; position: relative; }
        .t-marker { display: flex; flex-direction: column; align-items: center; }
        .t-dot { width: 12px; height: 12px; border-radius: 50%; background: #8e52fc; border: 3px solid #f4eeff; flex-shrink: 0; z-index: 2; margin-top: 10px; }
        .t-line { width: 1.5px; flex: 1; background: #f4eeff; margin-top: -4px; z-index: 1; }
        .t-item:last-child .t-line { display: none; }
        
        .t-bubble { flex: 1; background: #fdfbff; border: 1.5px solid #f4eeff; border-radius: 20px; padding: 20px; }
        .b-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .b-action { font-size: 15px; font-weight: 800; color: #1a1a1a; }
        .b-date { font-size: 12px; font-weight: 700; color: #a19db5; }
        .b-doc { font-size: 12px; color: #7a7a7a; margin-bottom: 12px; }
        .b-note { font-size: 13.5px; color: #444; line-height: 1.6; font-weight: 500; }
      `}</style>
    </div>
  );
}
