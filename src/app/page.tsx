'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="app" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg)', padding: '20px' }}>
      <style jsx global>{`
        .hero { text-align:center; margin-bottom:40px; animation:popIn .6s ease both; }
        .logo-box { width:80px; height:80px; background:linear-gradient(135deg,var(--sc),var(--pr)); border-radius:24px; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; color:#fff; box-shadow:0 12px 32px rgba(142,82,252,0.2); }
        .brand { font-family:'Poppins',sans-serif; font-size:36px; font-weight:900; color:var(--ink); letter-spacing:-1.5px; }
        .sub { color:var(--muted); font-size:14px; margin-top:4px; font-weight:600; }

        .portal-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; width:100%; max-width:700px; animation:popIn .8s ease both .2s; }
        .portal-card { background:#fff; border:2.5px solid var(--border); border-radius:32px; padding:48px 32px; text-align:center; text-decoration:none; transition:all .4s cubic-bezier(0.3, 1.5, 0.6, 1); display:flex; flex-direction:column; align-items:center; gap:16px; position:relative; overflow:hidden; }
        .portal-card:hover { border-color:var(--pr); transform:translateY(-12px); box-shadow:0 32px 64px rgba(142,82,252,0.15); }
        .portal-card::before { content:''; position:absolute; top:0; left:0; right:0; height:8px; background:linear-gradient(90deg,var(--sc),var(--pr)); opacity:0; transition:opacity .3s; }
        .portal-card:hover::before { opacity:1; }

        .icon-p { width:64px; height:64px; border-radius:22px; display:flex; align-items:center; justify-content:center; margin-bottom:8px; transition:transform .3s; }
        .portal-card:hover .icon-p { transform:scale(1.1) rotate(5deg); }

        .p-name { font-size:20px; font-weight:900; color:var(--ink); }
        .p-desc { font-size:13px; color:var(--muted); line-height:1.6; }

        @media (max-width:600px){
          .portal-grid { grid-template-columns:1fr; }
        }
      `}</style>
      
      <div className="hero">
        <div className="logo-box">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4.5 16.5c-1.5 1.26-2 3.33-1 4.5s3.24.5 4.5-1M19.5 16.5c1.5 1.26 2 3.33 1 4.5s-3.24.5-4.5-1M12 18c-2.5 0-4.5 2-4.5 4.5S9.5 27 12 27s4.5-2 4.5-4.5S14.5 18 12 18z"/>
            <circle cx="7" cy="7" r="3"/>
            <circle cx="17" cy="7" r="3"/>
            <circle cx="12" cy="11" r="3"/>
          </svg>
        </div>
        <div className="brand">PetCare Smart</div>
        <div className="sub">Pilih portal untuk melanjutkan</div>
      </div>

      <div className="portal-grid">
        <Link href="/login/user" className="portal-card">
          <div className="icon-p" style={{ background: 'var(--sc-pale)', color: 'var(--sc)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="p-name">Pemilik Hewan</div>
          <div className="p-desc">Pantau riwayat medis & jadwal kesehatan peliharaan Anda.</div>
        </Link>

        <Link href="/login/admin" className="portal-card">
          <div className="icon-p" style={{ background: 'var(--pr-pale)', color: 'var(--pr)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="p-name">Staf Klinik</div>
          <div className="p-desc">Kelola data pasien, rekam medis, dan operasional klinik.</div>
        </Link>
      </div>
    </div>
  );
}
