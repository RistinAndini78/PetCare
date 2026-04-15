'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { createClient } from '@/utils/supabase/client';

export default function EditPemilikHalaman() {
  const supabase = createClient();
  const router = useRouter();
  const { id } = useParams(); // Mengambil ID dari URL

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('owners')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setFormData(data);
    } catch (err) {
      alert("Data tidak ditemukan");
      router.push('/admin/pemilik');
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('owners')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address
        })
        .eq('id', id);

      if (error) throw error;
      alert("Profil berhasil diperbarui!");
      router.push('/admin/pemilik');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading">Memuat data...</div>;

  return (
    <div className="admin-body">
      <AdminSidebar active="pemilik" />
      <main className="main-content">
        <div className="top-nav">
           <Link href="/admin/pemilik" className="back">← Kembali</Link>
           <h2>Edit Profil: {formData.full_name}</h2>
        </div>
        
        <form className="edit-form-card" onSubmit={handleUpdate}>
           <div className="input-group">
              <label>Nama Lengkap</label>
              <input 
                type="text" 
                value={formData.full_name} 
                onChange={e => setFormData({...formData, full_name: e.target.value})} 
                required 
              />
           </div>
           <div className="input-group">
              <label>WhatsApp (Nomor Aktif)</label>
              <input 
                type="text" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                required 
              />
           </div>
           <div className="input-group">
              <label>Alamat Lengkap</label>
              <textarea 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
              />
           </div>
           <div className="btns">
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
           </div>
        </form>
      </main>

      <style jsx>{`
        .admin-body { display: flex; min-height: 100vh; background: #f8f9fd; }
        .main-content { margin-left: 220px; flex: 1; padding: 40px; }
        .edit-form-card { background: #fff; padding: 30px; border-radius: 20px; max-width: 600px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .input-group { margin-bottom: 20px; }
        label { display: block; font-weight: 800; font-size: 12px; margin-bottom: 8px; color: #666; }
        input, textarea { width: 100%; padding: 12px; border: 1px solid #eef0f7; border-radius: 10px; outline: none; }
        input:focus { border-color: #8e52fc; }
        .save-btn { background: #8e52fc; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; }
        .back { text-decoration: none; color: #8e52fc; font-weight: 700; }
      `}</style>
    </div>
  );
}