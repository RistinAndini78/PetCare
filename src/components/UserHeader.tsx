'use client';

import { useRouter } from 'next/navigation';

interface UserHeaderProps {
  title: string;
  subtitle?: string;
}

export default function UserHeader({ title, subtitle }: UserHeaderProps) {
  const router = useRouter();

  return (
    <header className="header-user">
      <style jsx>{`
        .header-user {
          padding: 64px 28px 40px;
          background: linear-gradient(135deg, #d463f2 0%, #8e52fc 100%);
          border-radius: 0 0 40px 40px;
          display: flex; justify-content: space-between; align-items: center;
          color: #fff;
          box-shadow: 0 12px 40px rgba(142, 82, 252, 0.2);
          position: relative;
          z-index: 10;
        }
        
        .header-left {
          display: flex;
          flex-direction: column;
        }
        
        .header-subtitle { 
          font-size: 14px; 
          font-weight: 600; 
          opacity: 0.9; 
          margin-bottom: 2px; 
        }
        
        .header-title { 
          font-size: 24px; 
          font-weight: 800; 
          font-family: 'Poppins', sans-serif; 
          letter-spacing: -0.5px; 
        }
        
        .notif-btn {
          width: 48px; height: 48px; background: rgba(255, 255, 255, 0.15);
          border-radius: 16px; display: flex; align-items: center; justify-content: center;
          position: relative; cursor: pointer; transition: all 0.2s;
        }
        .notif-btn:hover { background: rgba(255, 255, 255, 0.25); transform: translateY(-2px); }
        .red-dot {
          position: absolute; top: 12px; right: 12px; width: 8px; height: 8px;
          background: border: 2px solid #b363f5;
        }
      `}</style>
      
      <div className="header-left">
        {subtitle && <span className="header-subtitle">{subtitle}</span>}
        <div className="header-title">{title}</div>
      </div>
      
      <div className="notif-btn" onClick={() => router.push('/notifikasi')}>
        <div className="red-dot"></div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </div>
    </header>
  );
}