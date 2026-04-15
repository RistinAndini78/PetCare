'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserHeader from '@/components/UserHeader';
import BottomNav from '@/components/BottomNav';
import { createClient } from '@/utils/supabase/client';

export default function Beranda() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    fetchUserDataAndPets();
  }, []);

  const fetchUserDataAndPets = async () => {
    setLoading(true);
    try {
      // 1. Ambil session user yang login
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 2. Ambil data pemilik berdasarkan email/id auth
        const { data: owner } = await supabase
          .from('owners')
          .select('*')
          .eq('email', user.email) // atau .eq('id', user.id) tergantung skema kamu
          .single();

        if (owner) {
          setUserData(owner);

          // 3. Ambil daftar hewan peliharaan milik owner ini
          const { data: patients } = await supabase
            .from('patients')
            .select('*')
            .eq('owner_id', owner.id);

          if (patients) {
            // Kita petakan datanya agar sesuai dengan UI
            const mappedPets = patients.map(p => {
              // Logika sederhana untuk status (bisa dikembangkan dengan cek tabel vaccination_schedules)
              return {
                id: p.id,
                name: p.name,
                breed: p.breed || 'Spesies Campuran',
                status: 'Lihat Detail', // Default status
                statusClass: 's-green',
                icon: p.species?.toLowerCase().includes('anjing') ? 'anjing' : 'kucing'
              };
            });
            setPets(mappedPets);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Memuat data...</div>;

  return (
    <div className="app bg-light">
      {/* Header menggunakan nama riil dari database */}
      <UserHeader name={userData?.full_name || 'Pelanggan'} />

      <div className="scroll-content">
        <h2 className="section-title">Hewan Peliharaan</h2>
        
        {pets.length === 0 ? (
          <div style={{ padding: '0 28px', color: '#7a7a7a', fontSize: '14px' }}>
            Belum ada hewan terdaftar.
          </div>
        ) : (
          <div className="pet-list">
            {pets.map((p, i) => (
              <div key={i} className="p-card" onClick={() => router.push(`/rekam-medis/${p.id}`)}>
                <div className={`p-badge ${p.statusClass}`}>{p.status}</div>
                <div className="p-icon-box">
                  {p.icon === 'kucing' ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M12 15s-1.5-1.5-3-1.5m3 1.5s1.5-1.5 3-1.5"/></svg>
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 10a2 2 0 1 1 4 0 2 2 0 1 1-4 0zM12 10a2 2 0 1 1 4 0 2 2 0 1 1-4 0z"/><path d="M12 14v2"/><path d="M10 16a2 2 0 0 0 4 0"/></svg>
                  )}
                </div>
                <div className="p-name">{p.name}</div>
                <div className="p-breed">{p.breed}</div>
              </div>
            ))}
          </div>
        )}

        <h2 className="section-title">Menu Cepat</h2>
        <div className="quick-grid">
          <div className="q-item" onClick={() => router.push('/layanan')}>
            <div className="q-icon-sq" style={{ background: '#f4eeff', color: '#8e52fc' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="q-label">Layanan Kami</div>
          </div>
          <div className="q-item" onClick={() => router.push('/konsultasi')}>
            <div className="q-icon-sq" style={{ background: '#fbeeff', color: '#d463f2' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div className="q-label">Konsultasi</div>
          </div>
        </div>
      </div>

      <BottomNav />

      <style jsx>{`
        /* Style tetap sama seperti sebelumnya */
        .bg-light { background: #fdfbff; min-height: 100vh; }
        .scroll-content { padding: 32px 0 100px; }
        .section-title { font-size: 16px; font-weight: 900; color: #1a1a1a; padding: 0 28px; margin-bottom: 20px; }
        .pet-list { display: flex; gap: 20px; overflow-x: auto; padding: 10px 28px 30px; scrollbar-width: none; }
        .pet-list::-webkit-scrollbar { display: none; }
        .p-card { flex-shrink: 0; width: 150px; background: #fff; border-radius: 28px; padding: 24px 16px; text-align: center; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); position: relative; transition: all 0.3s; cursor: pointer; }
        .p-icon-box { width: 72px; height: 72px; border-radius: 24px; background: #f4eeff; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #8e52fc; }
        .p-name { font-size: 17px; font-weight: 800; color: #1a1a1a; }
        .p-breed { font-size: 12px; color: #7a7a7a; font-weight: 600; margin-top: 2px; }
        .p-badge { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); padding: 5px 12px; border-radius: 12px; font-size: 10px; font-weight: 900; color: #fff; white-space: nowrap; box-shadow: 0 6px 16px rgba(0,0,0,0.1); }
        .s-green { background: #2ed573; }
        .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 0 28px; }
        .q-item { background: #fff; padding: 24px 20px; border-radius: 28px; border: 1.5px solid #f0f0f0; display: flex; flex-direction: column; gap: 12px; cursor: pointer; }
        .q-icon-sq { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .q-label { font-size: 14px; font-weight: 800; color: #1a1a1a; }
      `}</style>
    </div>
  );
}