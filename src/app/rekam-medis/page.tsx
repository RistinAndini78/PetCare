'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { createClient } from '@/utils/supabase/client';

export default function RekamMedisUser() {
  const router = useRouter();
  const supabase = createClient();

  const [loadingPets, setLoadingPets] = useState(true);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any | null>(null);

  const selectedPet = useMemo(
    () => pets.find((p) => String(p?.id) === String(selectedPetId)),
    [pets, selectedPetId]
  );

  const formatAge = (birthDate?: string | null) => {
    if (!birthDate) return '-';
    const d = new Date(birthDate);
    if (Number.isNaN(d.getTime())) return '-';

    const now = new Date();
    let months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    if (now.getDate() < d.getDate()) months -= 1;
    if (months < 0) months = 0;
    if (months < 12) return `${months} Bln`;
    return `${Math.floor(months / 12)} Th`;
  };

  const formatDate = (value: any) => {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getVaccineName = (row: any) => {
    const notes = String(row?.diagnosis_notes || '');
    const fromNotes = notes.replace(/^Pemberian Vaksin\s+/i, '');
    return fromNotes || '-';
  };

  useEffect(() => {
    const loadPetsAndDefault = async () => {
      setLoadingPets(true);
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

        const mappedPets = (patientRows || []).map((p: any) => ({
          id: String(p.id),
          name: p.name || '-',
          species: p.species || '-',
          breed: p.breed || '-',
          gender: p.gender || '-',
          birth_date: p.birth_date || null,
          ageText: formatAge(p.birth_date),
          emoji: String(p.species || '').toLowerCase().includes('anjing') ? '🐶' : '🐱',
        }));

        setPets(mappedPets);
        setSelectedPetId(mappedPets[0]?.id || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPets(false);
      }
    };

    loadPetsAndDefault();
  }, [router, supabase]);

  useEffect(() => {
    const loadTimeline = async () => {
      if (!selectedPetId) {
        setTimeline([]);
        setUpcoming(null);
        return;
      }

      setLoadingTimeline(true);
      try {
        const { data: records, error: rErr } = await supabase
          .from('medical_records')
          .select('id, patient_id, treatment_date, treatment_type, doctor_name, diagnosis_notes, weight_kg')
          .eq('patient_id', selectedPetId)
          .order('treatment_date', { ascending: false });
        if (rErr) throw rErr;

        const items = (records || []).map((row: any) => {
          const typeText = String(row?.treatment_type || '').toLowerCase();
          const isVaccine = typeText.includes('vaksin');

          return {
            id: String(row?.id ?? `${row?.treatment_date}-${Math.random()}`),
            dateText: formatDate(row?.treatment_date),
            title: isVaccine ? `Vaksin ${getVaccineName(row)}` : (row?.treatment_type ? String(row.treatment_type) : 'Tindakan Medis'),
            doctor: row?.doctor_name ? String(row.doctor_name) : '',
            action: row?.diagnosis_notes ? String(row.diagnosis_notes) : '-',
            weight: row?.weight_kg != null ? `${Number(row.weight_kg).toFixed(1)} kg` : '',
          };
        });

        setTimeline(items);

        const { data: nextSchedule } = await supabase
          .from('vaccination_schedules')
          .select('id, patient_id, vaccine_name, next_vaccine_date, status')
          .eq('patient_id', selectedPetId)
          .eq('status', 'scheduled')
          .order('next_vaccine_date', { ascending: true })
          .limit(1);

        const next = nextSchedule?.[0];
        setUpcoming(
          next
            ? {
                dateText: formatDate(next.next_vaccine_date),
                title: next.vaccine_name ? `Vaksin ${next.vaccine_name}` : 'Jadwal Vaksin Berikutnya',
                action: 'Dihitung otomatis oleh sistem',
              }
            : null
        );
      } catch (e) {
        console.error(e);
        setTimeline([]);
        setUpcoming(null);
      } finally {
        setLoadingTimeline(false);
      }
    };

    loadTimeline();
  }, [selectedPetId, supabase]);

  return (
    <div className="app">
      <header className="header">
        <style jsx>{`
          .header { padding: 50px 20px 24px; background: linear-gradient(135deg, #1a0f2e 0%, #4a2b8e 100%); display: flex; align-items: center; gap: 16px; border-bottom: 2px solid rgba(255,255,255,0.05); position: sticky; top: 0; z-index: 100; color: #fff; }
          .back-btn { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: #fff; }
          .header-title { font-size: 17px; font-weight: 800; }
        `}</style>
        <button className="back-btn" onClick={() => window.history.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div className="header-title">Riwayat Medis</div>
      </header>

      <div className="scroll">
         <style jsx>{`
          .scroll { flex:1; overflow-y:auto; padding:0 0 100px; }
          .pet-summary { margin: 16px 20px; padding: 24px; background: #fff; border: 1.5px solid var(--border); border-radius: 24px; color: var(--text); display: flex; align-items: center; gap: 16px; box-shadow: 0 8px 30px rgba(142, 82, 252, 0.04); }
          .pet-photo { width: 56px; height: 56px; border-radius: 14px; background: var(--pr-pale); display: flex; align-items: center; justify-content: center; color: var(--pr); }
          .pet-pick { display: flex; gap: 10px; overflow-x: auto; padding: 2px 20px 6px; scrollbar-width: none; }
          .pet-pick::-webkit-scrollbar { display: none; }
          .pet-chip { flex-shrink: 0; padding: 10px 12px; border-radius: 14px; border: 1.5px solid var(--border); background: #fff; font-size: 12px; font-weight: 800; color: var(--ink); display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
          .pet-chip.active { border-color: var(--pr); background: var(--pr-pale); color: var(--pr); }
          .pet-chip span { font-weight: 900; }
          .timeline { padding: 0 24px 40px; position: relative; margin-top: 20px; }
          .timeline::before { content: ''; position: absolute; left: 33px; top: 20px; bottom: 0; width: 2px; background: var(--border); }
          .tl-item { display: flex; gap: 20px; margin-bottom: 30px; position: relative; }
          .tl-dot { width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 4px solid var(--border); z-index: 1; flex-shrink: 0; margin-left: 2px; }
          .tl-item.upcoming .tl-dot { border-color: var(--pr); background: var(--pr); box-shadow: 0 0 0 4px var(--pr-pale); }
          .tl-content { flex:1; background: #fff; padding: 16px; border-radius: 18px; border: 1.5px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
          .tl-date { font-size: 11px; font-weight: 700; color: var(--muted); margin-bottom: 4px; text-transform: uppercase; }
          .tl-title { font-size: 15px; font-weight: 800; color: var(--text); }
          .tl-doctor { font-size: 12px; color: var(--muted); margin-top: 4px; display: flex; align-items: center; gap: 4px; }
          .tl-action { font-size: 13px; color: var(--text); margin-top: 8px; font-weight: 500; }
          .tl-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
          .chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-size: 10.5px; font-weight: 800; border: 1.5px solid var(--border); background: #fff; color: var(--muted); }
          .chip strong { color: var(--ink); }
          .upcoming-badge { display: inline-block; padding: 4px 10px; background: var(--pr-pale); color: var(--pr); border-radius: 10px; font-size: 10px; font-weight: 800; margin-bottom: 8px; }
          .empty-box { margin: 16px 20px; padding: 18px; border-radius: 18px; border: 1.5px dashed var(--border); background: #fff; color: var(--muted); text-align: center; font-weight: 600; }
        `}</style>

        {loadingPets && pets.length === 0 ? (
          <div className="empty-box">Menghubungkan ke database...</div>
        ) : pets.length === 0 ? (
          <div className="empty-box">Belum ada hewan terdaftar di akun Anda.</div>
        ) : (
          <>
            <div className="pet-pick">
              {pets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`pet-chip ${String(selectedPetId) === String(p.id) ? 'active' : ''}`}
                  onClick={() => setSelectedPetId(String(p.id))}
                >
                  <span>{p.emoji}</span> {p.name}
                </button>
              ))}
            </div>

            <div className="pet-summary">
              <div className="pet-photo">{selectedPet?.emoji || '🐾'}</div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>{selectedPet?.name || '-'}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  {selectedPet?.species || '-'} · {selectedPet?.breed || '-'} · {selectedPet?.ageText || '-'}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="timeline">
          {upcoming ? (
            <div className="tl-item upcoming">
              <div className="tl-dot"></div>
              <div className="tl-content" style={{ border: '2px solid var(--pr)' }}>
                <div className="upcoming-badge">JADWAL BERIKUTNYA</div>
                <div className="tl-date">{upcoming.dateText}</div>
                <div className="tl-title">{upcoming.title}</div>
                <div className="tl-action">{upcoming.action}</div>
              </div>
            </div>
          ) : null}

          {loadingTimeline && selectedPetId ? (
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div className="tl-content">
                <div className="tl-title">Memuat riwayat...</div>
                <div className="tl-action">Mohon tunggu sebentar.</div>
              </div>
            </div>
          ) : timeline.length === 0 && selectedPetId ? (
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div className="tl-content">
                <div className="tl-title">Belum ada catatan medis</div>
                <div className="tl-action">Catatan dari dokter akan muncul setelah kunjungan dicatat.</div>
              </div>
            </div>
          ) : (
            timeline.map((item: any) => (
              <div key={item.id} className="tl-item">
                <div className="tl-dot"></div>
                <div className="tl-content">
                  <div className="tl-date">{item.dateText}</div>
                  <div className="tl-title">{item.title}</div>
                  {item.doctor ? (
                    <div className="tl-doctor">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      {item.doctor}
                    </div>
                  ) : null}
                  <div className="tl-action">{item.action}</div>
                  {item.weight ? (
                    <div className="tl-meta">
                      <span className="chip">Berat: <strong>{item.weight}</strong></span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}




