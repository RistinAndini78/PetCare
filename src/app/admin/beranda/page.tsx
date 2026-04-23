'use client';

// Tambahkan ini agar Next.js selalu mengambil data terbaru (Tidak di-cache)
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function AdminBeranda() {
  const supabase = createClient();

  // State Identitas, Role, & Loading
  const [adminName, setAdminName] = useState('Staf Klinik');
  const [userRole, setUserRole] = useState('admin');
  const [loading, setLoading] = useState(true);

  // State Statistik Utama
  const [totalPatients, setTotalPatients] = useState(0);
  const [dueReminders, setDueReminders] = useState(0); // Untuk Admin (Jatuh Tempo / Overdue)
  const [upcomingVaccines, setUpcomingVaccines] = useState(0); // BARU: Untuk Dokter (Vaksin 7 Hari ke Depan)
  
  // State Grafik & List Data
  const [chartHeights, setChartHeights] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [chartLabels, setChartLabels] = useState<string[]>(['S', 'S', 'R', 'K', 'J', 'S', 'M']);
  const [patients, setPatients] = useState<any[]>([]);
  const [liveReminders, setLiveReminders] = useState<any[]>([]);

  useEffect(() => {
    // Pastikan sesi Supabase masih aktif
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        localStorage.removeItem('petcare_user');
        window.location.href = '/login/admin'; 
      }
    };
    checkSession();
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Ambil Nama Admin & ROLE dari Local Storage
      const storedUser = localStorage.getItem('petcare_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAdminName(user.name || 'Staf Klinik');
          setUserRole(user.role ? user.role.toLowerCase() : 'admin'); 
        } catch (e) { console.error("Error parse user", e); }
      }

      // 2. Query Total Pasien & List Pasien Terbaru
      const { data: dataPasien, count: pCount, error: pError } = await supabase
        .from('patients')
        .select('*, owners(full_name)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

      if (pError) throw pError;
      setTotalPatients(pCount || 0);
      
      if (dataPasien) {
        setPatients(dataPasien.map(p => ({
          id: `#P-${p.id.toString().slice(-4)}`,
          realId: p.id,
          owner: p.owners?.full_name || 'Umum',
          pet: p.name,
          species: p.species,
          status: 'Terdaftar',
          statusClass: 's-done'
        })));
      }

      // 3. Logika Reminder (Jatuh Tempo & Mendekat)
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      
      const { data: schedules } = await supabase
        .from('vaccination_schedules')
        .select('*, patients(name, species)')
        .eq('status', 'scheduled')
        .order('next_vaccine_date', { ascending: true });

      if (schedules) {
        // Logika Admin: Hitung yang HARI INI atau SUDAH LEWAT (Jatuh Tempo mendesak)
        const dueCount = schedules.filter(s => s.next_vaccine_date <= todayStr).length;
        setDueReminders(dueCount);

        // Logika Dokter: Hitung yang jadwalnya dalam 7 HARI KE DEPAN
        const upcomingCount = schedules.filter(s => {
          const targetDate = new Date(s.next_vaccine_date);
          const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays >= 0 && diffDays <= 7;
        }).length;
        setUpcomingVaccines(upcomingCount);

        // List 5 Pengingat terdekat untuk ditampilkan di tabel bawah
        const formattedReminders = schedules.slice(0, 5).map(s => {
          const targetDate = new Date(s.next_vaccine_date);
          const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return {
            name: s.patients?.name,
            species: s.patients?.species,
            vaccine: s.vaccine_name,
            dueText: diffDays < 0 ? 'Terlewat' : diffDays === 0 ? 'Hari ini' : `${diffDays} hari lagi`,
            color: diffDays <= 0 ? '#ff4757' : diffDays <= 3 ? '#ffa502' : '#8e52fc'
          };
        });
        setLiveReminders(formattedReminders);
      }

      // 4. LOGIKA GRAFIK DINAMIS (Aktivitas 7 Hari Terakhir)
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const counts = [0, 0, 0, 0, 0, 0, 0];
      const labels = [];
      const normalizeYmd = (value: any) => {
        if (!value) return '';
        return String(value).slice(0, 10);
      };

      const startDate = new Date();
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0); 

      const { data: recentVisits, error: visitError } = await supabase
        .from('medical_records')
        .select('treatment_date')
        .gte('treatment_date', startDate.toISOString().split('T')[0])
        .lte('treatment_date', todayStr);

      if (visitError) throw visitError;

      for (let i = 0; i < 7; i++) {
        const targetDay = new Date(startDate);
        targetDay.setDate(startDate.getDate() + i);
        const targetStr = targetDay.toISOString().split('T')[0];

        labels.push(dayNames[targetDay.getDay()]);

        if (recentVisits) {
          counts[i] = recentVisits.filter(v => normalizeYmd(v.treatment_date) === targetStr).length;
        }
      }

      const maxVal = Math.max(...counts, 1); 
      const calculatedHeights = counts.map(c => Math.round((c / maxVal) * 100));

      setChartHeights(calculatedHeights);
      setChartLabels(labels);

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Tambahkan class mode warna agar lebih kentara perbedaannya
    <div className={`admin-body ${userRole === 'dokter' ? 'dokter-mode' : 'admin-mode'}`}>
      <AdminSidebar active="beranda" />

      <main className="main-content">
        <AdminTopbar title={`Dashboard ${userRole === 'dokter' ? 'Medis' : 'Operasional'}`} name={adminName} />

        <div className="scroll-area">
          <div className="metrics-grid">
            {/* Metrik 1: Tampil untuk Admin & Dokter */}
            <div className="m-card m-purple">
              <span className="m-label">Total Pasien</span>
              <div className="m-val">{loading ? '...' : totalPatients}</div>
              <span className="m-sub">Tercatat di database</span>
            </div>

            {/* Metrik 2: HANYA tampil untuk ADMIN */}
            {userRole !== 'dokter' && (
              <div className="m-card m-red">
                <span className="m-label">Jatuh Tempo</span>
                <div className="m-val">{loading ? '...' : dueReminders}</div>
                <span className="m-sub">Vaksinasi mendesak / lewat</span>
              </div>
            )}

            {/* Metrik 2 Alternatif: HANYA tampil untuk DOKTER (Vaksinasi Mendekat) */}
            {userRole === 'dokter' && (
              <div className="m-card" style={{ borderTop: '4px solid #2ed573' }}>
                <span className="m-label">Vaksinasi Terdekat</span>
                <div className="m-val" style={{ color: '#2ed573' }}>{loading ? '...' : upcomingVaccines}</div>
                <span className="m-sub">Jadwal dalam 7 hari ke depan</span>
              </div>
            )}

            {/* Metrik 3: Grafik tampil untuk semuanya */}
            <div className="m-card m-green chart-col">
              <span className="m-label">Kunjungan (7 Hari Terakhir)</span>
              <div className="mini-chart">
                {chartHeights.map((h, i) => (
                  <div key={i} className="chart-item">
                    <div 
                      className="bar" 
                      style={{ height: `${loading ? 10 : h}%`, transition: 'height 1s ease' }}
                    ></div>
                    <span className="label">{chartLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TOMBOL AKSI UTAMA DIBEDAKAN BERDASARKAN ROLE */}
          {userRole === 'dokter' ? (
            <Link href="/admin/rekam-medis/tambah" className="banner-btn" style={{ background: 'linear-gradient(135deg, #2ed573 0%, #20bf6b 100%)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              <span>Mulai Pemeriksaan (Input Rekam Medis)</span>
            </Link>
          ) : (
            <Link href="/admin/pasien/tambah" className="banner-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <span>Daftarkan Pasien Baru (Front Desk)</span>
            </Link>
          )}

          <div className="dashboard-flex">
            {/* Tabel Pasien Baru: Tampil untuk semuanya */}
            <div className="data-card">
              <div className="card-header-dashboard">
                <h3>Pasien Baru Terdaftar</h3>
                <Link href="/admin/pasien" className="view-all">Lihat Semua</Link>
              </div>
              <div className="card-inner">
                <table>
                  <thead>
                    <tr>
                      <th>ID Pasien</th>
                      <th>Pemilik</th>
                      <th>Nama Hewan</th>
                      <th>Status</th>
                      <th className="text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Menyinkronkan data...</td></tr>
                    ) : patients.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Belum ada data pasien.</td></tr>
                    ) : (
                      patients.map((p, index) => (
                        <tr key={index}>
                          <td className="fw-bold">{p.id}</td>
                          <td>{p.owner}</td>
                          <td>{p.pet} <small style={{color:'#a19db5'}}>({p.species})</small></td>
                          <td><span className={`badge ${p.statusClass}`}>{p.status}</span></td>
                          <td className="text-right">
                            <Link href={`/admin/rekam-medis?id=${p.realId}`} className="a-btn">
                               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                 <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                               </svg>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* List Reminder Vaksin */}
            <div className="ai-card">
              <div className="ai-head">
                <div className="ai-title">Jadwal Vaksinasi</div>
              </div>
              <div className="reminder-list">
                {liveReminders.length === 0 ? (
                  <p style={{fontSize:'12px', color:'#a19db5', textAlign:'center', padding:'20px'}}>Tidak ada jadwal dalam waktu dekat.</p>
                ) : (
                  liveReminders.map((r, i) => (
                    <div key={i} className="r-item">
                      <div className="dot" style={{ background: r.color }}></div>
                      <div className="info">
                        <div className="name">{r.name}</div>
                        <div className="proc">{r.vaccine}</div>
                      </div>
                      <div className="days" style={{ color: r.color }}>{r.dueText}</div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Tombol Kirim WA HANYA muncul untuk Admin */}
              {userRole !== 'dokter' && (
                <Link href="/admin/reminder" className="ai-btn-primary" style={{textDecoration:'none'}}>
                  <span>Buka Portal WhatsApp</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        /* STYLE TAMBAHAN UNTUK PEMBEDA MODE WARNA */
        .admin-mode .main-content { border-top: 4px solid #8e52fc; }
        .dokter-mode .main-content { border-top: 4px solid #2ed573; }

        /* CSS BAWAAN KAMU */
        .admin-body { display: flex; min-height: 100vh; background: #f8f9fd; font-family: 'Plus Jakarta Sans', sans-serif; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; box-sizing: border-box; }
        .scroll-area { padding: 32px; overflow-y: auto; flex: 1; }
        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px; }
        .m-card { background: #fff; padding: 28px; border-radius: 24px; border: 1px solid #eef0f7; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
        .m-purple { border-top: 4px solid #8e52fc; }
        .m-red { border-top: 4px solid #ff4757; }
        .chart-col { grid-column: span 2; }
        .m-label { font-size: 11px; font-weight: 800; color: #a19db5; text-transform: uppercase; letter-spacing: 1px; }
        .m-val { font-size: 36px; font-weight: 900; color: #1a1a1a; margin: 8px 0; }
        .m-sub { font-size: 12px; color: #a19db5; }
        .mini-chart { display: flex; align-items: flex-end; gap: 14px; height: 80px; margin-top: 10px; }
        .chart-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .bar { width: 100%; border-radius: 6px; background: linear-gradient(180deg, #8e52fc 0%, #d463f2 100%); min-height: 4px; }
        .label { font-size: 10px; font-weight: 700; color: #a19db5; }
        .banner-btn { width: 100%; background: linear-gradient(135deg, #8e52fc 0%, #6c31e0 100%); padding: 18px; border-radius: 20px; display: flex; align-items: center; justify-content: center; gap: 12px; color: #fff; text-decoration: none; font-size: 15px; font-weight: 800; margin-bottom: 32px; transition: transform 0.2s; }
        .banner-btn:hover { transform: translateY(-2px); }
        .dashboard-flex { display: grid; grid-template-columns: 1fr 340px; gap: 32px; }
        .data-card { background: #fff; border-radius: 28px; border: 1px solid #eef0f7; overflow: hidden; }
        .card-header-dashboard { padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f8f9fb; }
        .view-all { font-size: 13px; font-weight: 700; color: #8e52fc; text-decoration: none; }
        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 16px 32px; text-align: left; font-size: 11px; font-weight: 800; color: #a19db5; text-transform: uppercase; background: #fdfbff; }
        tbody td { padding: 18px 32px; font-size: 14px; color: #1a1a1a; border-bottom: 1px solid #f9f7ff; }
        .fw-bold { font-weight: 700; color: #8e52fc; }
        .badge { padding: 6px 12px; border-radius: 10px; font-size: 11px; font-weight: 800; background: #f0fff4; color: #2ed573; }
        .a-btn { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #f4eeff; color: #8e52fc; transition: 0.2s; }
        .a-btn:hover { background: #8e52fc; color: #fff; }
        .ai-card { background: #fff; border-radius: 28px; border: 1px solid #eef0f7; padding: 28px; }
        .ai-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .ai-title { font-weight: 800; }
        .reminder-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px; }
        .r-item { display: flex; align-items: center; gap: 16px; padding: 14px; background: #f8f9fd; border-radius: 16px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .info { flex: 1; }
        .days { font-size: 12px; font-weight: 800; }
        .ai-btn-primary { width: 100%; height: 50px; background: #1a1a1a; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 800; transition: 0.2s; }
        .ai-btn-primary:hover { background: #333; }
        .text-right { text-align: right; }
      `}</style>
    </div>
  );
}