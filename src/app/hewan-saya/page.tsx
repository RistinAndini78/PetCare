'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserHeader from '@/components/UserHeader';
import BottomNav from '@/components/BottomNav';
import { createClient } from '@/utils/supabase/client';

export default function HewanSaya() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const headerCountText = useMemo(() => {
    if (loading) return 'Memuat data...';
    return `${pets.length} hewan terdaftar`;
  }, [loading, pets.length]);

  const formatAge = (birthDate?: string | null) => {
    if (!birthDate) return '-';
    const d = new Date(birthDate);
    if (Number.isNaN(d.getTime())) return '-';

    const now = new Date();
    let months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    if (now.getDate() < d.getDate()) months -= 1;
    if (months < 0) months = 0;

    if (months < 12) return `${months} Bln`;
    const years = Math.floor(months / 12);
    return `${years} Th`;
  };

  const formatWeight = (w: any) => {
    const n = Number(w);
    if (!Number.isFinite(n)) return '-';
    return `${n.toFixed(1)} kg`;
  };

  const computeVaccineStatus = (nextDate?: string | null) => {
    if (!nextDate) return { vaccine: '-', status: 'Belum Ada Jadwal', urgent: false };
    const now = new Date();
    const target = new Date(nextDate);
    if (Number.isNaN(target.getTime())) return { vaccine: '-', status: 'Belum Ada Jadwal', urgent: false };

    const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return { vaccine: 'Terlambat', status: 'Vaksin Terlambat', urgent: true };
    if (diffDays <= 7) return { vaccine: `H-${diffDays}`, status: 'Vaksin Segera', urgent: true };
    return { vaccine: 'Aman', status: 'Vaksin Lengkap', urgent: false };
  };

  useEffect(() => {
    const loadPets = async () => {
      setLoading(true);
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('petcare_owner') : null;
        const ownerSession = stored ? JSON.parse(stored) : null;
        if (!ownerSession?.id) {
          router.push('/login/user');
          return;
        }

        const { data: patientRows, error: pErr } = await supabase
          .from('patients')
          .select('id, name, species, breed, gender, birth_date, owner_id')
          .eq('owner_id', ownerSession.id)
          .order('created_at', { ascending: false });
        if (pErr) throw pErr;

        const ids = (patientRows || []).map((p: any) => p.id);

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

        const { data: recordRows } = ids.length
          ? await supabase
              .from('medical_records')
              .select('patient_id, treatment_date, weight_kg')
              .in('patient_id', ids)
              .order('treatment_date', { ascending: false })
          : { data: [] as any[] };

        const latestWeightByPatient = new Map<string, any>();
        (recordRows || []).forEach((r: any) => {
          const pid = String(r.patient_id);
          if (!latestWeightByPatient.has(pid) && r.weight_kg != null) {
            latestWeightByPatient.set(pid, r.weight_kg);
          }
        });

        const mapped = (patientRows || []).map((p: any) => {
          const pid = String(p.id);
          const nextVaccineDate = nextVaccineByPatient.get(pid) || null;
          const v = computeVaccineStatus(nextVaccineDate);
          const speciesLower = String(p.species || '').toLowerCase();

          return {
            id: pid,
            name: p.name || '-',
            breed: `${p.species || 'Hewan'} · ${p.breed || '-'} · ${p.gender || '-'}`,
            weight: formatWeight(latestWeightByPatient.get(pid)),
            age: formatAge(p.birth_date),
            vaccine: v.vaccine,
            status: v.status,
            urgent: v.urgent,
            type: speciesLower.includes('anjing') ? 'dog' : 'cat',
          };
        });

        setPets(mapped);
        setSelectedId(mapped[0]?.id || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, [router, supabase]);

  return (
    <div className="app">
      <UserHeader title="Hewan Saya" />

      <div className="scroll">
        <style jsx>{`
          .scroll { flex: 1; overflow-y: auto; padding: 20px 20px 100px; }
          .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; margin-top: 4px; }
          .section-title { font-size: 13px; font-weight: 800; color: var(--ink); }
          .section-link { font-size: 12px; color: var(--pr); font-weight: 800; cursor: pointer; }
          .pet-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
          .pet-card { background: var(--white); border-radius: 18px; border: 1.5px solid var(--border); overflow: hidden; transition: all .2s; cursor: pointer; }
          .pet-card:active { transform: scale(.98); }
          .pet-card.selected { border-color: var(--pr); box-shadow: 0 4px 16px rgba(142,82,252,.15); }
          .pet-card-top { display: flex; align-items: center; gap: 14px; padding: 16px; }
          .pet-avatar { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
          .pa-cat { background: #e8f0ff; }
          .pa-dog { background: #fde8d3; }
          .pet-info { flex: 1; }
          .pet-name { font-size: 16px; font-weight: 800; color: var(--ink); }
          .pet-breed { font-size: 12px; color: var(--muted); margin-top: 2px; }
          .pet-status { display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 800; padding: 3px 9px; border-radius: 20px; margin-top: 6px; }
          .ps-green { background: var(--green-pale); color: var(--green); }
          .ps-red { background: var(--red-pale); color: var(--red); }
          .ps-gray { background: #f2f3f7; color: var(--muted); }
          .pet-card-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; border-top: 1.5px solid var(--border); }
          .pcs-item { padding: 11px 8px; text-align: center; border-right: 1px solid var(--border); }
          .pcs-item:last-child { border: none; }
          .pcs-val { font-size: 13.5px; font-weight: 800; color: var(--ink); }
          .pcs-label { font-size: 9.5px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: .3px; margin-top: 2px; }
          
          .add-pet-btn { background: var(--white); border-radius: 18px; border: 2px dashed var(--border); padding: 18px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all .2s; margin-bottom: 16px; }
          .add-pet-btn:active { background: var(--pr-pale); border-color: var(--pr); }
          .empty-state { padding: 22px 18px; text-align: center; color: var(--muted); background: var(--white); border: 1.5px dashed var(--border); border-radius: 18px; margin-bottom: 16px; }
          .loading-state { padding: 22px 18px; text-align: center; color: var(--muted); background: var(--white); border: 1.5px solid var(--border); border-radius: 18px; margin-bottom: 16px; }

          .ai-banner { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #f59e0b 100%); border-radius: 20px; padding: 18px 20px; display: flex; align-items: center; gap: 14px; cursor: pointer; text-decoration: none; transition: all .2s; margin-bottom: 20px; box-shadow: 0 6px 24px rgba(124,58,237,0.3); }
          .ai-banner:active { transform: scale(.98); }
          .ai-banner-icon { width: 48px; height: 48px; background: rgba(255,255,255,.2); border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; backdrop-filter: blur(8px); }
          .ai-banner-info { flex: 1; }
          .ai-banner-label { font-size: 15px; font-weight: 800; color: white; }
          .ai-banner-sub { font-size: 12px; color: rgba(255,255,255,.75); margin-top: 3px; }
          .ai-banner-arrow { color: rgba(255,255,255,.7); font-size: 20px; }
        `}</style>

        <div className="section-head">
          <div className="section-title">Daftar Hewan</div>
        </div>

        <div className="pet-list">
          {loading ? (
            <div className="loading-state">Menghubungkan ke database...</div>
          ) : pets.length === 0 ? (
            <div className="empty-state">Belum ada hewan terdaftar di akun Anda.</div>
          ) : pets.map((pet, i) => (
            <div
              key={pet.id}
              className={`pet-card ${String(selectedId) === String(pet.id) ? 'selected' : ''} animate-pop stagger-${i + 1}`}
              onClick={() => setSelectedId(String(pet.id))}
            >
              <div className="pet-card-top">
                <div className={`pet-avatar ${pet.type === 'cat' ? 'pa-cat' : 'pa-dog'}`}>
                  {pet.type === 'cat' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="6" cy="4" rx="1.8" ry="2.5"/><ellipse cx="18" cy="4" rx="1.8" ry="2.5"/><ellipse cx="2.5" cy="11" rx="1.8" ry="2.5" transform="rotate(-20 2.5 11)"/><ellipse cx="21.5" cy="11" rx="1.8" ry="2.5" transform="rotate(20 21.5 11)"/><path d="M12 10c-3.5 0-7 2.5-7 6.5 0 3 2.5 5.5 7 5.5s7-2.5 7-5.5c0-4-3.5-6.5-7-6.5z"/></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="6" cy="4" rx="1.8" ry="2.5"/><ellipse cx="18" cy="4" rx="1.8" ry="2.5"/><ellipse cx="2.5" cy="11" rx="1.8" ry="2.5" transform="rotate(-20 2.5 11)"/><ellipse cx="21.5" cy="11" rx="1.8" ry="2.5" transform="rotate(20 21.5 11)"/><path d="M12 10c-3.5 0-7 2.5-7 6.5 0 3 2.5 5.5 7 5.5s7-2.5 7-5.5c0-4-3.5-6.5-7-6.5z"/></svg>
                  )}
                </div>
                <div className="pet-info">
                  <div className="pet-name">{pet.name}</div>
                  <div className="pet-breed">{pet.breed}</div>
                  <div className={`pet-status ${pet.status === 'Belum Ada Jadwal' ? 'ps-gray' : pet.urgent ? 'ps-red' : 'ps-green'}`}>
                    {pet.status !== 'Belum Ada Jadwal' && pet.urgent ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight:'3px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    ) : pet.status !== 'Belum Ada Jadwal' ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight:'3px' }}><polyline points="20 6 9 17 4 12"/></svg>
                    ) : null}
                    {pet.status}
                  </div>
                </div>
                <span style={{ fontSize: '18px', color: 'var(--muted)' }}>›</span>
              </div>
              <div className="pet-card-stats">
                <div className="pcs-item"><div className="pcs-val">{pet.weight}</div><div className="pcs-label">Berat</div></div>
                <div className="pcs-item"><div className="pcs-val">{pet.age}</div><div className="pcs-label">Umur</div></div>
                <div className="pcs-item"><div className="pcs-val" style={{ color: pet.vaccine === 'Aman' ? 'var(--green)' : pet.vaccine === 'Terlambat' ? 'var(--red)' : 'var(--ink)' }}>{pet.vaccine}</div><div className="pcs-label">Vaksin</div></div>
              </div>
            </div>
          ))}
        </div>

        <div className="add-pet-btn" onClick={() => alert('Silakan hubungi klinik untuk mendaftarkan hewan baru.')}>
          <span style={{ fontSize: '22px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)' }}>Daftarkan Hewan Baru ke Klinik</span>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
