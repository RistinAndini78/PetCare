'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

const S = {
  app: { width: '100%', minHeight: '100vh', display: 'flex' as const, flexDirection: 'column' as const, background: 'var(--bg)', position: 'relative' as const },
  scroll: { flex: 1, overflowY: 'auto' as const, paddingBottom: '80px' },
  hero: { background: 'var(--ink)', padding: '50px 20px 48px', textAlign: 'center' as const, position: 'relative' as const, overflow: 'hidden' },
  heroArc: { content: '', position: 'absolute' as const, bottom: '-24px', left: '50%', transform: 'translateX(-50%)', width: '110%', height: '50px', background: 'var(--bg)', borderRadius: '50%' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#8e52fc,#d463f2)', display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'center' as const, margin: '0 auto 14px', border: '3px solid rgba(255,255,255,.2)', position: 'relative' as const, zIndex: 1, color: '#fff', fontSize: '32px', fontWeight: 900 },
  heroName: { fontSize: '20px', fontWeight: 800, color: '#fff', position: 'relative' as const, zIndex: 1 },
  heroWa: { fontSize: '13px', color: 'rgba(255,255,255,.55)', marginTop: '4px', position: 'relative' as const, zIndex: 1 },
  heroBadge: { display: 'inline-flex' as const, alignItems: 'center' as const, gap: '6px', background: 'rgba(255,255,255,.1)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,.75)', marginTop: '10px', position: 'relative' as const, zIndex: 1 },
  stats: { display: 'grid' as const, gridTemplateColumns: '1fr 1fr 1fr', background: '#fff', borderRadius: '16px', border: '1.5px solid #e8d9ff', margin: '16px 16px 0', overflow: 'hidden' },
  statItem: { padding: '14px 8px', textAlign: 'center' as const, borderRight: '1px solid #e8d9ff' },
  statItemLast: { padding: '14px 8px', textAlign: 'center' as const },
  statVal: { fontSize: '18px', fontWeight: 800, color: 'var(--pr)' },
  statLabel: { fontSize: '10px', color: '#6b5a8a', fontWeight: 600, marginTop: '2px' },
  section: { margin: '16px 16px 0' },
  sectionTitle: { fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '.6px', color: '#6b5a8a', marginBottom: '8px', paddingLeft: '4px' },
  list: { background: '#fff', borderRadius: '16px', border: '1.5px solid #e8d9ff', overflow: 'hidden' },
  row: { display: 'flex' as const, flexDirection: 'row' as const, alignItems: 'center' as const, gap: '12px', padding: '14px 16px', borderBottom: '1px solid #e8d9ff', cursor: 'pointer', textDecoration: 'none' as const, color: '#0f0a1a', width: '100%', boxSizing: 'border-box' as const, background: 'transparent' },
  rowLast: { display: 'flex' as const, flexDirection: 'row' as const, alignItems: 'center' as const, gap: '12px', padding: '14px 16px', cursor: 'pointer', textDecoration: 'none' as const, color: '#0f0a1a', width: '100%', boxSizing: 'border-box' as const, background: 'transparent' },
  icon: (bg: string) => ({ width: '36px', height: '36px', borderRadius: '10px', background: bg, display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'center' as const, flexShrink: 0 }),
  label: { flex: 1, fontSize: '13.5px', fontWeight: 600, textAlign: 'left' as const },
  sub: { fontSize: '11px', color: '#6b5a8a', marginTop: '1px', display: 'block' },
  arrow: { fontSize: '18px', color: '#6b5a8a', flexShrink: 0, lineHeight: 1 },
  badge: { fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: '#fff1f2', color: '#ff4757', flexShrink: 0 },
  toggle: (on: boolean) => ({ width: '42px', height: '24px', borderRadius: '20px', background: on ? 'var(--pr)' : '#e8d9ff', position: 'relative' as const, cursor: 'pointer', flexShrink: 0, transition: 'all 0.3s' }),
  toggleDot: (on: boolean) => ({ position: 'absolute' as const, width: '18px', height: '18px', borderRadius: '50%', background: '#fff', top: '3px', [on ? 'right' : 'left']: '3px', boxShadow: '0 1px 4px rgba(0,0,0,.2)', transition: 'all 0.3s' }),
  logoutBtn: { margin: '16px', padding: '13px', borderRadius: '14px', background: '#fff1f2', border: '1.5px solid #f4baba', color: '#ff4757', fontSize: '14px', fontWeight: 800, textAlign: 'center' as const, cursor: 'pointer', display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: '8px' },
  staffBtn: { display: 'block', margin: '16px', padding: '13px', borderRadius: '14px', background: '#f4eeff', border: '1.5px solid #e8d9ff', color: 'var(--pr)', fontSize: '13px', fontWeight: 700, textAlign: 'center' as const, textDecoration: 'none' as const },
  modalOverlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'center' as const, padding: '20px' },
  modalCard: { background: '#fff', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' as const },
  modalBtn: { background: 'var(--pr)', color: '#fff', width: '100%', padding: '12px', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', marginTop: '16px', fontSize: '14px' },
};

export default function ProfilUser() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState<any | null>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [stats, setStats] = useState({ pets: 0, visits: 0, vaccines: 0 });

  const [notifWA, setNotifWA] = useState(true);
  const [modal, setModal] = useState({ open: false, title: '', content: '' });

  const ownerInitial = useMemo(() => {
    const name = String(owner?.full_name || '').trim();
    return name ? name.charAt(0).toUpperCase() : '👤';
  }, [owner?.full_name]);

  const ownerPhoneText = useMemo(() => {
    const phone = owner?.phone ? String(owner.phone) : '';
    return phone || '-';
  }, [owner?.phone]);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('petcare_owner') : null;
        const ownerSession = stored ? JSON.parse(stored) : null;
        if (!ownerSession?.id) {
          router.push('/login/user');
          return;
        }

        const { data: ownerRow, error: oErr } = await supabase
          .from('owners')
          .select('id, full_name, phone, email, address, created_at')
          .eq('id', ownerSession.id)
          .single();
        if (oErr) throw oErr;
        setOwner(ownerRow);

        const { data: patientRows, error: pErr } = await supabase
          .from('patients')
          .select('id, name, species, breed, birth_date, owner_id')
          .eq('owner_id', ownerSession.id)
          .order('created_at', { ascending: false });
        if (pErr) throw pErr;

        const patientIds = (patientRows || []).map((p: any) => String(p.id));

        // visit & vaccine stats dari medical_records (lebih konsisten dengan data admin)
        const { data: recordRows } = patientIds.length
          ? await supabase
              .from('medical_records')
              .select('id, patient_id, treatment_type')
              .in('patient_id', patientIds)
          : { data: [] as any[] };

        const visits = (recordRows || []).length;
        const vaccines = (recordRows || []).filter((r: any) =>
          String(r?.treatment_type || '').toLowerCase().includes('vaksin')
        ).length;

        // badge vaksin terdekat per hewan (opsional)
        const { data: scheduleRows } = patientIds.length
          ? await supabase
              .from('vaccination_schedules')
              .select('patient_id, next_vaccine_date, status')
              .in('patient_id', patientIds)
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

        const computeVaccineBadge = (nextDate?: string | null) => {
          if (!nextDate) return '';
          const now = new Date();
          const target = new Date(nextDate);
          if (Number.isNaN(target.getTime())) return '';
          const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays <= 0) return 'Vaksin Telat';
          if (diffDays <= 7) return `Vaksin H-${diffDays}`;
          return '';
        };

        const mappedPets = (patientRows || []).map((p: any) => {
          const pid = String(p.id);
          const badge = computeVaccineBadge(nextVaccineByPatient.get(pid) || null);
          const species = String(p.species || '').toLowerCase();
          const speciesText = p.species || 'Hewan';
          const breedText = p.breed || '-';
          return {
            id: pid,
            name: p.name || '-',
            desc: `${speciesText} · ${breedText}`,
            badge,
            iconBg: species.includes('anjing') ? '#fde8d3' : '#f4eeff',
            iconStroke: species.includes('anjing') ? '#f39c12' : '#8e52fc',
          };
        });

        setPets(mappedPets);
        setStats({ pets: mappedPets.length, visits, vaccines });
      } catch (e) {
        console.error(e);
        setOwner(null);
        setPets([]);
        setStats({ pets: 0, visits: 0, vaccines: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router, supabase]);

return (
    <div style={S.app}>
      <div style={S.scroll}>
        {/* Hero - Custom Profile Section */}
        <div style={S.hero}>
          <div style={{ content: '', position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)', width: '110%', height: '50px', background: 'var(--bg)', borderRadius: '50%' }} />
          <div style={S.avatar}>{ownerInitial}</div>
          <div style={S.heroName}>{loading ? 'Memuat...' : (owner?.full_name || 'Pelanggan')}</div>
          <div style={S.heroWa}>{loading ? '—' : ownerPhoneText}</div>
          <div style={S.heroBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}><ellipse cx="6" cy="4" rx="1.8" ry="2.5"/><ellipse cx="18" cy="4" rx="1.8" ry="2.5"/><ellipse cx="2.5" cy="11" rx="1.8" ry="2.5" transform="rotate(-20 2.5 11)"/><ellipse cx="21.5" cy="11" rx="1.8" ry="2.5" transform="rotate(20 21.5 11)"/><path d="M12 10c-3.5 0-7 2.5-7 6.5 0 3 2.5 5.5 7 5.5s7-2.5 7-5.5c0-4-3.5-6.5-7-6.5z"/></svg>
            Pemilik Hewan · {owner?.created_at ? `Aktif sejak ${new Date(owner.created_at).getFullYear()}` : 'Aktif'}
          </div>
        </div>

        {/* Stats */}
        <div style={S.stats}>
          <div style={S.statItem}><div style={S.statVal}>{loading ? '—' : stats.pets}</div><div style={S.statLabel}>Hewan</div></div>
          <div style={S.statItem}><div style={S.statVal}>{loading ? '—' : stats.visits}</div><div style={S.statLabel}>Kunjungan</div></div>
          <div style={S.statItemLast}><div style={S.statVal}>{loading ? '—' : stats.vaccines}</div><div style={S.statLabel}>Vaksinasi</div></div>
        </div>

        {!loading && !owner ? (
          <div style={{ margin: '16px', padding: '14px 16px', borderRadius: '16px', background: '#fff1f2', border: '1.5px solid #f4baba', color: '#b42318', fontWeight: 700, fontSize: '12.5px', lineHeight: 1.5 }}>
            Data profil tidak dapat dimuat. Silakan coba login ulang.
          </div>
        ) : null}

        {/* AKUN SAYA */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Akun Saya</div>
          <div style={S.list}>
            <Link href="/profil/edit" style={S.row}>
              <div style={S.icon('#f4eeff')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8e52fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
              <div style={S.label}>Edit Profil<span style={S.sub}>Nama, foto, alamat</span></div>
              <span style={S.arrow}>›</span>
            </Link>
            <Link href="/profil/ganti-password" style={S.row}>
              <div style={S.icon('#f0ecfb')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
              <div style={S.label}>Ganti Password<span style={S.sub}>Ubah password akun</span></div>
              <span style={S.arrow}>›</span>
            </Link>
            <div
              style={S.rowLast}
              onClick={() =>
                setModal({
                  open: true,
                  title: 'Kontak WhatsApp',
                  content: owner?.phone ? `Nomor WhatsApp Anda: ${owner.phone}` : 'Nomor WhatsApp belum tersedia di data pemilik.',
                })
              }
            >
              <div style={S.icon('#f0fff4')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2ed573" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>
              <div style={S.label}>
                No. WhatsApp
                <span style={S.sub}>{loading ? '—' : (owner?.phone || '-')}</span>
              </div>
              <span style={S.arrow}>›</span>
            </div>
          </div>
        </div>

        {/* HEWAN PELIHARAAN */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Hewan Peliharaan</div>
          <div style={S.list}>
            {loading ? (
              <div style={S.row}>
                <div style={S.icon('#f4eeff')}>…</div>
                <div style={S.label}>Memuat data hewan...</div>
              </div>
            ) : pets.length === 0 ? (
              <div style={S.row}>
                <div style={S.icon('#f4eeff')}>🐾</div>
                <div style={S.label}>
                  Belum ada hewan
                  <span style={S.sub}>Silakan hubungi klinik untuk mendaftarkan hewan baru.</span>
                </div>
              </div>
            ) : (
              <>
                {pets.slice(0, 2).map((p: any, idx: number) => (
                  <Link key={p.id} href="/hewan-saya" style={idx === 1 || pets.length === 1 ? S.row : S.row}>
                    <div style={S.icon(p.iconBg)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.iconStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <ellipse cx="6" cy="4" rx="1.8" ry="2.5" />
                        <ellipse cx="18" cy="4" rx="1.8" ry="2.5" />
                        <ellipse cx="2.5" cy="11" rx="1.8" ry="2.5" transform="rotate(-20 2.5 11)" />
                        <ellipse cx="21.5" cy="11" rx="1.8" ry="2.5" transform="rotate(20 21.5 11)" />
                        <path d="M12 10c-3.5 0-7 2.5-7 6.5 0 3 2.5 5.5 7 5.5s7-2.5 7-5.5c0-4-3.5-6.5-7-6.5z" />
                      </svg>
                    </div>
                    <div style={S.label}>
                      {p.name}
                      <span style={S.sub}>{p.desc}</span>
                    </div>
                    {p.badge ? <span style={S.badge}>{p.badge}</span> : null}
                    <span style={S.arrow}>›</span>
                  </Link>
                ))}

                <Link href="/hewan-saya" style={S.rowLast}>
                  <div style={S.icon('#f4eeff')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8e52fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M12 4h9" />
                      <path d="M4 9h16" />
                      <path d="M4 15h16" />
                    </svg>
                  </div>
                  <div style={S.label}>
                    Lihat Semua Hewan
                    <span style={S.sub}>Kelola data hewan peliharaan</span>
                  </div>
                  <span style={S.arrow}>›</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* NOTIFIKASI */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Notifikasi</div>
          <div style={S.list}>
            <div style={S.row}>
              <div style={S.icon('#f0fff4')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2ed573" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>
              <div style={S.label}>WhatsApp Notifikasi<span style={S.sub}>Terima pesan via WA</span></div>
              <div style={S.toggle(notifWA)} onClick={() => setNotifWA(!notifWA)}>
                <div style={S.toggleDot(notifWA)} />
              </div>
            </div>
            <Link href="/layanan" style={S.rowLast}>
              <div style={S.icon('#f0f8ff')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e90ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
              <div style={S.label}>Layanan & Fasilitas<span style={S.sub}>Cek fasilitas klinik kami</span></div>
              <span style={S.arrow}>›</span>
            </Link>
          </div>
        </div>

        {/* LAINNYA */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Lainnya</div>
          <div style={S.list}>
            <div style={S.row} onClick={() => setModal({ open: true, title: 'Tentang PetCare', content: 'Platform kesehatan hewan cerdas terintegrasi AI untuk masa depan klinik hewan Indonesia.' })}>
              <div style={S.icon('#f0ecfb')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></div>
              <div style={S.label}>Tentang PetCare<span style={S.sub}>Versi 1.0 · PetCare 2026</span></div>
              <span style={S.arrow}>›</span>
            </div>
            <Link href="/faq" style={S.rowLast}>
              <div style={S.icon('#fff9e6')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffa502" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
              <div style={S.label}>Bantuan & FAQ</div>
              <span style={S.arrow}>›</span>
            </Link>
          </div>
        </div>

        <div style={S.logoutBtn} onClick={() => { if (confirm('Keluar dari akun?')) router.push('/'); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Keluar dari Akun
        </div>
        <div style={{ height: '24px' }} />
      </div>

      {modal.open && (
        <div style={S.modalOverlay} onClick={() => setModal({ ...modal, open: false })}>
          <div style={S.modalCard} onClick={e => e.stopPropagation()}>
            <div style={{ color: 'var(--pr)', marginBottom: '16px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{modal.title}</h2>
            <p style={{ fontSize: '14px', color: '#6b5a8a', lineHeight: 1.6 }}>{modal.content}</p>
            <button style={S.modalBtn} onClick={() => setModal({ ...modal, open: false })}>Tutup</button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
