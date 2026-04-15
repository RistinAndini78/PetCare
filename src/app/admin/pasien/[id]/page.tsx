'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';

export default function DetailPasien() {
  const params = useParams(); // Menangkap ID dari URL (misal: 123)
  const supabase = createClient();
  
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Tarik data pasien beserta data relasi pemiliknya (owners)
        const { data, error } = await supabase
          .from('patients')
          .select('*, owners(*)')
          .eq('id', params.id) // Cari yang ID-nya cocok dengan URL
          .single(); // Ambil 1 data saja

        if (error) throw error;
        setPatient(data);
      } catch (err) {
        console.error("Gagal mengambil detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchDetail();
  }, [params.id]);

  if (loading) return <div style={{ padding: '50px', marginLeft: '220px' }}>Memuat data detail...</div>;
  if (!patient) return <div style={{ padding: '50px', marginLeft: '220px' }}>Data pasien tidak ditemukan.</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fdfbff' }}>
      <AdminSidebar active="pasien" />
      
      <main style={{ marginLeft: '220px', padding: '40px', flex: 1, fontFamily: 'sans-serif' }}>
        <Link href="/admin/pasien" style={{ color: '#8e52fc', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Kembali ke Daftar Pasien
        </Link>
        
        <h1 style={{ marginTop: '20px', color: '#1a1a1a' }}>Detail Rekam Medis</h1>
        
        <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '1.5px solid #f0f0f0', marginTop: '20px', display: 'flex', gap: '40px' }}>
          
          {/* Kolom Informasi Hewan */}
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#8e52fc', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>🐶 Info Hewan</h3>
            <p><strong>Nama:</strong> {patient.name}</p>
            <p><strong>Spesies:</strong> {patient.species}</p>
            <p><strong>Ras:</strong> {patient.breed || 'Tidak ada keterangan'}</p>
            <p><strong>Tanggal Lahir:</strong> {patient.birth_date || 'Tidak diketahui'}</p>
          </div>

          {/* Kolom Informasi Pemilik */}
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#1e90ff', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>👤 Info Pemilik</h3>
            <p><strong>Nama Lengkap:</strong> {patient.owners?.full_name}</p>
            <p><strong>No. WhatsApp:</strong> {patient.owners?.phone || 'Belum diisi'}</p>
            <p><strong>Email:</strong> {patient.owners?.email || 'Belum diisi'}</p>
            <p><strong>Alamat:</strong> {patient.owners?.address || 'Belum diisi'}</p>
          </div>

        </div>
      </main>
    </div>
  );
}