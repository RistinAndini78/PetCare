'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function StokVaksin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<any>(null);

  const supabase = createClient();

  // 1. Inisialisasi Data & Realtime Subscription
  useEffect(() => {
    fetchInventory();

    // MENGAKTIFKAN REALTIME:
    // Pastikan "Enable Realtime" sudah dicentang pada tabel 'vaksin' di Dashboard Supabase
    const channel = supabase
      .channel('perubahan-stok-vaksin')
      .on(
        'postgres_changes',
        {
          event: '*', // Menangkap Insert, Update, dan Delete
          schema: 'public',
          table: 'vaksin'
        },
        (payload) => {
          console.log('Perubahan terdeteksi:', payload);
          fetchInventory(); // Refresh data otomatis tanpa reload halaman
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. Fungsi Ambil Data dari Database
  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('vaksin')
        .select('*')
        .order('nama_produk', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedData = data.map((item) => {
          // Logika Penentuan Status
          let statusLabel = 'Aman';
          if (item.stok_sekarang <= 0) statusLabel = 'Habis';
          else if (item.stok_sekarang <= item.stok_minimal) statusLabel = 'Kritis';
          else if (item.stok_sekarang <= item.stok_minimal + 5) statusLabel = 'Menipis';

          return {
            id: item.id,
            name: item.nama_produk || 'Tanpa Nama',
            for: item.kategori_hewan || 'Semua Hewan',
            cur: item.stok_sekarang || 0,
            min: item.stok_minimal || 0,
            status: statusLabel,
            harga: `Rp ${(item.harga || 0).toLocaleString('id-ID')}`,
            kadaluarsa: item.tanggal_kadaluarsa 
              ? new Date(item.tanggal_kadaluarsa).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
              : 'N/A'
          };
        });
        setInventory(formattedData);
      }
    } catch (error) {
      console.error('Gagal memuat inventaris:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Perhitungan Statistik Berdasarkan Data Terbaru
  const kritisCount = inventory.filter(i => i.status === 'Kritis' || i.status === 'Habis').length;
  const menipisCount = inventory.filter(i => i.status === 'Menipis').length;
  const amanCount = inventory.filter(i => i.status === 'Aman').length;

  const stats = [
    { label: 'TOTAL ITEM', value: inventory.length, border: '#8e52fc' },
    { label: 'STOK AMAN', value: amanCount, border: '#2ed573' },
    { label: 'STOK MENIPIS', value: menipisCount, border: '#ffa502' },
    { label: 'STOK KRITIS', value: kritisCount, border: '#ff4757' },
  ];

  const filteredInventory = inventory.filter(inv =>
    inv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-body">
      <AdminSidebar active="vaksin" />
      <main className="main-content">
        <AdminTopbar title="Stok Vaksin" subtitle="Inventaris & monitor ketersediaan" onSearch={setSearchQuery} />

        <div className="scroll-area">
          {/* Banner Peringatan jika ada stok kritis */}
          {kritisCount > 0 && (
            <div className="warning-banner">
              <div className="wb-left">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                <div>
                  <div className="wb-title">{kritisCount} Produk Butuh Perhatian!</div>
                  <div className="wb-desc">Segera lakukan pengadaan stok untuk item berstatus Kritis atau Habis.</div>
                </div>
              </div>
              <button className="po-btn">Cetak Laporan Stok</button>
            </div>
          )}

          {/* Kartu Statistik */}
          <div className="metrics-grid">
            {stats.map((s, i) => (
              <div key={i} className="m-card" style={{ borderTop: `4px solid ${s.border}` }}>
                <span className="m-label">{s.label}</span>
                <div className="m-val">{isLoading ? '...' : s.value}</div>
              </div>
            ))}
          </div>

          <div className="data-card">
            <div className="card-top-flex">
              <h2 className="title-text">Manajemen Inventaris<br />Vaksin</h2>
              <Link href="/admin/vaksin/tambah" className="add-btn-huge">
                + Tambah Stok Baru
              </Link>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>PRODUK</th>
                    <th>KETERSEDIAAN (PROGRESS)</th>
                    <th>STATUS</th>
                    <th>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={4} className="loading-row">Menyinkronkan dengan database...</td></tr>
                  ) : filteredInventory.length === 0 ? (
                    <tr><td colSpan={4} className="loading-row">Tidak ada data produk ditemukan.</td></tr>
                  ) : filteredInventory.map((inv) => {
                    // Logic progress bar: penuh jika stok > (minimal * 2)
                    const pct = Math.min(100, (inv.cur / (inv.min === 0 ? 10 : inv.min * 2)) * 100);
                    const color = inv.status === 'Kritis' || inv.status === 'Habis' ? '#ff4757' : 
                                  inv.status === 'Menipis' ? '#ffa502' : '#2ed573';

                    return (
                      <tr key={inv.id}>
                        <td>
                          <div className="p-name">{inv.name}</div>
                          <div className="p-sub">{inv.for}</div>
                        </td>
                        <td>
                          <div className="p-bar-bg">
                            <div className="p-bar-fill" style={{ width: `${pct}%`, background: color }}></div>
                          </div>
                          <div className="p-stat" style={{ color }}>{inv.cur} Dosis Tersisa (Min: {inv.min})</div>
                        </td>
                        <td>
                          <span className={`badge ${inv.status === 'Kritis' || inv.status === 'Habis' ? 's-red' : inv.status === 'Menipis' ? 's-orange' : 's-green'}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td>
                          <button className="act-btn outline" onClick={() => setModal(inv)}>Lihat Detail</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DETAIL */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">💉</div>
              <div>
                <div className="modal-title">{modal.name}</div>
                <div className="modal-subtitle">Kategori: {modal.for}</div>
              </div>
            </div>
            <div className="modal-body">
              {[
                { label: 'Stok Gudang', value: `${modal.cur} Dosis` },
                { label: 'Ambang Batas (Min)', value: `${modal.min} Dosis` },
                { label: 'Estimasi Harga', value: modal.harga },
                { label: 'Status Inventaris', value: modal.status },
                { label: 'Masa Kadaluarsa', value: modal.kadaluarsa },
              ].map((row) => (
                <div key={row.label} className="modal-row">
                  <span className="row-label">{row.label}</span>
                  <span className="row-val">{row.value}</span>
                </div>
              ))}
            </div>
            <button className="modal-close" onClick={() => setModal(null)}>Tutup Detail</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; font-family: 'Inter', sans-serif; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 32px; }

        .warning-banner { background: #ff4757; border-radius: 20px; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; color: #fff; margin-bottom: 24px; }
        .wb-left { display: flex; align-items: center; gap: 16px; }
        .wb-title { font-size: 16px; font-weight: 800; }
        .wb-desc { font-size: 13px; opacity: 0.9; }
        .po-btn { background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.4); padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; }

        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
        .m-card { background: #fff; padding: 24px; border-radius: 16px; border: 1.5px solid #f0f0f0; }
        .m-label { font-size: 11px; font-weight: 800; color: #a19db5; display: block; margin-bottom: 8px; }
        .m-val { font-size: 32px; font-weight: 900; color: #1a1a1a; }

        .data-card { background: #fff; border-radius: 28px; border: 1.5px solid #f0f0f0; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.05); overflow: hidden; }
        .card-top-flex { padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #f0f0f0; }
        .title-text { font-size: 16px; font-weight: 800; line-height: 1.4; }
        .add-btn-huge { background: #8e52fc; color: #fff; padding: 12px 24px; border-radius: 14px; text-decoration: none; font-size: 14px; font-weight: 800; transition: 0.2s; }
        .add-btn-huge:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(142, 82, 252, 0.3); }

        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 16px 32px; text-align: left; font-size: 11px; font-weight: 800; color: #a19db5; background: #fdfbff; border-bottom: 1.5px solid #f0f0f0; }
        tbody td { padding: 20px 32px; border-bottom: 1px solid #f9f7ff; vertical-align: middle; }

        .p-name { font-weight: 800; font-size: 14px; color: #1a1a1a; }
        .p-sub { font-size: 12px; color: #a19db5; margin-top: 2px; }
        .p-bar-bg { width: 160px; height: 6px; background: #f0f0f0; border-radius: 10px; overflow: hidden; margin-bottom: 6px; }
        .p-bar-fill { height: 100%; border-radius: 10px; transition: width 0.5s ease; }
        .p-stat { font-size: 11px; font-weight: 700; }

        .badge { padding: 6px 12px; border-radius: 10px; font-size: 10px; font-weight: 800; }
        .s-red { background: #fff1f2; color: #ff4757; }
        .s-orange { background: #fff7ed; color: #ffa502; }
        .s-green { background: #f0fdf4; color: #2ed573; }

        .act-btn.outline { background: #fff; border: 1.5px solid #ece4ff; padding: 8px 16px; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer; transition: 0.2s; }
        .act-btn.outline:hover { border-color: #8e52fc; color: #8e52fc; }
        .loading-row { text-align: center; padding: 50px; color: #a19db5; font-style: italic; }

        /* Modal Styles */
        .modal-overlay { position: fixed; inset: 0; background: rgba(12, 7, 27, 0.4); z-index: 999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .modal-content { background: #fff; border-radius: 28px; padding: 32px; width: 100%; maxWidth: 400px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        .modal-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .modal-icon { width: 50px; height: 50px; background: #f4eeff; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .modal-title { font-size: 18px; font-weight: 900; }
        .modal-subtitle { font-size: 13px; color: #a19db5; }
        .modal-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f8f9fd; }
        .row-label { font-size: 13px; color: #666; font-weight: 600; }
        .row-val { font-size: 14px; font-weight: 800; color: #1a1a1a; }
        .modal-close { width: 100%; margin-top: 24px; padding: 14px; background: #1a1a1a; color: #fff; border: none; border-radius: 14px; font-weight: 800; cursor: pointer; }
      `}</style>
    </div>
  );
}