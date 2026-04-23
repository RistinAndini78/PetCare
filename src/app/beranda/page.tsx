'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserHeader from '@/components/UserHeader';
import BottomNav from '@/components/BottomNav';
import { createClient } from '@/utils/supabase/client';

export default function Beranda() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    fetchUserDataAndPets();
  }, []);

  const computeVaccineBadge = (nextDate?: string | null) => {
    if (!nextDate) return { label: 'Belum Ada Jadwal', cls: 's-gray' as const };
    const now = new Date();
    const target = new Date(nextDate);
    if (Number.isNaN(target.getTime())) return { label: 'Belum Ada Jadwal', cls: 's-gray' as const };

    const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return { label: 'Vaksin Telat', cls: 's-red' as const };
    if (diffDays <= 7) return { label: `Vaksin H-${diffDays}`, cls: 's-orange' as const };
    return { label: 'Sehat', cls: 's-green' as const };
  };

  const fetchUserDataAndPets = async () => {
    setLoading(true);
    try {
      // Prioritas: session pemilik dari localStorage (diselaraskan dengan input admin)
      const stored = typeof window !== 'undefined' ? localStorage.getItem('petcare_owner') : null;
      const ownerSession = stored ? JSON.parse(stored) : null;

      // Fallback lama: Supabase Auth (jika proyek nanti memakai auth email)
      let owner: any = null;

      if (ownerSession?.id) {
        const { data: ownerById } = await supabase
          .from('owners')
          .select('*')
          .eq('id', ownerSession.id)
          .single();
        owner = ownerById;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) {
          router.push('/login/user');
          return;
        }

        const { data: ownerByEmail } = await supabase
          .from('owners')
          .select('*')
          .eq('email', user.email)
          .single();
        owner = ownerByEmail;
      }

      if (owner) {
        setUserData(owner);

        // Ambil hewan (patients)
        const { data: patients, error: pErr } = await supabase
          .from('patients')
          .select('id, name, species, breed, owner_id, created_at')
          .eq('owner_id', owner.id)
          .order('created_at', { ascending: false });
        if (pErr) throw pErr;

        const ids = (patients || []).map((p: any) => String(p.id));

        // Ambil jadwal vaksin terdekat per hewan (vaccination_schedules)
        const { data: scheduleRows } = ids.length
          ? await supabase
              .from('vaccination_schedules')
              .select('patient_id, next_vaccine_date, status')
              .in('patient_id', ids)
              .eq('status', 'scheduled')
              .order('next_vaccine_date', { ascending: true })
          : { data: [] as any[] };

        const nextVaccineByPatient = new Map<string, string>();
        (scheduleRows || []).forEach((s: any) => {
          const pid = String(s.patient_id);
          if (!nextVaccineByPatient.has(pid) && s.next_vaccine_date) {
            nextVaccineByPatient.set(pid, String(s.next_vaccine_date));
          }
        });

        const mappedPets = (patients || []).map((p: any) => {
          const pid = String(p.id);
          const speciesLower = String(p.species || '').toLowerCase();
          const v = computeVaccineBadge(nextVaccineByPatient.get(pid) || null);
          return {
            id: pid,
            name: p.name || '-',
            breed: p.breed || p.species || 'Spesies Campuran',
            status: v.label,
            statusClass: v.cls,
            icon: speciesLower.includes('anjing') ? 'anjing' : 'kucing',
          };
        });

        setPets(mappedPets);
      } else {
        router.push('/login/user');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Menghubungkan ke database...</p>
        <style jsx>{`
          .loading-state { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; color: #8e52fc; }
          .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #8e52fc; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 10px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app bg-light">
      <UserHeader name={userData?.full_name || 'Pelanggan'} />

      <div className="scroll-content">
        <header className="welcome-meta">
          <p>Selamat datang kembali di PetCare!</p>
        </header>

        <h2 className="section-title">Hewan Peliharaan ({pets.length})</h2>
        
        {pets.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada hewan terdaftar di akun Anda.</p>
          </div>
        ) : (
          <div className="pet-list">
            {pets.map((p) => (
              <div key={p.id} className="p-card" onClick={() => router.push(`/rekam-medis`)}>
                <div className={`p-badge ${p.statusClass}`}>{p.status}</div>
                <div className="p-icon-box">
                  {p.icon === 'kucing' ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M12 15s-1.5-1.5-3-1.5m3 1.5s1.5-1.5 3-1.5"/></svg>
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 10a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM12 10a2 2 0 1 1 4 0 2 2 0 1 1-4 0z"/><path d="M12 14v2"/><path d="M10 16a2 2 0 0 0 4 0"/></svg>
                  )}
                </div>
                <div className="p-name">{p.name}</div>
                <div className="p-breed">{p.breed}</div>
              </div>
            ))}
          </div>
        )}

        <h2 className="section-title">Menu Cepat</h2>
        <div className="quick-grid">
          <div className="q-item" onClick={() => router.push('/layanan')}>
            <div className="q-icon-sq" style={{ background: '#f4eeff', color: '#8e52fc' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="q-label">Layanan Kami</div>
          </div>
          <div className="q-item" onClick={() => router.push('/konsultasi')}>
            <div className="q-icon-sq" style={{ background: '#fbeeff', color: '#d463f2' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div className="q-label">Konsultasi</div>
          </div>
        </div>
      </div>

      <BottomNav />

      <style jsx>{`
        .bg-light { background: #fdfbff; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .scroll-content { padding: 20px 0 100px; }
        .welcome-meta { padding: 0 28px; margin-bottom: 24px; color: #7a7a7a; font-size: 14px; }
        .section-title { font-size: 16px; font-weight: 900; color: #1a1a1a; padding: 0 28px; margin-bottom: 16px; }
        .pet-list { display: flex; gap: 20px; overflow-x: auto; padding: 10px 28px 30px; scrollbar-width: none; }
        .pet-list::-webkit-scrollbar { display: none; }
        .empty-state { padding: 20px 28px; color: #94a3b8; font-style: italic; }
        .p-card { flex-shrink: 0; width: 160px; background: #fff; border-radius: 28px; padding: 24px 16px; text-align: center; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); position: relative; transition: all 0.3s; cursor: pointer; }
        .p-card:active { transform: scale(0.95); }
        .p-icon-box { width: 64px; height: 64px; border-radius: 20px; background: #f4eeff; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #8e52fc; }
        .p-name { font-size: 16px; font-weight: 800; color: #1a1a1a; }
        .p-breed { font-size: 11px; color: #7a7a7a; font-weight: 600; margin-top: 2px; }
        .p-badge { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); padding: 4px 10px; border-radius: 10px; font-size: 9px; font-weight: 900; color: #fff; white-space: nowrap; }
        .s-green { background: #2ed573; box-shadow: 0 4px 10px rgba(46, 213, 115, 0.3); }
        .s-orange { background: #ffa502; box-shadow: 0 4px 10px rgba(255, 165, 2, 0.3); }
        .s-red { background: #ff4757; box-shadow: 0 4px 10px rgba(255, 71, 87, 0.25); }
        .s-gray { background: #94a3b8; box-shadow: 0 4px 10px rgba(148, 163, 184, 0.25); }
        .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 0 28px; }
        .q-item { background: #fff; padding: 20px; border-radius: 24px; border: 1.5px solid #f0f0f0; display: flex; flex-direction: column; gap: 10px; cursor: pointer; transition: 0.2s; }
        .q-item:active { background: #f9f9f9; }
        .q-icon-sq { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .q-label { font-size: 13px; font-weight: 800; color: #1a1a1a; }
      `}</style>
    </div>
  );
}