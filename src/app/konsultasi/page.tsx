'use client';

import { useState, useEffect, type ReactNode } from 'react';
import UserHeader from '@/components/UserHeader';
import BottomNav from '@/components/BottomNav';
import { createClient } from '@/utils/supabase/client';

type Doctor = {
  id: string;
  name: string;
  spec: string;
  status: 'online' | 'busy';
  whatsapp: string;
  ava: ReactNode;
};

const UserIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const buildWhatsappLink = (phoneE164WithoutPlus: string, doctorName: string) => {
  const phone = phoneE164WithoutPlus.replace(/[^\d]/g, '');
  const message =
    `Halo ${doctorName}, saya ingin konsultasi mengenai hewan peliharaan saya.\n` +
    `Nama hewan: \nUmur: \nKeluhan/gejala: \n Sejak kapan: \n`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

export default function Konsultasi() {
  const supabase = createClient();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDokter();
  }, []);

  const fetchDokter = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('staf')
        .select('id, full_name, role, whatsapp, status')
        .not('whatsapp', 'is', null)
        .ilike('role', '%dokter%')
        .eq('status', 'Aktif');

      if (error) throw error;

      const mapped: Doctor[] = (data || []).map((s) => ({
        id: s.id,
        name: s.full_name,
        spec: s.role,
        status: 'online',
        whatsapp: s.whatsapp,
        ava: <UserIcon />,
      }));

      setDoctors(mapped);
    } catch (err: any) {
      console.error('Gagal memuat data dokter:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <UserHeader title="Konsultasi" />

      <div className="doctor-list">
        <style jsx>{`
          .doctor-list {
            flex: 1;
            overflow-y: auto;
            padding: 16px 20px 120px;
          }
          .note {
            background: rgba(29, 185, 84, 0.08);
            border: 1.5px solid rgba(29, 185, 84, 0.22);
            color: var(--ink);
            border-radius: 14px;
            padding: 12px 14px;
            font-size: 12px;
            line-height: 1.5;
            margin-bottom: 12px;
          }
          .doctor-card {
            background: var(--white);
            border-radius: 16px;
            border: 1.5px solid var(--border);
            padding: 14px;
            margin-bottom: 12px;
            display: flex;
            gap: 12px;
          }
          .doc-ava {
            width: 52px;
            height: 52px;
            border-radius: 15px;
            background: linear-gradient(135deg, var(--pr), var(--sc));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            flex-shrink: 0;
            color: #fff;
          }
          .doc-info {
            flex: 1;
            overflow: hidden;
            min-width: 0;
          }
          .doc-name {
            font-size: 14px;
            font-weight: 800;
            color: var(--ink);
          }
          .doc-spec {
            font-size: 11.5px;
            color: var(--muted);
            margin-top: 2px;
            line-height: 1.35;
          }
          .doc-status {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 10.5px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 20px;
            margin-top: 8px;
          }
          .ds-online {
            background: var(--green-pale);
            color: var(--green);
          }
          .ds-busy {
            background: #fef9e3;
            color: #a07b10;
          }
          .actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: flex-end;
            justify-content: center;
            flex-shrink: 0;
          }
          .wa-btn {
            border: none;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 900;
            cursor: pointer;
            background: #1db954;
            color: #fff;
            box-shadow: 0 10px 22px rgba(29, 185, 84, 0.2);
            transition: transform 0.15s ease;
            white-space: nowrap;
          }
          .wa-btn:active {
            transform: scale(0.98);
          }
          .wa-sub {
            font-size: 10px;
            font-weight: 700;
            color: var(--muted);
            text-align: right;
          }
          .empty-state {
            text-align: center;
            padding: 48px 20px;
            color: var(--muted);
            font-size: 13px;
            line-height: 1.6;
          }
          .loading-state {
            text-align: center;
            padding: 48px 20px;
            color: var(--muted);
            font-size: 13px;
          }
        `}</style>

        <div className="note">
          Tips: sertakan nama hewan, umur, gejala, dan sejak kapan gejala muncul agar dokter bisa membantu lebih cepat.
        </div>

        {loading ? (
          <div className="loading-state">Memuat daftar dokter...</div>
        ) : doctors.length === 0 ? (
          <div className="empty-state">
            Belum ada dokter yang tersedia saat ini.<br />
            Coba lagi nanti atau hubungi klinik langsung.
          </div>
        ) : (
          doctors.map((doc) => {
            const waLink = buildWhatsappLink(doc.whatsapp, doc.name);
            return (
              <div key={doc.id} className="doctor-card">
                <div className="doc-ava">{doc.ava}</div>
                <div className="doc-info">
                  <div className="doc-name">{doc.name}</div>
                  <div className="doc-spec">{doc.spec}</div>
                  <span className={`doc-status ${doc.status === 'online' ? 'ds-online' : 'ds-busy'}`}>
                    ● {doc.status === 'online' ? 'Online' : 'Sibuk'}
                  </span>
                </div>
                <div className="actions">
                  <a className="wa-btn" href={waLink} target="_blank" rel="noreferrer">
                    <span style={{ fontSize: '16px' }}>WhatsApp</span>
                    <span style={{ opacity: 0.9 }}>Chat</span>
                  </a>
                  <div className="wa-sub">+{doc.whatsapp}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}
