'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

interface Notification {
  id: number;
  type: 'vaccine' | 'info' | 'success';
  title: string;
  text: string;
  time: string;
  unread: boolean;
  color: string;
  pale: string;
}

export default function Notifikasi() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const relativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const absDiffDays = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    if (diffMs > 0) {
      if (absDiffDays === 0) return 'Hari ini';
      if (absDiffDays === 1) return '1 Hari lagi';
      return `${absDiffDays} Hari lagi`;
    } else {
      if (absDiffDays === 0) return 'Hari ini';
      if (absDiffDays === 1) return '1 Hari yang lalu';
      if (absDiffDays === 2) return '2 Hari yang lalu';
      if (absDiffDays < 7) return `${absDiffDays} Hari yang lalu`;
      return 'Minggu lalu';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stored = typeof window !== 'undefined' ? localStorage.getItem('petcare_owner') : null;
        const ownerSession = stored ? JSON.parse(stored) : null;
        if (!ownerSession?.id) {
          setLoading(false);
          return;
        }

        // Get patients
        const { data: patients } = await supabase
          .from('patients')
          .select('id, name')
          .eq('owner_id', ownerSession.id);

        if (!patients?.length) {
          setLoading(false);
          return;
        }

        const patientIds = patients.map((p: any) => p.id);

        // Vaccine schedules upcoming (next 7 days)
        const { data: schedules } = await supabase
          .from('vaccination_schedules')
          .select('id, patient_id, vaccine_name, next_vaccine_date, patients(name)')
          .eq('status', 'scheduled')
          .gte('next_vaccine_date', new Date().toISOString().split('T')[0])
          .lte('next_vaccine_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .in('patient_id', patientIds);

        // Medical records recent (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const { data: records } = await supabase
          .from('medical_records')
          .select('id, patient_id, treatment_date, treatment_type, patients(name)')
          .gte('treatment_date', sevenDaysAgo)
          .in('patient_id', patientIds)
          .order('treatment_date', { ascending: false })
          .limit(3);

        // Transform to notifications
        const vaccineNotifs = (schedules || []).map((s: any, index: number) => ({
          id: 1000 + index,
          type: 'vaccine' as const,
          title: 'Vaksinasi Segera!',
          text: `${s.patients?.name || 'Hewan'} dijadwalkan untuk vaksin ${s.vaccine_name} dalam waktu dekat.`,
          time: relativeTime(new Date(s.next_vaccine_date)),
          unread: true,
          color: '#ff4757',
          pale: '#fff5f5'
        }));

        const recordNotifs = (records || []).map((r: any, index: number) => ({
          id: 2000 + index,
          type: 'info' as const,
          title: 'Rekam Medis Baru',
          text: `${r.patients?.name || 'Hewan'}: ${r.treatment_type || 'Perawatan'}`,
          time: relativeTime(new Date(r.treatment_date)),
          unread: true,
          color: '#8e52fc',
          pale: '#f4eeff'
        }));

        const allNotifs = [...vaccineNotifs, ...recordNotifs]
          .sort((a, b) => new Date().getTime() - new Date().getTime()); // Simplified sort

        setNotifications(allNotifs);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <div className="app bg-white">
      <header className="header-simple">
        <style jsx>{`
          .bg-white { background: #fdfbff; min-height: 100vh; display: flex; flex-direction: column; }
          .header-simple { padding: 56px 20px 24px; display: flex; align-items: center; gap: 20px; border-bottom: 1.5px solid #f0f0f0; background: #fff; position: sticky; top: 0; z-index: 10; }
          .back-circle { width: 40px; height: 40px; border-radius: 12px; background: #f4eeff; display: flex; align-items: center; justify-content: center; color: #8e52fc; border: none; cursor: pointer; }
          .title-bold { font-size: 17px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
        `}</style>
        <button className="back-circle" onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div className="title-bold">Notifikasi</div>
      </header>

      <div className="scroll flex-1">
        <style jsx>{`
          .flex-1 { flex: 1; padding-bottom: 100px; padding-top: 16px; }
          .n-card { display: flex; gap: 16px; background: #fff; padding: 20px 24px; margin: 0 16px 12px; border-radius: 20px; border: 1px solid #f0f0f0; box-shadow: 0 4px 16px rgba(0,0,0,0.02); position: relative; overflow: hidden; transition: all 0.2s; cursor: pointer; }
          .n-card:active { transform: scale(0.98); }
          .unread-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #8e52fc; }
          
          .n-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          
          .n-body { flex: 1; min-width: 0; }
          .n-title { font-size: 14px; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
          .n-text { font-size: 12.5px; color: #666; line-height: 1.5; font-weight: 500; }
          .n-time { font-size: 10.5px; color: #a19db5; font-weight: 700; margin-top: 8px; }
        `}</style>
        
        {loading ? (
          <div className="n-card" style={{justifyContent: 'center', padding: '40px 24px'}}>
            <div style={{color: '#a19db5', fontWeight: '600', fontSize: '14px'}}>Memuat Notifikasi...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="n-card" style={{justifyContent: 'center', padding: '40px 24px'}}>
            <div style={{color: '#a19db5', fontWeight: '600', fontSize: '14px'}}>Belum ada notifikasi</div>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="n-card" onClick={() => markAsRead(n.id)}>
              {n.unread && <div className="unread-indicator"></div>}
              
              <div className="n-icon" style={{ background: n.pale, color: n.color }}>
                {n.type === 'vaccine' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg>}
                {n.type === 'info' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>}
                {n.type === 'success' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              
              <div className="n-body">
                <div className="n-title">{n.title}</div>
                <div className="n-text">{n.text}</div>
                <div className="n-time">{n.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
}