'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import StatCard from '@/components/StatCard';
import { createClient } from '@/utils/supabase/client';

export default function Reminder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const supabase = createClient();

  // State untuk Toggle Aturan
  const [toggles, setToggles] = useState({
    h7: false,
    h3: false,
    h1: false,
    late: false,
    activation: false,
  });

  useEffect(() => {
    fetchSettingsAndLogs();

    // REALTIME SUBSCRIPTION
    const channel = supabase
      .channel('realtime-reminder-logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reminder_logs' },
        () => fetchSettingsAndLogs()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSettingsAndLogs = async () => {
    setIsLoading(true);
    try {
      // 1. Ambil Pengaturan (Gunakan ID 1 sebagai row tunggal)
      const { data: settingsData } = await supabase
        .from('reminder_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (settingsData) {
        setToggles({
          h7: settingsData.h7_active,
          h3: settingsData.h3_active,
          h1: settingsData.h1_active,
          late: settingsData.late_active,
          activation: settingsData.activation_active,
        });
      }

      // 2. Ambil Riwayat Log
      const { data: logsData } = await supabase
        .from('reminder_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (logsData) setLogs(logsData);

    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // FUNGSI UTAMA TRIGGER AI
  const runReminderAI = async () => {
    setIsProcessing(true);
    try {
      // PERBAIKAN: Pastikan rute ini sesuai dengan file yang kamu buat di /api/cron/send-reminders/route.ts
      const response = await fetch('/api/cron/send-reminders');
      
      // Cek apakah response oke (status 200)
      if (!response.ok) throw new Error("Gagal menghubungi server AI");
      
      const result = await response.json();

      if (result.success) {
        alert(`🤖 Berhasil! ${result.sent || 0} pengingat dikirim via WhatsApp.`);
        fetchSettingsAndLogs();
      } else {
        alert("Tidak ada jadwal pengingat untuk diproses hari ini.");
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      alert("Error: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleHandler = async (key: keyof typeof toggles) => {
    const newValue = !toggles[key];
    const dbColumnName = `${key}_active`;

    setToggles(prev => ({ ...prev, [key]: newValue }));

    try {
      const { error } = await supabase
        .from('reminder_settings')
        .upsert({ id: 1, [dbColumnName]: newValue });

      if (error) throw error;
    } catch (error) {
      console.error("Gagal simpan setting:", error);
      setToggles(prev => ({ ...prev, [key]: !newValue }));
      alert("Database gagal merespon perubahan setting.");
    }
  };

  const stats = [
    { label: 'Total Pesan Terkirim', value: logs.length, sub: 'Log tercatat', type: 'yellow' as const },
    { label: 'Tingkat Respon', value: '94%', sub: 'Prediksi AI', type: 'green' as const },
    { label: 'Otomatisasi', value: 'Active', sub: 'Status Sistem', type: 'blue' as const },
    { label: 'Pending Task', value: 0, sub: 'Menunggu antrean', type: 'yellow' as const },
  ];

  return (
    <div className="admin-body">
      <AdminSidebar active="reminder" />
      <main className="main-admin">
        <AdminTopbar title="Reminder AI — Predictive" name="Admin PetCare" />

        <div className="content">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <StatCard key={i} label={s.label} value={s.value} sub={s.sub} type={s.type} />
            ))}
          </div>

          <div className="ai-trigger-card">
            <div className="ai-info">
               <h3>🚀 Jalankan </h3>
               <p>Klik tombol untuk memicu sistem mengecek jadwal vaksinasi 3 hari ke depan dan mengirim pesan otomatis.</p>
            </div>
            <button 
              className={`btn-ai-action ${isProcessing ? 'loading' : ''}`} 
              onClick={runReminderAI}
              disabled={isProcessing}
            >
              {isProcessing ? '🤖 Sedang Memproses...' : 'Mulai Pengiriman Otomatis'}
            </button>
          </div>

          <div className="main-grid">
            <div className="card">
              <div className="card-head">
                <div className="card-title">Log Reminder Terkirim</div>
                <button className="btn btn-outline" onClick={() => window.print()}>Export</button>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Pasien / Pemilik</th>
                      <th>Vaksin</th>
                      <th>Status</th>
                      <th>Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: '30px' }}>Loading data...</td></tr>
                    ) : logs.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: '30px' }}>Belum ada log.</td></tr>
                    ) : logs.map((log, i) => (
                      <tr key={i}>
                        <td>
                          <div className="owner-box">
                            <div className="animal-name">{log.nama_hewan}</div>
                            <div className="owner-sub">{log.nama_pemilik}</div>
                          </div>
                        </td>
                        <td><span className="vaksin-label">{log.jenis_vaksin}</span></td>
                        <td><span className="badge b-green">WhatsApp {log.status}</span></td>
                        <td className="time-cell">
                          {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-head"><div className="card-title">Aturan Reminder</div></div>
              <div className="toggle-list">
                <RuleToggle label="Reminder H-7" sub="Kirim 1 minggu sebelum" active={toggles.h7} onToggle={() => toggleHandler('h7')} icon="bell" />
                <RuleToggle label="Reminder H-3" sub="Kirim 3 hari sebelum" active={toggles.h3} onToggle={() => toggleHandler('h3')} icon="bell" />
                <RuleToggle label="Reminder H-1" sub="Kirim 1 hari sebelum" active={toggles.h1} onToggle={() => toggleHandler('h1')} icon="alert" />
                <RuleToggle label="Vaksin Terlambat" sub="Kirim berkala" active={toggles.late} onToggle={() => toggleHandler('late')} icon="alert" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #f8f9fd; font-family: 'Plus Jakarta Sans', sans-serif; }
        .main-admin { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .content { padding: 32px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; margin-bottom: 24px; }
        
        .ai-trigger-card { 
          background: #0c071b; border-radius: 24px; padding: 28px 40px; 
          margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; color: #fff;
        }
        .ai-info h3 { margin: 0; font-size: 18px; color: #d463f2; }
        .ai-info p { margin: 8px 0 0; font-size: 13px; color: #a19db5; max-width: 500px; }
        
        .btn-ai-action { 
          background: linear-gradient(135deg, #8e52fc 0%, #6c31e0 100%); 
          color: white; border: none; padding: 16px 32px; border-radius: 16px; font-weight: 800; cursor: pointer;
        }
        .btn-ai-action.loading { opacity: 0.7; cursor: wait; }

        .main-grid { display: grid; grid-template-columns: 1fr 380px; gap: 20px; }
        .card { background: #fff; border-radius: 24px; border: 1px solid #eef0f7; overflow: hidden; }
        .card-head { padding: 24px; border-bottom: 1px solid #f8f9fb; display: flex; align-items: center; justify-content: space-between; }
        .card-title { font-size: 15px; font-weight: 800; }
        
        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 16px 24px; text-align: left; font-size: 11px; color: #a19db5; text-transform: uppercase; background: #fdfbff; }
        tbody td { padding: 18px 24px; border-bottom: 1px solid #f9f7ff; }
        
        .owner-box .animal-name { font-weight: 800; font-size: 14px; color: #1a1a1a; }
        .owner-box .owner-sub { font-size: 11px; color: #a19db5; font-weight: 600; }
        .vaksin-label { font-size: 13px; font-weight: 700; color: #444; }
        
        .badge { padding: 6px 12px; border-radius: 10px; font-size: 10px; font-weight: 800; }
        .b-green { background: #f0fff4; color: #2ed573; }
        
        .toggle-list { padding: 20px; }
        .toggle { width:40px; height:22px; border-radius:20px; position:relative; cursor:pointer; background:#e2e8f0; transition: .3s; }
        .toggle.on { background:#8e52fc; }
        .toggle-knob { width:16px; height:16px; border-radius:50%; background:#fff; position:absolute; top:3px; left:3px; transition: .3s; }
        .toggle.on .toggle-knob { left:21px; }
        
        .btn-outline { background: transparent; border: 1px solid #ece4ff; padding: 8px 16px; border-radius: 10px; font-size: 12px; cursor: pointer; }
      `}</style>
    </div>
  );
}

interface RuleToggleProps {
  label: string;
  sub: string;
  active: boolean;
  onToggle: () => void;
  icon: string;
}

function RuleToggle({ label, sub, active, onToggle, icon }: RuleToggleProps) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px', 
      padding: '16px', 
      background: '#fdfbff', 
      borderRadius: '16px', 
      border: '1px solid #eef0f7', 
      marginBottom: '10px' 
    }}>
      {/* Icon Section */}
      <div style={{ 
        width: '36px', 
        height: '36px', 
        borderRadius: '10px', 
        background: active ? '#f4eeff' : '#f8f9fa', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '18px'
      }}>
        {icon === 'bell' ? '🔔' : '⚠️'}
      </div>

      {/* Text Section */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a1a' }}>{label}</div>
        <div style={{ fontSize: '11px', color: '#a19db5', fontWeight: 500 }}>{sub}</div>
      </div>

      {/* Toggle Switch Section */}
      <div 
        onClick={onToggle}
        style={{ 
          width: '40px', 
          height: '22px', 
          borderRadius: '20px', 
          position: 'relative', 
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: active ? '#8e52fc' : '#e2e8f0' // Warna berubah berdasarkan state
        }}
      >
        <div style={{ 
          width: '16px', 
          height: '16px', 
          borderRadius: '50%', 
          background: '#fff', 
          position: 'absolute', 
          top: '3px', 
          left: active ? '21px' : '3px', // Posisi berpindah berdasarkan state
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}></div>
      </div>
    </div>
  );
}