'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import BrandLogo from './BrandLogo';

// Konstanta style
const sidebarStyle: React.CSSProperties = {
  width: '220px', minHeight: '100vh', background: '#0c071b', color: '#fff',
  display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0,
  zIndex: 1000, boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
};

const logoBox: React.CSSProperties = { padding: '28px 20px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' };
const logoCircle: React.CSSProperties = { width: '38px', height: '38px', borderRadius: '10px', background: '#8e52fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const navList: React.CSSProperties = { flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' };
const navItem = (isActive: boolean): React.CSSProperties => ({
  display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px',
  padding: '11px 14px', borderRadius: '12px', textDecoration: 'none',
  fontSize: '13.5px', fontWeight: 700, transition: 'all 0.2s',
  color: isActive ? '#fff' : '#a19db5',
  background: isActive ? 'rgba(142, 82, 252, 0.2)' : 'transparent',
  border: `1.5px solid ${isActive ? 'rgba(142,82,252,0.3)' : 'transparent'}`,
});
const footer: React.CSSProperties = { padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' };
const uAva: React.CSSProperties = { width: '36px', height: '36px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0c071b', flexShrink: 0 };
const logoutBtn: React.CSSProperties = { marginLeft: 'auto', width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4757', cursor: 'pointer', border: 'none', background: 'transparent', flexShrink: 0 };

const menu = [
  { id: 'beranda', label: 'Beranda', href: '/admin/beranda', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: 'pasien', label: 'Manajemen Pasien', href: '/admin/pasien', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id: 'rekam-medis', label: 'Riwayat Medis', href: '/admin/rekam-medis', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { id: 'pemilik', label: 'Data Pemilik', href: '/admin/pemilik', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'vaksin', label: 'Stok Vaksin', href: '/admin/vaksin', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { id: 'reminder', label: 'Pesan Pengingat', href: '/admin/reminder', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { id: 'pengaturan', label: 'Pengaturan', href: '/admin/pengaturan', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
];

export default function AdminSidebar({ active }: { active?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [userRole, setUserRole] = useState('admin');
  const [userName, setUserName] = useState('Staf Klinik');

  useEffect(() => {
    const storedUser = localStorage.getItem('petcare_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name);
        setUserRole(user.role ? user.role.toLowerCase() : 'admin');
      } catch (e) { console.error(e); }
    }
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      await supabase.auth.signOut();
      localStorage.removeItem('petcare_user');
      router.push('/login/admin');
      window.location.href = '/login/admin';
    }
  };

  const filteredMenu = menu.filter(item => {
    if (userRole === 'dokter') {
      // PERBAIKAN DI SINI: Menambahkan 'vaksin' dan 'pengaturan'
      return ['beranda', 'pasien', 'rekam-medis', 'vaksin', 'pengaturan'].includes(item.id);
    }
    return true; // Admin melihat semua
  });

  return (
    <aside style={sidebarStyle}>
      <div style={logoBox}>
        <BrandLogo size="small" />
        <div>
          <div style={{ fontSize: '16px', fontWeight: 900 }}>PetCare</div>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#8e52fc' }}>Smart Clinic</div>
        </div>
      </div>
      <nav style={navList}>
        {filteredMenu.map((item) => (
          <Link key={item.id} href={item.href} style={navItem(active === item.id)}>
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div style={footer}>
        <div style={uAva}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#8e52fc' }}>{userRole === 'dokter' ? 'Dokter Klinik' : 'Admin Utama'}</div>
        </div>
        <button style={logoutBtn} onClick={handleLogout}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>
      </div>
    </aside>
  );
}