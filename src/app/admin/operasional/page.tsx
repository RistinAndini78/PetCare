'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SettingsSidebar from '@/components/SettingsSidebar';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function AdminOperasional() {
  const supabase = createClient();
  const [hours, setHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const { data, error } = await supabase
          .from('clinic_hours')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) throw error;
        setHours(data || []);
      } catch (err) {
        console.error('Error fetching hours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHours();
  }, [supabase]);

  return (
    <div className="admin-body">
      <AdminSidebar active="pengaturan" />
      <main className="main-content">
        <AdminTopbar title="Jam Operasional" subtitle="Atur waktu buka dan tutup klinik" />
        
        <div className="scroll-area">
          <div className="settings-flex">
            <SettingsSidebar />
            
            <div className="form-card">
              <div className="card-header">
                <h2 className="card-title">Atur Jadwal Kerja</h2>
              </div>
              <div className="card-body">
                <div className="schedule-list">
                  {loading ? (
                    <p style={{ textAlign: 'center', color: '#a19db5' }}>Memuat jadwal...</p>
                  ) : hours.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#a19db5' }}>Jadwal belum diatur.</p>
                  ) : (
                    hours.map((h) => (
                      <div key={h.id} className="s-row">
                        <span className="s-day">{h.day_label}</span>
                        <span className="s-time">{h.open_time} - {h.close_time}</span>
                      </div>
                    ))
                  )}
                </div>
                
                <Link href="/admin/operasional/edit" className="edit-link-btn">
                  Update Jadwal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 32px; }

        .settings-flex { display: flex; gap: 32px; align-items: flex-start; }

        .form-card { flex: 1; background: #fff; border-radius: 28px; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); overflow: hidden; }
        .card-header { padding: 24px 32px; border-bottom: 1.5px solid #fdfbff; }
        .card-title { font-size: 16px; font-weight: 800; color: #1a1a1a; }
        
        .card-body { padding: 32px; }
        .schedule-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .s-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: #f9f7ff; border-radius: 16px; border: 1px solid #ece4ff; }
        .s-day { font-size: 14px; font-weight: 700; color: #1a1a1a; }
        .s-time { font-size: 14.5px; font-weight: 800; color: #8e52fc; }

        .edit-link-btn { width: 100%; height: 52px; background: #8e52fc; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #fff; text-decoration: none; font-size: 14px; font-weight: 800; transition: all 0.25s; box-shadow: 0 8px 24px rgba(142, 82, 252, 0.15); }
        .edit-link-btn:hover { background: #7a3eeb; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(142, 82, 252, 0.25); }
      `}</style>
    </div>
  );
}
