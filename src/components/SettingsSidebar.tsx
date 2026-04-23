'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SettingsNavItem =
  | { type: 'section'; label: string }
  | { type: 'link'; href: string; label: string };

const settingsNav: SettingsNavItem[] = [
  { type: 'section', label: 'Klinik' },
  { type: 'link', href: '/admin/pengaturan', label: 'Profil Klinik' },
   { type: 'link', href: '/admin/pengaturan/staf', label: 'Staf' },
  { type: 'section', label: 'Akun' },
  { type: 'link', href: '/admin/pengaturan/akun', label: 'Akun Saya' },
  { type: 'link', href: '/admin/pengaturan/keamanan', label: 'Keamanan' },
];

const sidebarStyle: React.CSSProperties = {
  width: '220px', background: '#fff', borderRadius: '20px',
  border: '1.5px solid #f0f0f0', padding: '10px',
  display: 'flex', flexDirection: 'column', gap: '2px',
  height: 'fit-content', position: 'sticky', top: '104px',
  boxShadow: '0 4px 20px rgba(142,82,252,0.05)', flexShrink: 0,
};

const sectionStyle: React.CSSProperties = {
  padding: '12px 12px 6px',
  fontSize: '10px',
  fontWeight: 900,
  letterSpacing: '1px',
  color: '#a19db5',
  textTransform: 'uppercase',
};

const itemStyle = (active: boolean): React.CSSProperties => ({
  display: 'block', padding: '13px 18px', borderRadius: '14px',
  fontSize: '13.5px', fontWeight: 700,
  color: active ? '#8e52fc' : '#8a80a0',
  background: active ? '#f4eeff' : 'transparent',
  textDecoration: 'none', transition: 'all 0.2s',
});

export default function SettingsSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin/pengaturan' && pathname === '/admin/pengaturan') return true;
    if (href !== '/admin/pengaturan' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div style={sidebarStyle}>
      {settingsNav.map((item) => {
        if (item.type === 'section') {
          return (
            <div key={`section-${item.label}`} style={sectionStyle}>
              {item.label}
            </div>
          );
        }

        return (
          <Link key={item.href} href={item.href} style={itemStyle(isActive(item.href))}>
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
