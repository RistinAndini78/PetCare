'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import Link from 'next/link';

const vaccineTypes = [
  'Rabies', 'Parvovirus', 'Distemper', 'Bordetella', 'Leptospira',
  'FVRCP', 'Feligen CRP', 'Nobivac', 'Vanguard Plus 5', 'Lainnya'
];

const animalTypes = ['Anjing', 'Kucing', 'Anjing & Kucing', 'Kelinci', 'Burung', 'Semua Hewan'];

const S: Record<string, React.CSSProperties> = {
  body: { display: 'flex', minHeight: '100vh', background: '#fdfbff' },
  main: { marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column' },
  content: { padding: '32px' },
  backRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' },
  backBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '12px', background: '#fff', border: '1.5px solid #e8d9ff', color: '#8e52fc', textDecoration: 'none', flexShrink: 0 },
  pageTitle: { fontSize: '22px', fontWeight: 900, color: '#1a1a1a' },
  pageSub: { fontSize: '13px', color: '#a19db5', marginTop: '2px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start' },
  card: { background: '#fff', borderRadius: '24px', border: '1.5px solid #f0f0f0', boxShadow: '0 8px 28px rgba(142,82,252,0.05)', overflow: 'hidden' },
  cardHead: { padding: '22px 28px', borderBottom: '1.5px solid #f7f3ff', display: 'flex', alignItems: 'center', gap: '12px' },
  cardIcon: { width: '38px', height: '38px', borderRadius: '11px', background: '#f4eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8e52fc' },
  cardTitle: { fontSize: '15px', fontWeight: 800, color: '#1a1a1a' },
  cardBody: { padding: '28px' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 800, color: '#444', marginBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '0.4px' },
  input: { width: '100%', padding: '13px 16px', background: '#f9f7ff', border: '1.5px solid #ece4ff', borderRadius: '13px', fontSize: '14px', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' },
  select: { width: '100%', padding: '13px 16px', background: '#f9f7ff', border: '1.5px solid #ece4ff', borderRadius: '13px', fontSize: '14px', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', appearance: 'none' as const },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  divider: { height: '1px', background: '#f7f3ff', margin: '20px -28px', width: 'calc(100% + 56px)' },
  submitBtn: { width: '100%', padding: '15px', background: 'linear-gradient(135deg, #8e52fc, #d463f2)', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 6px 20px rgba(142,82,252,0.25)', letterSpacing: '0.3px' },
  cancelBtn: { width: '100%', padding: '15px', background: '#fff', color: '#8a80a0', border: '1.5px solid #ece4ff', borderRadius: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginTop: '12px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f7f3ff' },
  summaryLabel: { fontSize: '13px', color: '#8a80a0', fontWeight: 600 },
  summaryValue: { fontSize: '14px', color: '#1a1a1a', fontWeight: 800 },
  alertBox: { background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '14px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start' },
  alertText: { fontSize: '13px', color: '#92400e', fontWeight: 600, lineHeight: 1.5 },
};

export default function TambahStokVaksin() {
  const router = useRouter();
  const [form, setForm] = useState({
    namaVaksin: '',
    tipeVaksin: '',
    jumlah: '',
    satuan: 'Dosis',
    harga: '',
    kadaluarsa: '',
    pemasok: '',
    noBatch: '',
    forHewan: '',
    stokMinimal: '',
    catatan: '',
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.namaVaksin || !form.jumlah || !form.kadaluarsa) {
      alert('Mohon isi Nama Vaksin, Jumlah Stok, dan Tanggal Kadaluarsa!');
      return;
    }
    alert(`Stok ${form.namaVaksin} (${form.jumlah} ${form.satuan}) berhasil ditambahkan!`);
    router.push('/admin/vaksin');
  };

  return (
    <div style={S.body}>
      <AdminSidebar active="vaksin" />
      <main style={S.main}>
        <AdminTopbar title="Tambah Stok Vaksin" subtitle="Daftarkan produk vaksin atau obat baru" />

        <div style={S.content}>
          {/* Back */}
          <div style={S.backRow}>
            <Link href="/admin/vaksin" style={S.backBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </Link>
            <div>
              <div style={S.pageTitle}>Tambah Stok Baru</div>
              <div style={S.pageSub}>Lengkapi form di bawah untuk mendaftarkan produk baru</div>
            </div>
          </div>

          <div style={S.grid}>
            {/* Form utama */}
            <div style={S.card}>
              <div style={S.cardHead}>
                <div style={S.cardIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div style={S.cardTitle}>Informasi Produk</div>
              </div>
              <div style={S.cardBody}>
                <div style={S.alertBox}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  <div style={S.alertText}>Pastikan data sesuai dengan label produk vaksin. Kesalahan data dapat mempengaruhi jadwal vaksinasi hewan.</div>
                </div>

                <div style={S.formGroup}>
                  <label style={S.label}>Nama Vaksin / Obat *</label>
                  <select style={S.select} value={form.namaVaksin} onChange={e => set('namaVaksin', e.target.value)}>
                    <option value="">Pilih jenis vaksin...</option>
                    {vaccineTypes.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div style={S.formGroup}>
                  <label style={S.label}>Untuk Hewan</label>
                  <select style={S.select} value={form.forHewan} onChange={e => set('forHewan', e.target.value)}>
                    <option value="">Pilih jenis hewan...</option>
                    {animalTypes.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div style={{ ...S.formGroup, ...S.row2 }}>
                  <div>
                    <label style={S.label}>Jumlah Stok *</label>
                    <input style={S.input} type="number" placeholder="cth: 50" value={form.jumlah} onChange={e => set('jumlah', e.target.value)} min="1" />
                  </div>
                  <div>
                    <label style={S.label}>Satuan</label>
                    <select style={S.select} value={form.satuan} onChange={e => set('satuan', e.target.value)}>
                      <option>Dosis</option>
                      <option>Botol</option>
                      <option>Vial</option>
                      <option>Ampul</option>
                    </select>
                  </div>
                </div>

                <div style={{ ...S.formGroup, ...S.row2 }}>
                  <div>
                    <label style={S.label}>Stok Minimal</label>
                    <input style={S.input} type="number" placeholder="cth: 10" value={form.stokMinimal} onChange={e => set('stokMinimal', e.target.value)} min="1" />
                  </div>
                  <div>
                    <label style={S.label}>Harga Satuan (Rp)</label>
                    <input style={S.input} type="number" placeholder="cth: 150000" value={form.harga} onChange={e => set('harga', e.target.value)} />
                  </div>
                </div>

                <div style={S.divider} />

                <div style={{ ...S.formGroup, ...S.row2 }}>
                  <div>
                    <label style={S.label}>No. Batch</label>
                    <input style={S.input} type="text" placeholder="cth: BT-2024-001" value={form.noBatch} onChange={e => set('noBatch', e.target.value)} />
                  </div>
                  <div>
                    <label style={S.label}>Tanggal Kadaluarsa *</label>
                    <input style={S.input} type="date" value={form.kadaluarsa} onChange={e => set('kadaluarsa', e.target.value)} />
                  </div>
                </div>

                <div style={S.formGroup}>
                  <label style={S.label}>Nama Pemasok / Distributor</label>
                  <input style={S.input} type="text" placeholder="cth: PT. Medion Indonesia" value={form.pemasok} onChange={e => set('pemasok', e.target.value)} />
                </div>

                <div style={S.formGroup}>
                  <label style={S.label}>Catatan Tambahan</label>
                  <textarea style={{ ...S.input, minHeight: '90px', resize: 'vertical' as const }} placeholder="Catatan penyimpanan, kondisi khusus, dsb..." value={form.catatan} onChange={e => set('catatan', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Summary & Submit */}
            <div>
              <div style={{ ...S.card, marginBottom: '16px' }}>
                <div style={S.cardHead}>
                  <div style={{ ...S.cardIcon, background: '#f0fff4' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2ed573" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  </div>
                  <div style={S.cardTitle}>Ringkasan Input</div>
                </div>
                <div style={S.cardBody}>
                  <div style={S.summaryRow}>
                    <span style={S.summaryLabel}>Produk</span>
                    <span style={S.summaryValue}>{form.namaVaksin || '—'}</span>
                  </div>
                  <div style={S.summaryRow}>
                    <span style={S.summaryLabel}>Jumlah</span>
                    <span style={S.summaryValue}>{form.jumlah ? `${form.jumlah} ${form.satuan}` : '—'}</span>
                  </div>
                  <div style={S.summaryRow}>
                    <span style={S.summaryLabel}>Kadaluarsa</span>
                    <span style={S.summaryValue}>{form.kadaluarsa || '—'}</span>
                  </div>
                  <div style={S.summaryRow}>
                    <span style={S.summaryLabel}>Harga/Satuan</span>
                    <span style={S.summaryValue}>{form.harga ? `Rp ${Number(form.harga).toLocaleString('id-ID')}` : '—'}</span>
                  </div>
                  <div style={{ ...S.summaryRow, borderBottom: 'none' }}>
                    <span style={S.summaryLabel}>Pemasok</span>
                    <span style={{ ...S.summaryValue, fontSize: '12px', maxWidth: '150px', textAlign: 'right' as const }}>{form.pemasok || '—'}</span>
                  </div>
                </div>
              </div>

              <button style={S.submitBtn} onClick={handleSubmit}>
                Simpan Stok Vaksin
              </button>
              <button style={S.cancelBtn} onClick={() => router.push('/admin/vaksin')}>
                Batal
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
