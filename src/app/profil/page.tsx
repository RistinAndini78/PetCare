'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';

const S = {
  app: { width: '100%', minHeight: '100vh', display: 'flex' as const, flexDirection: 'column' as const, background: 'var(--bg)', position: 'relative' as const },
  scroll: { flex: 1, overflowY: 'auto' as const, paddingBottom: '80px' },
  hero: { background: 'var(--ink)', padding: '50px 20px 48px', textAlign: 'center' as const, position: 'relative' as const, overflow: 'hidden' },
  heroArc: { content: '', position: 'absolute' as const, bottom: '-24px', left: '50%', transform: 'translateX(-50%)', width: '110%', height: '50px', background: 'var(--bg)', borderRadius: '50%' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#8e52fc,#d463f2)', display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'center' as const, margin: '0 auto 14px', border: '3px solid rgba(255,255,255,.2)', position: 'relative' as const, zIndex: 1, color: '#fff' },
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
  const [notifVaksin, setNotifVaksin] = useState(true);
  const [notifWA, setNotifWA] = useState(true);
  const [modal, setModal] = useState({ open: false, title: '', content: '' });

  return (
    <div style={S.app}>
      <div style={S.scroll}>
        {/* Hero */}
        <div style={S.hero}>
          <div style={{ content: '', position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)', width: '110%', height: '50px', background: 'var(--bg)', borderRadius: '50%' }} />
          <div style={S.avatar}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div style={S.heroName}>Siti Rahayu</div>
          <div style={S.heroWa}>+62 812-3456-7890</div>
          <div style={S.heroBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}><ellipse cx="6" cy="4" rx="1.8" ry="2.5"/><ellipse cx="18" cy="4" rx="1.8" ry="2.5"/><ellipse cx="2.5" cy="11" rx="1.8" ry="2.5" transform="rotate(-20 2.5 11)"/><ellipse cx="21.5" cy="11" rx="1.8" ry="2.5" transform="rotate(20 21.5 11)"/><path d="M12 10c-3.5 0-7 2.5-7 6.5 0 3 2.5 5.5 7 5.5s7-2.5 7-5.5c0-4-3.5-6.5-7-6.5z"/></svg>
            Pemilik Hewan · Aktif sejak 2026
          </div>
        </div>

        {/* Stats */}
        <div style={S.stats}>
          <div style={S.statItem}><div style={S.statVal}>2</div><div style={S.statLabel}>Hewan</div></div>
          <div style={S.statItem}><div style={S.statVal}>5</div><div style={S.statLabel}>Kunjungan</div></div>
          <div style={S.statItemLast}><div style={S.statVal}>8</div><div style={S.statLabel}>Vaksinasi</div></div>
        </div>

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
            <div style={S.rowLast} onClick={() => setModal({ open: true, title: 'Verifikasi WA', content: 'Nomor WhatsApp Anda +62 812-3456-7890 telah terverifikasi.' })}>
              <div style={S.icon('#f0fff4')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2ed573" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>
              <div style={S.label}>No. WhatsApp<span style={S.sub}>+62 812-3456-7890 · Terverifikasi ✓</span></div>
              <span style={S.arrow}>›</span>
            </div>
          </div>
        </div>

        {/* HEWAN PELIHARAAN */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Hewan Peliharaan</div>
          <div style={S.list}>
            <Link href="/hewan-saya" style={S.row}>
              <div style={S.icon('#f4eeff')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8e52fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="6" cy="4" rx="1.8" ry="2.5"/><ellipse cx="18" cy="4" rx="1.8" ry="2.5"/><ellipse cx="2.5" cy="11" rx="1.8" ry="2.5" transform="rotate(-20 2.5 11)"/><ellipse cx="21.5" cy="11" rx="1.8" ry="2.5" transform="rotate(20 21.5 11)"/><path d="M12 10c-3.5 0-7 2.5-7 6.5 0 3 2.5 5.5 7 5.5s7-2.5 7-5.5c0-4-3.5-6.5-7-6.5z"/></svg></div>
              <div style={S.label}>Luna<span style={S.sub}>Kucing Persia · 2 tahun</span></div>
              <span style={S.badge}>Vaksin H-2</span>
              <span style={S.arrow}>›</span>
            </Link>
            <Link href="/hewan-saya" style={S.row}>
              <div style={S.icon('#fde8d3')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="6" cy="4" rx="1.8" ry="2.5"/><ellipse cx="18" cy="4" rx="1.8" ry="2.5"/><ellipse cx="2.5" cy="11" rx="1.8" ry="2.5" transform="rotate(-20 2.5 11)"/><ellipse cx="21.5" cy="11" rx="1.8" ry="2.5" transform="rotate(20 21.5 11)"/><path d="M12 10c-3.5 0-7 2.5-7 6.5 0 3 2.5 5.5 7 5.5s7-2.5 7-5.5c0-4-3.5-6.5-7-6.5z"/></svg></div>
              <div style={S.label}>Coki<span style={S.sub}>Pomeranian · 4 tahun</span></div>
              <span style={S.arrow}>›</span>
            </Link>
            <Link href="/admin/pasien/tambah" style={S.rowLast}>
              <div style={S.icon('#f4eeff')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8e52fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
              <div style={S.label}>Tambah Hewan Baru</div>
              <span style={S.arrow}>›</span>
            </Link>
          </div>
        </div>

        {/* NOTIFIKASI */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Notifikasi</div>
          <div style={S.list}>
            <div style={S.row}>
              <div style={S.icon('#f4eeff')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8e52fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>
              <div style={S.label}>Reminder Vaksin<span style={S.sub}>Notif H-7, H-3, H-1</span></div>
              <div style={S.toggle(notifVaksin)} onClick={() => setNotifVaksin(!notifVaksin)}>
                <div style={S.toggleDot(notifVaksin)} />
              </div>
            </div>
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
              <div style={S.label}>Tentang PetCare<span style={S.sub}>Versi 1.0 · PKM-KC 2026</span></div>
              <span style={S.arrow}>›</span>
            </div>
            <Link href="/faq" style={S.rowLast}>
              <div style={S.icon('#fff9e6')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffa502" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
              <div style={S.label}>Bantuan & FAQ</div>
              <span style={S.arrow}>›</span>
            </Link>
          </div>
        </div>

        <Link href="/login" style={S.staffBtn}>Masuk Dashboard Staf</Link>
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
