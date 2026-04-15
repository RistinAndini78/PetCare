'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { createClient } from '@/utils/supabase/client';

export default function DetailPemilik() {
  const params = useParams(); // Mengambil ID pemilik dari URL
  const router = useRouter();
  const supabase = createClient();
  
  const [owner, setOwner] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      try {
        setLoading(true);
        // Tarik data pemilik beserta SEMUA data pasien (hewan) miliknya
        const { data, error } = await supabase
          .from('owners')
          .select('*, patients(*)')
          .eq('id', params.id)
          .single(); // Ambil 1 pemilik spesifik

        if (error) throw error;
        
        setOwner(data);
        // Data relasi hewan otomatis masuk ke dalam array 'patients'
        setPets(data.patients || []); 
      } catch (err) {
        console.error("Gagal mengambil detail pemilik:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchOwnerDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="admin-body">
        <AdminSidebar active="pemilik" />
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner"></div>
        </main>
        <style jsx global>{`.spinner { width: 40px; height: 40px; border: 4px solid #f4eeff; border-top-color: #8e52fc; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } } .admin-body { display: flex; min-height: 100vh; background: #fdfbff; } .main-content { margin-left: 220px; flex: 1; }`}</style>
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="admin-body">
        <AdminSidebar active="pemilik" />
        <main className="main-content" style={{ padding: '40px' }}>
          <h2>Data Pemilik Tidak Ditemukan</h2>
          <button onClick={() => router.back()} className="back-btn-simple">Kembali</button>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-body">
      <AdminSidebar active="pemilik" />
      <main className="main-content">
        <div className="topbar">
          <button onClick={() => router.back()} className="back-btn" title="Kembali">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div className="t-right">
            <div className="t-title">Profil Pemilik</div>
            <div className="t-sub">ID: {owner.id.substring(0, 8).toUpperCase()}</div>
          </div>
        </div>

        <div className="scroll-area">
          <div className="profile-layout">
            {/* KOLOM KIRI: INFO PEMILIK */}
            <div className="owner-card">
              <div className="o-header">
                <div className="o-avatar">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <h2 className="o-name">{owner.full_name}</h2>
                  <span className="badge s-purple">Member Terdaftar</span>
                </div>
              </div>

              <div className="o-body">
                <div className="info-item">
                  <span className="i-label">No. WhatsApp</span>
                  <span className="i-val">{owner.phone || 'Belum diisi'}</span>
                </div>
                <div className="info-item">
                  <span className="i-label">Email</span>
                  <span className="i-val">{owner.email || 'Belum diisi'}</span>
                </div>
                <div className="info-item">
                  <span className="i-label">Alamat Lengkap</span>
                  <span className="i-val" style={{ lineHeight: '1.5' }}>{owner.address || 'Belum diisi'}</span>
                </div>
                <div className="info-item">
                  <span className="i-label">Bergabung Sejak</span>
                  <span className="i-val">{new Date(owner.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="o-footer">
                <button className="btn-edit-owner">Edit Profil</button>
                <a href={`https://wa.me/${owner.phone?.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="btn-wa">
                  Hubungi via WA
                </a>
              </div>
            </div>

            {/* KOLOM KANAN: DAFTAR HEWAN */}
            <div className="pets-section">
              <div className="p-head">
                <h3 className="p-title">Daftar Hewan ({pets.length})</h3>
                <Link href="/admin/pasien/tambah" className="add-pet-btn">+ Tambah Hewan</Link>
              </div>

              {pets.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1cbea" strokeWidth="1.5"><path d="M12 2a3 3 0 0 0-3 3v1a2 2 0 0 1-2 2H5a2 2 0 0 0-2 2v2a2 2 0 0 1-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 1 2 2v1a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-1a2 2 0 0 1 2-2h2a2 2 0 0 0 2-2v-2a2 2 0 0 1 2-2v-2a2 2 0 0 0-2-2h-2a2 2 0 0 1-2-2V5a3 3 0 0 0-3-3h-2z"/></svg>
                  <p>Pemilik ini belum memiliki data hewan peliharaan.</p>
                </div>
              ) : (
                <div className="pets-grid">
                  {pets.map(pet => (
                    <div key={pet.id} className="pet-card">
                      <div className="pet-head">
                        <div className="pet-name">{pet.name}</div>
                        <span className={`gender-badge ${pet.gender === 'Jantan' ? 'g-male' : 'g-female'}`}>
                          {pet.gender}
                        </span>
                      </div>
                      <div className="pet-info">
                        <div className="p-row"><span>Spesies:</span> {pet.species}</div>
                        <div className="p-row"><span>Ras:</span> {pet.breed || '-'}</div>
                        <div className="p-row"><span>Warna:</span> {pet.color_marks || '-'}</div>
                      </div>
                      <Link href={`/admin/pasien/${pet.id}`} className="pet-link-btn">
                        Lihat Rekam Medis →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 32px; }

        .topbar { padding: 24px 32px 0; display: flex; align-items: flex-start; gap: 20px; }
        .back-btn { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: #fff; border: 1.5px solid #ece4ff; color: #1a1a1a; cursor: pointer; border-radius: 14px; transition: all 0.2s; }
        .back-btn:hover { border-color: #8e52fc; color: #8e52fc; box-shadow: 0 4px 12px rgba(142, 82, 252, 0.1); }
        
        .t-title { font-size: 22px; font-weight: 900; color: #1a1a1a; letter-spacing: -0.5px; }
        .t-sub { font-size: 13px; color: #a19db5; font-weight: 600; margin-top: 4px; }

        .profile-layout { display: flex; gap: 32px; margin-top: 24px; align-items: flex-start; }
        
        /* Kolom Kiri: Profil Pemilik */
        .owner-card { width: 380px; background: #fff; border-radius: 28px; border: 1.5px solid #ece4ff; overflow: hidden; box-shadow: 0 10px 30px rgba(142,82,252,0.04); flex-shrink: 0; }
        .o-header { padding: 32px; background: linear-gradient(180deg, #f9f7ff 0%, #fff 100%); border-bottom: 1px solid #f9f7ff; display: flex; gap: 20px; align-items: center; }
        .o-avatar { width: 64px; height: 64px; background: #8e52fc; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 8px 20px rgba(142,82,252,0.25); }
        .o-name { font-size: 20px; font-weight: 900; color: #1a1a1a; margin-bottom: 6px; }
        .badge { padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; }
        .s-purple { background: #f4eeff; color: #8e52fc; }

        .o-body { padding: 32px; display: flex; flex-direction: column; gap: 24px; }
        .info-item { display: flex; flex-direction: column; gap: 6px; }
        .i-label { font-size: 11.5px; font-weight: 800; color: #a19db5; text-transform: uppercase; letter-spacing: 0.5px; }
        .i-val { font-size: 14.5px; font-weight: 600; color: #1a1a1a; }

        .o-footer { padding: 24px 32px; border-top: 1px solid #f9f7ff; display: flex; gap: 12px; background: #fdfbff; }
        .btn-edit-owner { flex: 1; padding: 12px; background: #fff; border: 1.5px solid #ece4ff; border-radius: 12px; font-weight: 800; color: #1a1a1a; cursor: pointer; transition: all 0.2s; }
        .btn-edit-owner:hover { border-color: #8e52fc; color: #8e52fc; }
        .btn-wa { flex: 1; padding: 12px; background: #2ed573; color: #fff; border: none; border-radius: 12px; font-weight: 800; text-align: center; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-wa:hover { background: #26af5f; box-shadow: 0 6px 16px rgba(46, 213, 115, 0.3); }

        /* Kolom Kanan: Daftar Hewan */
        .pets-section { flex: 1; }
        .p-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; background: #fff; padding: 20px 24px; border-radius: 20px; border: 1.5px solid #f0f0f0; }
        .p-title { font-size: 16px; font-weight: 800; color: #1a1a1a; }
        .add-pet-btn { background: #f4eeff; color: #8e52fc; padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 800; text-decoration: none; transition: all 0.2s; }
        .add-pet-btn:hover { background: #8e52fc; color: #fff; }

        .empty-state { background: #fff; border-radius: 24px; border: 2px dashed #ece4ff; padding: 60px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .empty-state p { color: #a19db5; font-weight: 600; font-size: 14.5px; }

        .pets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .pet-card { background: #fff; border-radius: 20px; border: 1.5px solid #ece4ff; padding: 24px; transition: all 0.25s; display: flex; flex-direction: column; }
        .pet-card:hover { border-color: #8e52fc; transform: translateY(-4px); box-shadow: 0 12px 30px rgba(142,82,252,0.1); }
        
        .pet-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .pet-name { font-size: 18px; font-weight: 900; color: #1a1a1a; }
        .gender-badge { padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; }
        .g-male { background: #e3f2fd; color: #2980b9; }
        .g-female { background: #ffeaa7; color: #d35400; }

        .pet-info { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; flex: 1; }
        .p-row { font-size: 13.5px; color: #1a1a1a; font-weight: 600; }
        .p-row span { color: #a19db5; display: inline-block; width: 70px; }

        .pet-link-btn { width: 100%; padding: 12px; background: #fdfbff; border: 1.5px solid #ece4ff; border-radius: 12px; color: #8e52fc; text-align: center; font-weight: 800; font-size: 13px; text-decoration: none; transition: all 0.2s; }
        .pet-card:hover .pet-link-btn { background: #8e52fc; color: #fff; border-color: #8e52fc; }
      `}</style>
    </div>
  );
}