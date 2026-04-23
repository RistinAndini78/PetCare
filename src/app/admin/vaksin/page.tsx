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

  useEffect(() => {
    fetchInventory();

    /**
     * REALTIME SUBSCRIPTION
     * Pastikan "Enable Realtime" dicentang pada tabel 'vaksin'
     * di Dashboard Supabase → Table Editor → Replication.
     */
    const channel = supabase
      .channel('stok-vaksin-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vaksin' },
        () => {
          fetchInventory(); // Auto-refresh saat stok berubah (misalnya setelah entri vaksin)
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  /**
   * FUNGSI AMBIL INVENTARIS
   * Data mentah dari tabel 'vaksin', diproses menjadi status visual.
   *
   * Status dihitung:
   *   - Habis  : stok_sekarang <= 0
   *   - Kritis : stok_sekarang <= stok_minimal
   *   - Menipis: stok_sekarang <= stok_minimal + 5
   *   - Aman   : stok_sekarang > stok_minimal + 5
   */
  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('vaksin')
        .select('*')
        .order('nama_produk', { ascending: true });

      if (error) throw error;

      const formatted = (data || []).map((item) => {
        let status = 'Aman';
        if (item.stok_sekarang <= 0) status = 'Habis';
        else if (item.stok_sekarang <= item.stok_minimal) status = 'Kritis';
        else if (item.stok_sekarang <= (item.stok_minimal || 0) + 5) status = 'Menipis';

        return {
          id: item.id,
          name: item.nama_produk || 'Tanpa Nama',
          category: item.kategori_hewan || 'Semua Hewan',
          stokSekarang: item.stok_sekarang ?? 0,
          stokMinimal: item.stok_minimal ?? 0,
          status,
          harga: item.harga
            ? `Rp ${Number(item.harga).toLocaleString('id-ID')}`
            : 'Belum diisi',
          kadaluarsa: item.tanggal_kadaluarsa
            ? new Date(item.tanggal_kadaluarsa).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric',
              })
            : 'Tidak diketahui',
          // Progress bar: 100% = dua kali lipat stok minimal (atau 20 jika minimal = 0)
          progressPct: Math.min(
            100,
            Math.round((item.stok_sekarang / Math.max(item.stok_minimal * 2, 20)) * 100)
          ),
        };
      });

      setInventory(formatted);
    } catch (err) {
      console.error('Gagal memuat inventaris vaksin:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Statistik ringkasan
  const kritisCount  = inventory.filter(i => i.status === 'Kritis' || i.status === 'Habis').length;
  const menipisCount = inventory.filter(i => i.status === 'Menipis').length;
  const amanCount    = inventory.filter(i => i.status === 'Aman').length;

  const stats = [
    { label: 'TOTAL ITEM',    value: inventory.length, border: '#8e52fc' },
    { label: 'STOK AMAN',     value: amanCount,         border: '#2ed573' },
    { label: 'STOK MENIPIS',  value: menipisCount,      border: '#ffa502' },
    { label: 'STOK KRITIS',   value: kritisCount,        border: '#ff4757' },
  ];

  const statusColor = (status: string) => {
    if (status === 'Kritis' || status === 'Habis') return '#ff4757';
    if (status === 'Menipis') return '#ffa502';
    return '#2ed573';
  };

  const statusClass = (status: string) => {
    if (status === 'Kritis' || status === 'Habis') return 's-red';
    if (status === 'Menipis') return 's-orange';
    return 's-green';
  };

  const filteredInventory = inventory.filter(inv =>
    inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-body">
      <AdminSidebar active="vaksin" />
      <main className="main-content">
        <AdminTopbar
          title="Stok Vaksin"
          subtitle="Inventaris & monitor ketersediaan"
          onSearch={setSearchQuery}
        />

        <div className="scroll-area">

          {/* Banner Peringatan Stok Kritis */}
          {!isLoading && kritisCount > 0 && (
            <div className="warning-banner">
              <div className="wb-left">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <div className="wb-title">{kritisCount} produk membutuhkan perhatian segera!</div>
                  <div className="wb-desc">Lakukan pengadaan stok untuk item berstatus Kritis atau Habis.</div>
                </div>
              </div>
              <Link href="/admin/vaksin/tambah" className="po-btn">+ Tambah Stok Sekarang</Link>
            </div>
          )}

          {/* Kartu Statistik */}
          <div className="metrics-grid">
            {stats.map((s, i) => (
              <div key={i} className="m-card" style={{ borderTop: `4px solid ${s.border}` }}>
                <span className="m-label">{s.label}</span>
                <div className="m-val">{isLoading ? '—' : s.value}</div>
              </div>
            ))}
          </div>

          {/* Tabel Inventaris */}
          <div className="data-card">
            <div className="card-top-flex">
              <div>
                <h2 className="title-text">Manajemen Inventaris Vaksin</h2>
                <p className="title-sub">
                  Stok berkurang otomatis setiap kali vaksinasi dicatat di Rekam Medis
                </p>
              </div>
              <Link href="/admin/vaksin/tambah" className="add-btn">
                + Tambah Stok Baru
              </Link>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>PRODUK VAKSIN</th>
                    <th>KETERSEDIAAN STOK</th>
                    <th>STATUS</th>
                    <th>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="loading-row">
                        <div className="inline-spinner" /> Menyinkronkan dengan database...
                      </td>
                    </tr>
                  ) : filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="loading-row">
                        {inventory.length === 0
                          ? 'Belum ada produk vaksin. Klik "+ Tambah Stok Baru" untuk memulai.'
                          : 'Produk tidak ditemukan. Coba kata kunci lain.'}
                      </td>
                    </tr>
                  ) : filteredInventory.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <div className="p-name">{inv.name}</div>
                        <div className="p-sub">{inv.category}</div>
                      </td>
                      <td>
                        <div className="bar-wrap">
                          <div
                            className="bar-fill"
                            style={{
                              width: `${inv.progressPct}%`,
                              background: statusColor(inv.status),
                            }}
                          />
                        </div>
                        <div className="bar-stat" style={{ color: statusColor(inv.status) }}>
                          {inv.stokSekarang} dosis tersisa &nbsp;·&nbsp; Min: {inv.stokMinimal}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${statusClass(inv.status)}`}>{inv.status}</span>
                      </td>
                      <td>
                        <button className="act-btn" onClick={() => setModal(inv)}>
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* ==================== MODAL DETAIL ==================== */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-icon">💉</div>
              <div>
                <div className="modal-name">{modal.name}</div>
                <div className="modal-cat">{modal.category}</div>
              </div>
              <button className="modal-x" onClick={() => setModal(null)}>✕</button>
            </div>

            <div className="modal-body">
              {[
                { label: 'Stok Tersedia',        value: `${modal.stokSekarang} dosis` },
                { label: 'Ambang Batas Minimal',  value: `${modal.stokMinimal} dosis` },
                { label: 'Status Inventaris',     value: modal.status },
                { label: 'Estimasi Harga / Dosis', value: modal.harga },
                { label: 'Masa Kadaluarsa',       value: modal.kadaluarsa },
              ].map(row => (
                <div key={row.label} className="modal-row">
                  <span className="row-lbl">{row.label}</span>
                  <span className="row-val"
                    style={row.label === 'Status Inventaris' ? { color: statusColor(modal.status), fontWeight: 900 } : {}}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="modal-foot">
              <button className="modal-close-btn" onClick={() => setModal(null)}>
                Tutup
              </button>
              <Link
                href="/admin/vaksin/tambah"
                className="modal-restock-btn"
                onClick={() => setModal(null)}
              >
                + Restock Vaksin Ini
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; font-family: 'Plus Jakarta Sans', sans-serif; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 32px; }

        /* Banner */
        .warning-banner { background: #ff4757; border-radius: 20px; padding: 22px 28px; display: flex; align-items: center; justify-content: space-between; color: #fff; margin-bottom: 24px; gap: 16px; }
        .wb-left { display: flex; align-items: center; gap: 14px; }
        .wb-title { font-size: 15px; font-weight: 800; }
        .wb-desc { font-size: 12px; opacity: 0.85; margin-top: 2px; }
        .po-btn { background: rgba(255,255,255,0.18); color: #fff; border: 1.5px solid rgba(255,255,255,0.5); padding: 10px 20px; border-radius: 12px; font-weight: 800; font-size: 13px; cursor: pointer; text-decoration: none; white-space: nowrap; transition: 0.2s; }
        .po-btn:hover { background: rgba(255,255,255,0.28); }

        /* Stats */
        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px; }
        .m-card { background: #fff; padding: 22px 24px; border-radius: 18px; border: 1.5px solid #f0f0f0; }
        .m-label { font-size: 11px; font-weight: 800; color: #a19db5; display: block; margin-bottom: 8px; letter-spacing: 0.5px; }
        .m-val { font-size: 32px; font-weight: 900; color: #1a1a1a; }

        /* Tabel card */
        .data-card { background: #fff; border-radius: 28px; border: 1.5px solid #f0f0f0; overflow: hidden; box-shadow: 0 10px 30px rgba(142,82,252,0.04); }
        .card-top-flex { padding: 24px 32px; display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 1.5px solid #f0f0f0; gap: 20px; }
        .title-text { font-size: 16px; font-weight: 800; color: #1a1a1a; margin: 0 0 4px; }
        .title-sub { font-size: 12px; color: #a19db5; margin: 0; }
        .add-btn { background: #8e52fc; color: #fff; padding: 12px 22px; border-radius: 14px; text-decoration: none; font-size: 13px; font-weight: 800; transition: 0.2s; white-space: nowrap; }
        .add-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(142,82,252,0.3); }

        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 14px 28px; text-align: left; font-size: 11px; font-weight: 800; color: #a19db5; background: #fdfbff; border-bottom: 1.5px solid #f0f0f0; letter-spacing: 0.4px; }
        tbody td { padding: 18px 28px; border-bottom: 1px solid #f9f7ff; vertical-align: middle; }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr:hover td { background: #fdf9ff; }

        .p-name { font-weight: 800; font-size: 14px; color: #1a1a1a; }
        .p-sub { font-size: 12px; color: #a19db5; margin-top: 2px; }

        .bar-wrap { width: 180px; height: 6px; background: #f0f0f0; border-radius: 10px; overflow: hidden; margin-bottom: 6px; }
        .bar-fill { height: 100%; border-radius: 10px; transition: width 0.5s ease; }
        .bar-stat { font-size: 11px; font-weight: 700; }

        .badge { padding: 5px 12px; border-radius: 10px; font-size: 10px; font-weight: 900; }
        .s-red    { background: #fff1f2; color: #ff4757; }
        .s-orange { background: #fff7ed; color: #ffa502; }
        .s-green  { background: #f0fdf4; color: #2ed573; }

        .act-btn { background: #fff; border: 1.5px solid #ece4ff; padding: 8px 16px; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer; transition: 0.2s; }
        .act-btn:hover { border-color: #8e52fc; color: #8e52fc; background: #f9f6ff; }

        .loading-row { text-align: center; padding: 50px; color: #a19db5; font-size: 14px; }
        .inline-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid #ece4ff; border-top-color: #8e52fc; border-radius: 50%; animation: spin 0.8s linear infinite; vertical-align: middle; margin-right: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(12,7,27,0.4); z-index: 999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .modal-box { background: #fff; border-radius: 28px; padding: 32px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
        .modal-head { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .modal-icon { width: 52px; height: 52px; background: #f4eeff; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0; }
        .modal-name { font-size: 18px; font-weight: 900; color: #1a1a1a; }
        .modal-cat { font-size: 13px; color: #a19db5; margin-top: 2px; }
        .modal-x { margin-left: auto; background: none; border: none; font-size: 18px; color: #a19db5; cursor: pointer; padding: 4px; }
        .modal-body { border-top: 1px solid #f0f0f8; border-bottom: 1px solid #f0f0f8; padding: 8px 0; margin-bottom: 20px; }
        .modal-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f9f7ff; }
        .modal-row:last-child { border-bottom: none; }
        .row-lbl { font-size: 13px; color: #888; font-weight: 600; }
        .row-val { font-size: 14px; font-weight: 800; color: #1a1a1a; }
        .modal-foot { display: flex; gap: 12px; }
        .modal-close-btn { flex: 1; padding: 13px; background: #f8f9fd; border: 1.5px solid #eef0f7; border-radius: 14px; font-weight: 700; color: #666; cursor: pointer; font-family: inherit; }
        .modal-restock-btn { flex: 1; padding: 13px; background: #8e52fc; border-radius: 14px; font-weight: 800; color: #fff; text-decoration: none; text-align: center; font-size: 14px; }
        .modal-restock-btn:hover { background: #7a42e8; }
      `}</style>
    </div>
  );
}