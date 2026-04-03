'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  name?: string;
  onSearch?: (query: string) => void;
  backUrl?: string;
}

export default function AdminTopbar({ title, subtitle, name, onSearch, backUrl }: AdminTopbarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (val: string) => {
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  return (
    <div className="admin-topbar">
      <style jsx>{`
        .admin-topbar { height: 72px; background: #fff; border-bottom: 1px solid #f0f0f0; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 40; }
        .tb-left { display: flex; align-items: center; gap: 16px; }
        .back-btn { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid #ece4ff; display: flex; align-items: center; justify-content: center; color: #1a1a1a; transition: all 0.2s; }
        .back-btn:hover { background: #f9f7ff; border-color: #8e52fc; color: #8e52fc; }
        .tb-title { font-weight: 800; font-size: 18px; color: #1a1a1a; }
        .tb-sub { font-size: 12px; color: #7a7a7a; font-weight: 600; margin-top: 1px; }

        .tb-right { display: flex; align-items: center; gap: 16px; }
        .search-container { position: relative; width: 320px; }
        .search-container svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #a19db5; }
        .search-container input { width: 100%; padding: 11px 16px 11px 44px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 12px; font-size: 13.5px; color: #1a1a1a; outline: none; transition: all 0.2s; }
        .search-container input:focus { border-color: #c084fc; background: #fff; box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.08); }
        
        .user-trigger { width: 40px; height: 40px; border-radius: 12px; background: #f4eeff; display: flex; align-items: center; justify-content: center; color: #8e52fc; cursor: pointer; transition: all 0.2s; }
        .user-trigger:hover { background: #e8d9ff; }
      `}</style>

      <div className="tb-left">
        {backUrl && (
          <Link href={backUrl} className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
        )}
        <div>
          <h1 className="tb-title">{title}</h1>
          {(subtitle || name) && <p className="tb-sub">{subtitle || name}</p>}
        </div>
      </div>

      <div className="tb-right">
        {onSearch && (
          <div className="search-container">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Cari nama pasien..." 
              value={query}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        )}
        <div className="user-trigger">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
      </div>
    </div>
  );
}
