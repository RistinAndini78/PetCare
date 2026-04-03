'use client';

import { useRouter } from 'next/navigation';

export default function AdminChangePassword() {
  const router = useRouter();

  const handleUpdate = () => {
    alert('Password berhasil diperbarui');
    router.push('/admin/pengaturan/keamanan');
  };

  return (
    <div className="admin-body">
      <nav className="top-back-nav">
        <style jsx global>{`
          .admin-body { min-height: 100vh; background: #fdfbff; display: flex; flex-direction: column; }
          .top-back-nav { height: 72px; padding: 0 32px; display: flex; align-items: center; gap: 20px; border-bottom: 1px solid #f0f0f0; background: #fff; }
          .back-btn-sm { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid #f0f0f0; display: flex; align-items: center; justify-content: center; color: #1a1a1a; cursor: pointer; background: #fff; transition: all 0.2s; }
          .back-btn-sm:hover { border-color: #8e52fc; color: #8e52fc; }
          .page-title-bold { font-size: 16px; font-weight: 800; color: #1a1a1a; }

          .form-container { flex: 1; display: flex; align-items: flex-start; justify-content: center; padding: 60px 24px; }
          .form-card { width: 100%; max-width: 440px; background: #fff; border-radius: 28px; border: 1.5px solid #f0f0f0; padding: 40px; box-shadow: 0 10px 40px rgba(142, 82, 252, 0.05); }
          
          .form-group { margin-bottom: 24px; }
          .form-group label { display: block; font-size: 12px; font-weight: 800; color: #a19db5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
          .form-input { width: 100%; padding: 14px 18px; background: #f9f7ff; border: 1.5px solid #ece4ff; border-radius: 14px; font-size: 14px; color: #1a1a1a; outline: none; transition: all 0.2s; font-weight: 600; }
          .form-input:focus { border-color: #c084fc; background: #fff; }

          .update-btn { width: 100%; height: 54px; background: #8e52fc; border-radius: 16px; color: #fff; border: none; font-size: 14.5px; font-weight: 800; cursor: pointer; transition: all 0.25s; box-shadow: 0 10px 24px rgba(142, 82, 252, 0.2); margin-top: 12px; }
          .update-btn:hover { background: #7a3eeb; transform: translateY(-2px); box-shadow: 0 14px 32px rgba(142, 82, 252, 0.3); }
        `}</style>
        <button onClick={() => router.back()} className="back-btn-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="page-title-bold">Ganti Password</div>
      </nav>

      <div className="form-container">
        <div className="form-card">
          <div className="form-group">
            <label>Password Saat Ini</label>
            <input type="password" placeholder="••••••••" className="form-input" />
          </div>
          <div className="form-group">
            <label>Password Baru</label>
            <input type="password" placeholder="••••••••" className="form-input" />
          </div>
          <div className="form-group">
            <label>Konfirmasi Password Baru</label>
            <input type="password" placeholder="••••••••" className="form-input" />
          </div>
          <button className="update-btn" onClick={handleUpdate}>Perbarui Password</button>
        </div>
      </div>
    </div>
  );
}
