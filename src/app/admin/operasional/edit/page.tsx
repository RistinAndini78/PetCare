'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function EditJamOperasional() {
  const router = useRouter();
  const supabase = createClient();
  const [hours, setHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const { data, error } = await supabase
          .from('clinic_hours')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) throw error;
        setHours(data || []);
      } catch (err) {
        console.error('Error fetching hours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHours();
  }, [supabase]);

  const handleInputChange = (id: number, field: string, value: string) => {
    setHours(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const h of hours) {
        const { error } = await supabase
          .from('clinic_hours')
          .update({
            day_label: h.day_label,
            open_time: h.open_time,
            close_time: h.close_time
          })
          .eq('id', h.id);
        
        if (error) throw error;
      }
      alert('Jadwal berhasil diperbarui!');
      router.push('/admin/operasional');
    } catch (err: any) {
      console.error('Error saving hours:', err.message);
      alert('Gagal menyimpan perubahan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-body">
      <AdminSidebar active="pengaturan" />
      <main className="main-content">
        <AdminTopbar title="Edit Jam Operasional" backUrl="/admin/operasional" />
        
        <div className="scroll-area centered-content">
          <div className="edit-card">
            {loading ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</p>
            ) : (
              <>
                {hours.map((h, index) => (
                  <div key={h.id} className={`day-row ${index === hours.length - 1 ? 'last-row' : ''}`}>
                    <div className="label-container">
                      <input 
                        type="text" 
                        value={h.day_label} 
                        onChange={(e) => handleInputChange(h.id, 'day_label', e.target.value)}
                        className="day-label-input"
                      />
                    </div>
                    <div className="time-inputs">
                      <div className="time-box">
                        <input 
                          type="text" 
                          value={h.open_time} 
                          onChange={(e) => handleInputChange(h.id, 'open_time', e.target.value)}
                        />
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <div className="time-box">
                        <input 
                          type="text" 
                          value={h.close_time} 
                          onChange={(e) => handleInputChange(h.id, 'close_time', e.target.value)}
                        />
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                    </div>
                  </div>
                ))}

                <button 
                  className="save-btn" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .admin-body { display: flex; min-height: 100vh; background: #fdfbff; }
        .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; }
        .scroll-area { padding: 60px 32px; }
        .centered-content { display: flex; justify-content: center; }

        .edit-card { width: 100%; max-width: 720px; background: #fff; border-radius: 32px; border: 1.5px solid #f0f0f0; box-shadow: 0 20px 60px rgba(142, 82, 252, 0.05); padding: 48px; }
        
        .day-row { display: flex; align-items: center; justify-content: space-between; padding: 24px 0; border-bottom: 1.5px dashed #f0f0f0; gap: 20px; }
        .last-row { border-bottom: none; margin-bottom: 24px; }
        
        .label-container { flex: 1; }
        .day-label-input { width: 100%; border: none; font-size: 15px; font-weight: 800; color: #1a1a1a; outline: none; background: transparent; padding: 8px 0; }
        .day-label-input:focus { border-bottom: 1.5px solid #8e52fc; }
        
        .time-inputs { display: flex; gap: 16px; }
        
        .time-box { position: relative; width: 160px; }
        .time-box input { width: 100%; padding: 12px 18px; padding-right: 44px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 14px; font-size: 14px; color: #1a1a1a; outline: none; transition: all 0.2s; font-weight: 600; }
        .time-box input:focus { border-color: #c084fc; background: #fff; }
        .time-box svg { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #a19db5; }

        .save-btn { width: 100%; height: 56px; background: #8e52fc; border-radius: 18px; color: #fff; border: none; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.25s; box-shadow: 0 10px 30px rgba(142, 82, 252, 0.15); }
        .save-btn:hover:not(:disabled) { background: #7a3eeb; transform: translateY(-2px); box-shadow: 0 14px 40px rgba(142, 82, 252, 0.25); }
        .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
