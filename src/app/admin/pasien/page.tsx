'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar'; // Pastikan import ini ada
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function ManajemenPasien() {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    late: 0,
    upcoming: 0,
    new: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Ambil Data Pasien beserta info pemilik
      const { data: patientsData, error: pError } = await supabase
        .from('patients')
        .select('*, owners(full_name)')
        .order('created_at', { ascending: false });

      if (pError) throw pError;

      // 2. Ambil Data Jadwal Vaksin (Untuk Menghitung Stats)
      const { data: scheduleData } = await supabase
        .from('vaccination_schedules')
        .select('next_vaccine_date, status');

      const now = new Date();
      let lateCount = 0;
      let upcomingCount = 0;

      if (scheduleData) {
        scheduleData.forEach(s => {
          const nextDate = new Date(s.next_vaccine_date);
          if (nextDate < now && s.status === 'scheduled') lateCount++;
          // H-7 dianggap segera
          const diffTime = nextDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= 7 && diffDays > 0) upcomingCount++;
        });
      }

      setPatients(patientsData || []);
      setStats({
        total: patientsData?.length || 0,
        late: lateCount,
        upcoming: upcomingCount,
        new: patientsData?.filter(p => {
          const created = new Date(p.created_at);
          return created.getMonth() === now.getMonth();
        }).length || 0
      });

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (p.owners?.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const metrics = [
    { label: 'TOTAL PASIEN', value: stats.total, border: '#8e52fc' },
    { label: 'VAKSIN TERLAMBAT', value: stats.late, border: '#ff4757' },
    { label: 'VAKSIN SEGERA (H-7)', value: stats.upcoming, border: '#ffa502' },
    { label: 'PASIEN BULAN INI', value: stats.new, border: '#1e90ff' },
  ];

  return (
    <div className="admin-body">
      <AdminSidebar active="pasien" />
      <main className="main-content">
        <AdminTopbar title="Manajemen Pasien" subtitle="Pusat kendali data hewan dan riwayat pemilik" />

        <div className="scroll-area">
          {/* Dashboard Mini Metrics */}
          <div className="metrics-grid">
            {metrics.map((m, i) => (
              <div key={i} className="m-card" style={{ borderTop: `4px solid ${m.border}` }}>
                <span className="m-label">{m.label}</span>
                <div className="m-val">{m.value}</div>
              </div>
            ))}
          </div>

          <div className="data-card">
            <div className="card-top-flex">
              <div>
                <h2 className="title-text">Database Pasien</h2>
                <p className="sub-text">Total {filteredPatients.length} pasien ditemukan</p>
              </div>
              <div className="actions-right">
                <div className="search-box">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                   <input type="text" placeholder="Cari nama atau pemilik..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <Link href="/admin/pasien/tambah" className="add-btn">
                  + Registrasi Pasien
                </Link>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>PASIEN & PEMILIK</th>
                    <th>JENIS / RAS</th>
                    <th>STATUS KESEHATAN</th>
                    <th>TGL TERDAFTAR</th>
                    <th className="text-right">OPSI</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="loading-cell">Menyinkronkan data...</td></tr>
                  ) : filteredPatients.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="profile-cell">
                          <div className="avatar-mini">{p.species?.toLowerCase() === 'kucing' ? '🐱' : '🐶'}</div>
                          <div className="name-box">
                            <div className="p-name">{p.name}</div>
                            <div className="o-name">{p.owners?.full_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-val">{p.species} <span className="breed-tag">{p.breed || '---'}</span></td>
                      <td>
                        {/* Logika Badge Status Dinamis */}
                        <span className="badge s-green">Aktif</span>
                      </td>
                      <td className="text-val">{new Date(p.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="text-right">
                        <Link href={`/admin/rekam-medis?id=${p.id}`} className="d-btn">
                          Lihat Rekam Medis
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; font-family: 'Plus Jakarta Sans', sans-serif; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 32px; max-width: 1400px; margin: 0 auto; width: 100%; }

        /* Metrics */
        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
        .m-card { background: #fff; padding: 24px; border-radius: 20px; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 20px rgba(0,0,0,0.02); }
        .m-label { font-size: 11px; font-weight: 800; color: #a19db5; letter-spacing: 0.5px; margin-bottom: 8px; display: block; }
        .m-val { font-size: 32px; font-weight: 900; color: #1a1a1a; }

        /* Table Card */
        .data-card { background: #fff; border-radius: 30px; border: 1.5px solid #f0f0f0; box-shadow: 0 20px 40px rgba(142, 82, 252, 0.05); overflow: hidden; }
        .card-top-flex { padding: 32px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #f9f7ff; }
        .title-text { font-size: 20px; font-weight: 900; color: #1a1a1a; margin: 0; }
        .sub-text { font-size: 13px; color: #a19db5; font-weight: 500; margin-top: 4px; }
        
        .actions-right { display: flex; gap: 16px; align-items: center; }
        .search-box { position: relative; width: 260px; }
        .search-box svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #a19db5; }
        .search-box input { width: 100%; padding: 12px 16px 12px 42px; background: #f8f9fd; border: 1.5px solid #ece4ff; border-radius: 14px; font-size: 13px; outline: none; transition: 0.2s; }
        .search-box input:focus { border-color: #8e52fc; background: #fff; }

        .add-btn { background: #8e52fc; color: #fff; padding: 12px 24px; border-radius: 14px; text-decoration: none; font-size: 13px; font-weight: 800; box-shadow: 0 8px 15px rgba(142, 82, 252, 0.25); transition: 0.3s; }
        .add-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 20px rgba(142, 82, 252, 0.35); }

        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 18px 32px; text-align: left; font-size: 11px; font-weight: 800; color: #a19db5; text-transform: uppercase; background: #fdfbff; border-bottom: 1.5px solid #f0f0f0; }
        tbody td { padding: 20px 32px; border-bottom: 1px solid #f9f7ff; }

        .profile-cell { display: flex; align-items: center; gap: 16px; }
        .avatar-mini { width: 40px; height: 40px; border-radius: 12px; background: #f8f9fd; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 1px solid #ece4ff; }
        .p-name { font-weight: 800; color: #1a1a1a; font-size: 15px; }
        .o-name { font-size: 12px; color: #a19db5; font-weight: 600; margin-top: 2px; }
        
        .breed-tag { background: #f4eeff; color: #8e52fc; padding: 2px 8px; border-radius: 6px; font-size: 11px; margin-left: 6px; }
        .badge { padding: 6px 12px; border-radius: 10px; font-size: 11px; font-weight: 800; }
        .s-green { background: #f0fff4; color: #2ed573; }
        
        .d-btn { background: #fff; border: 1.5px solid #ece4ff; padding: 8px 16px; border-radius: 10px; color: #8e52fc; font-weight: 700; font-size: 12px; text-decoration: none; transition: 0.2s; }
        .d-btn:hover { background: #8e52fc; color: #fff; }
        
        .loading-cell { text-align: center; padding: 60px; color: #a19db5; font-style: italic; }
        .text-right { text-align: right; }
      `}</style>
    </div>
  );
}