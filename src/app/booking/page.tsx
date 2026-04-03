'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

export default function Booking() {
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState('Luna');
  const [selectedTime, setSelectedTime] = useState('09.00');
  const [selectedVisit, setSelectedVisit] = useState('Vaksinasi');
  const [selectedDate, setSelectedDate] = useState(17);
  const [days, setDays] = useState<any[]>([]);

  const pets = [
    { name: 'Luna', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="6" cy="4" rx="1.8" ry="2.5"/><ellipse cx="18" cy="4" rx="1.8" ry="2.5"/><ellipse cx="2.5" cy="11" rx="1.8" ry="2.5" transform="rotate(-20 2.5 11)"/><ellipse cx="21.5" cy="11" rx="1.8" ry="2.5" transform="rotate(20 21.5 11)"/><path d="M12 10c-3.5 0-7 2.5-7 6.5 0 3 2.5 5.5 7 5.5s7-2.5 7-5.5c0-4-3.5-6.5-7-6.5z"/></svg> },
    { name: 'Coki', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="6" cy="4" rx="1.8" ry="2.5"/><ellipse cx="18" cy="4" rx="1.8" ry="2.5"/><ellipse cx="2.5" cy="11" rx="1.8" ry="2.5" transform="rotate(-20 2.5 11)"/><ellipse cx="21.5" cy="11" rx="1.8" ry="2.5" transform="rotate(20 21.5 11)"/><path d="M12 10c-3.5 0-7 2.5-7 6.5 0 3 2.5 5.5 7 5.5s7-2.5 7-5.5c0-4-3.5-6.5-7-6.5z"/></svg> }
  ];

  const times = [
    { time: '08.00', status: 'Penuh', full: true },
    { time: '08.30', status: 'Penuh', full: true },
    { time: '09.00', status: 'Tersedia', full: false },
    { time: '09.30', status: 'Tersedia', full: false },
    { time: '10.00', status: 'Tersedia', full: false },
    { time: '10.30', status: 'Tersedia', full: false },
    { time: '13.00', status: 'Penuh', full: true },
    { time: '14.00', status: 'Tersedia', full: false },
    { time: '15.00', status: 'Tersedia', full: false }
  ];

  const visits = [
    { name: 'Vaksinasi', desc: 'Jadwal vaksin rutin atau booster', color: 'var(--red)', pale: 'var(--red-pale)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
    { name: 'Pemeriksaan Rutin', desc: 'Cek kesehatan umum', color: 'var(--blue)', pale: 'var(--blue-pale)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
    { name: 'Konsultasi', desc: 'Konsultasi masalah kesehatan', color: 'var(--pr)', pale: 'var(--pr-pale)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
    { name: 'Perawatan Gigi', desc: 'Scaling & perawatan gigi', color: 'var(--green)', pale: 'var(--green-pale)', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> }
  ];

  useEffect(() => {
    const available = [17, 18, 19, 20, 21, 22, 24, 25, 26];
    const newDays = [];
    for (let i = 1; i <= 5; i++) newDays.push({ type: 'other', val: '' });
    for (let d = 1; d <= 31; d++) {
      newDays.push({
        type: d === 16 ? 'today' : 'day',
        val: d,
        hasSlot: available.includes(d)
      });
    }
    setDays(newDays);
  }, []);

  const confirmBooking = () => {
    alert(`✅ Booking berhasil!\n\nDetail:\nðŸ± ${selectedPet} — ${selectedVisit}\n📆 ${selectedDate} Maret 2026 · ${selectedTime}\nðŸ¥ Klinik Hewan Sehat Selalu\n\nKonfirmasi akan dikirim via WhatsApp!`);
    router.push('/beranda');
  };

  return (
    <div className="app">
      <header className="header">
        <style jsx>{`
          .header { background: var(--ink); padding: 50px 20px 22px; position: relative; overflow: hidden; flex-shrink: 0; }
          .header::after { content:''; position:absolute; bottom:-20px; left:50%; transform:translateX(-50%); width:110%; height:44px; background:var(--bg); border-radius:50%; }
          .header-title { color:#fff; font-size:18px; font-weight:800; display: flex; align-items: center; gap: 8px; position: relative; z-index: 1; }
          .header-sub { color:rgba(255,255,255,.5); font-size:12px; margin-top:2px; position: relative; z-index: 1; }
        `}</style>
        <div className="header-title">
          Booking Appointment 
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div className="header-sub">Buat janji dengan dokter hewan</div>
      </header>

      <div className="scroll" style={{ padding: '16px 20px 120px' }}>
        <style jsx>{`
          .section-title { font-size: 13px; font-weight: 800; color: var(--ink); margin-bottom: 12px; }
          .pet-select-row { display: flex; gap: 10px; margin-bottom: 20px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
          .pet-select-row::-webkit-scrollbar { display: none; }
          .pet-chip { display: flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 20px; border: 2px solid var(--border); background: var(--white); cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all .2s; }
          .pet-chip.active { border-color: var(--pr); background: var(--pr-pale); }
          .pet-chip-name { font-size: 13px; font-weight: 700; }

          .calendar-card { background: var(--white); border-radius: 20px; border: 1.5px solid var(--border); overflow: hidden; margin: 0 auto 20px; max-width: 360px; box-shadow: 0 8px 24px rgba(142,82,252,0.08); }
          .cal-head { padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); background: #faf8ff; }
          .cal-month { font-size: 14px; font-weight: 800; color: var(--pr); }
          .cal-grid { padding: 12px; }
          .cal-days-header { display: grid; grid-template-columns: repeat(7,1fr); margin-bottom: 8px; }
          .cal-day-lbl { text-align: center; font-size: 10px; font-weight: 800; color: var(--muted); opacity: 0.6; }
          .cal-days { display: grid; grid-template-columns: repeat(7,1fr); gap: 4px; }
          .cal-day { aspect-ratio: 1; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .2s; position: relative; }
          .cal-day.today { background: var(--pr-pale); color: var(--pr); border: 1.5px solid var(--pr); font-weight: 800; }
          .cal-day.selected { background: linear-gradient(135deg, var(--pr), var(--sc)); color: #fff; box-shadow: 0 4px 10px rgba(142,82,252,0.3); }
          .cal-day.has-slot::after { content: ''; display: block; width: 4px; height: 4px; border-radius: 50%; background: var(--pr); position: absolute; bottom: 5px; }
          .cal-day.selected.has-slot::after { background: #fff; }
          .cal-day.other { color: rgba(0,0,0,0.06); pointer-events: none; }

          .time-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; }
          .time-slot { padding: 10px 8px; border-radius: 11px; border: 1.5px solid var(--border); background: var(--white); text-align: center; cursor: pointer; transition: all .2s; }
          .time-slot.active { border-color: var(--pr); background: var(--pr-pale); }
          .time-slot.full { opacity: .4; cursor: not-allowed; }
          .ts-time { font-size: 13px; font-weight: 800; color: var(--ink); }
          .ts-status { font-size: 10px; color: var(--muted); margin-top: 2px; }

          .visit-types { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
          .visit-type { display: flex; align-items: center; gap: 12px; padding: 13px 14px; border-radius: 14px; border: 1.5px solid var(--border); background: var(--white); cursor: pointer; transition: all .2s; }
          .visit-type.active { border-color: var(--pr); background: var(--pr-pale); }
          .vt-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
          .vt-name { font-size: 13px; font-weight: 700; color: var(--ink); }
          .vt-desc { font-size: 11px; color: var(--muted); margin-top: 1px; }
          .vt-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border); margin-left: auto; display: flex; align-items: center; justify-content: center; }
          .visit-type.active .vt-radio { border-color: var(--pr); background: var(--pr); }
          .vt-dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; }

          .notes-input { width: 100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid var(--border); font-size: 13.5px; color: var(--ink); outline: none; resize: none; min-height: 80px; margin-bottom: 20px; }
          .btn-book { width: 100%; padding: 14px; border-radius: 14px; background: linear-gradient(135deg,var(--pr),var(--sc)); color: #fff; font-size: 15px; font-weight: 800; border: none; cursor: pointer; box-shadow: 0 6px 18px rgba(142,82,252,.3); display: flex; align-items: center; justify-content: center; gap: 8px; }
        `}</style>

        <div className="section-title">Pilih Hewan</div>
        <div className="pet-select-row">
          {pets.map((pet, i) => (
            <div key={i} className={`pet-chip ${selectedPet === pet.name ? 'active' : ''}`} onClick={() => setSelectedPet(pet.name)}>
              <span className="pet-chip-icon">{pet.icon}</span>
              <span className="pet-chip-name">{pet.name}</span>
            </div>
          ))}
        </div>

        <div className="section-title">Pilih Tanggal</div>
        <div className="calendar-card">
          <div className="cal-head">
            <div className="cal-month">Maret 2026</div>
          </div>
          <div className="cal-grid">
            <div className="cal-days-header">
              <div className="cal-day-lbl">Min</div><div className="cal-day-lbl">Sen</div><div className="cal-day-lbl">Sel</div><div className="cal-day-lbl">Rab</div><div className="cal-day-lbl">Kam</div><div className="cal-day-lbl">Jum</div><div className="cal-day-lbl">Sab</div>
            </div>
            <div className="cal-days">
              {days.map((d, i) => (
                <div key={i} className={`cal-day ${d.type} ${d.hasSlot ? 'has-slot' : ''} ${selectedDate === d.val ? 'selected' : ''}`} onClick={() => d.val && setSelectedDate(d.val)}>
                  {d.val}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-title">Pilih Jam</div>
        <div className="time-grid">
          {times.map((t, i) => (
            <div key={i} className={`time-slot ${t.full ? 'full' : ''} ${selectedTime === t.time ? 'active' : ''}`} onClick={() => !t.full && setSelectedTime(t.time)}>
              <div className="ts-time">{t.time}</div>
              <div className="ts-status">{t.status} {selectedTime === t.time && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}</div>
            </div>
          ))}
        </div>

        <div className="section-title">Jenis Kunjungan</div>
        <div className="visit-types">
          {visits.map((v, i) => (
            <div key={i} className={`visit-type ${selectedVisit === v.name ? 'active' : ''}`} onClick={() => setSelectedVisit(v.name)}>
              <div className="vt-icon" style={{ background: v.pale, color: v.color }}>{v.icon}</div>
              <div><div className="vt-name">{v.name}</div><div className="vt-desc">{v.desc}</div></div>
              <div className="vt-radio">{selectedVisit === v.name && <div className="vt-dot"></div>}</div>
            </div>
          ))}
        </div>

        <div className="section-title">Catatan Tambahan</div>
        <textarea className="notes-input" placeholder="Ceritakan keluhan atau kondisi hewan kamu..."></textarea>

        <button className="btn-book" onClick={confirmBooking}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> 
          Konfirmasi Booking
        </button>
      </div>

      <BottomNav />
    </div>
  );
}




