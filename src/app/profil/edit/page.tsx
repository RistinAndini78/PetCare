'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function EditProfil() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const stored = localStorage.getItem('petcare_owner');
        const session = stored ? JSON.parse(stored) : null;
        if (!session?.id) return router.push('/login/user');

        const { data, error } = await supabase
          .from('owners')
          .select('full_name, email, address')
          .eq('id', session.id)
          .single();

        if (error) throw error;

        setFormData({
          name: data.full_name || '',
          email: data.email || '',
          address: data.address || ''
        });
      } catch (e) {
        console.error("Gagal memuat profil:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const stored = localStorage.getItem('petcare_owner');
    const session = JSON.parse(stored || '{}');

    try {
      const { error } = await supabase
        .from('owners')
        .update({
          full_name: formData.name,
          email: formData.email,
          address: formData.address
        })
        .eq('id', session.id);

      if (error) throw error;
      alert('Profil berhasil diperbarui!');
      router.push('/profil');
    } catch (e) {
      alert('Gagal memperbarui profil.');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Memuat data...</div>;

  return (
    <div className="page-container">
      <header className="header">
        <button onClick={() => router.back()} className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 className="header-title">Edit Profil</h1>
      </header>

      <main className="content">
        <div className="form-stack">
          <div className="field">
            <label>Nama Lengkap</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div className="field">
            <label>No. WhatsApp</label>
            <input type="text" className="input-field disabled" value="Nomor tersembunyi" disabled />
          </div>

          <div className="field">
            <label>Alamat Utama</label>
            <textarea 
              className="input-field textarea" 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              rows={3}
            ></textarea>
          </div>

          <button className="submit-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </main>

      <style jsx>{`
        .page-container { min-height: 100vh; background: #fcfcfd; }
        .header { padding: 40px 20px 20px; display: flex; align-items: center; gap: 16px; }
        .back-btn { width: 44px; height: 44px; border-radius: 14px; background: #fff; border: 1px solid #eee; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #666; }
        .header-title { font-size: 20px; font-weight: 800; color: #1a1a1a; }
        .content { padding: 20px; max-width: 520px; margin: 0 auto; }
        .form-stack { display: flex; flex-direction: column; gap: 24px; }
        .field label { display: block; font-size: 12px; font-weight: 800; color: #4b5563; margin-bottom: 8px; text-transform: uppercase; }
        .input-field { width: 100%; padding: 16px; background: #fff; border: 1.5px solid #f0f0f0; border-radius: 16px; font-size: 15px; font-weight: 600; color: #1a1a1a; }
        .input-field:focus { border-color: #8e52fc; outline: none; box-shadow: 0 0 0 4px rgba(142, 82, 252, 0.1); }
        .input-field.disabled { background: #f9f9fb; color: #9ca3af; cursor: not-allowed; }
        .submit-btn { width: 100%; padding: 18px; background: #8e52fc; color: #fff; border-radius: 16px; font-weight: 800; border: none; cursor: pointer; transition: 0.3s; }
        .loading { display: flex; justify-content: center; align-items: center; min-height: 100vh; font-weight: 700; color: #8e52fc; }
      `}</style>
    </div>
  );
}