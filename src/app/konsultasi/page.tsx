'use client';

import { useState, useRef, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';

export default function Konsultasi() {
  const [chatOpened, setChatOpened] = useState(false);
  const [activeTab, setActiveTab] = useState('online');
  const userIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  const [activeDoctor, setActiveDoctor] = useState({ name: '', ava: userIcon });
  const [messages, setMessages] = useState([
    { id: 1, type: 'recv', text: 'Halo! Ada yang bisa saya bantu mengenai kesehatan hewan peliharaan Anda?', time: '09.30' },
    { id: 2, type: 'sent', text: 'Dok, kucing saya Luna sudah 2 hari kurang nafsu makan. Kira-kira kenapa ya?', time: '09.32' },
    { id: 3, type: 'recv', text: 'Kucing yang kurang nafsu makan bisa disebabkan beberapa hal — bisa stres, infeksi, atau masalah gigi. Berapa umur Luna dan apakah ada gejala lain seperti muntah atau lemas?', time: '09.33' },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const doctors = [
    { name: 'drh. Andi Pratama', spec: 'Dokter Hewan Umum · Klinik Sehat Selalu', rating: '4.9', reviews: '128', status: 'online', ava: userIcon },
    { name: 'drh. Sari Indah', spec: 'Spesialis Kucing · Klinik Sehat Selalu', rating: '4.8', reviews: '94', status: 'busy', ava: userIcon },
    { name: 'drh. Budi Santoso', spec: 'Spesialis Dermatologi Hewan', rating: '4.7', reviews: '76', status: 'online', ava: userIcon },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatOpened) scrollToBottom();
  }, [messages, chatOpened]);

  const openChat = (doc: any) => {
    setActiveDoctor({ name: doc.name, ava: doc.ava });
    setChatOpened(true);
  };

  const sendMsg = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}.${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newMsg = { id: Date.now(), type: 'sent', text: inputText, time: timeStr };
    setMessages([...messages, newMsg]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'recv', 
        text: 'Terima kasih infonya. Saya sarankan untuk membawa ' + (activeDoctor.name.includes('Sari') ? 'anak bulu' : 'Luna') + ' ke klinik untuk pemeriksaan lebih lanjut ya.', 
        time: timeStr 
      }]);
    }, 1500);
  };

  return (
    <div className="app">
      {!chatOpened ? (
        <>
          <header className="header">
             <style jsx>{`
              .header { background: var(--ink); padding: 50px 20px 22px; position: relative; overflow: hidden; flex-shrink: 0; }
              .header::after { content: ''; position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); width: 110%; height: 44px; background: var(--bg); border-radius: 50%; }
              .header-top { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1; }
              .header-title { color: #fff; font-size: 18px; font-weight: 800; }
              .header-sub { color: rgba(255,255,255,.5); font-size: 12px; margin-top: 2px; }
            `}</style>
            <div className="header-top">
              <div>
                <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Konsultasi <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity:.8 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div className="header-sub">Chat langsung dengan dokter hewan</div>
              </div>
            </div>
          </header>

          <div className="chat-tabs">
            <style jsx>{`
              .chat-tabs { display: flex; background: var(--white); border-bottom: 1.5px solid var(--border); }
              .chat-tab { flex: 1; padding: 14px; text-align: center; font-size: 13px; font-weight: 700; color: var(--muted); cursor: pointer; border-bottom: 3px solid transparent; transition: all .2s; }
              .chat-tab.active { color: var(--pr); border-bottom-color: var(--pr); }
            `}</style>
            <div className={`chat-tab ${activeTab === 'online' ? 'active' : ''}`} onClick={() => setActiveTab('online')}>Dokter Online</div>
            <div className={`chat-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Riwayat Chat</div>
          </div>

          <div className="doctor-list">
            <style jsx>{`
              .doctor-list { flex: 1; overflow-y: auto; padding: 16px 20px 120px; }
              .doctor-card { background: var(--white); border-radius: 16px; border: 1.5px solid var(--border); padding: 14px; margin-bottom: 12px; display: flex; gap: 12px; cursor: pointer; transition: all .2s; }
              .doctor-card:active { transform: scale(.98); }
              .doc-ava { width: 52px; height: 52px; border-radius: 15px; background: linear-gradient(135deg, var(--pr), var(--sc)); display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; color: #fff; }
              .doc-info { flex: 1; overflow: hidden; }
              .doc-name { font-size: 14px; font-weight: 800; color: var(--ink); }
              .doc-spec { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
              .doc-rating { display: flex; align-items: center; gap: 4px; margin-top: 6px; font-size: 12px; font-weight: 700; color: var(--pr); }
              .doc-status { display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 20px; }
              .ds-online { background: var(--green-pale); color: var(--green); }
              .ds-busy { background: #fef9e3; color: #a07b10; }
              .chat-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; flex-shrink: 0; }
              .cb-icon { width: 36px; height: 36px; border-radius: 11px; background: var(--pr-pale); display: flex; align-items: center; justify-content: center; font-size: 18px; }
              .cb-label { font-size: 9px; font-weight: 700; color: var(--pr); }
              .history-msg { font-size: 12px; color: var(--muted); margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
            `}</style>
            
          {activeTab === 'online' ? (
            <>
            {doctors.map((doc, i) => (
              <div key={i} className="doctor-card" onClick={() => openChat(doc)}>
                <div className="doc-ava">{doc.ava}</div>
                <div className="doc-info">
                  <div className="doc-name">{doc.name}</div>
                  <div className="doc-spec">{doc.spec}</div>
                  <div className="doc-rating">⭐ {doc.rating} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>( {doc.reviews} ulasan )</span></div>
                </div>
                <div className="chat-btn">
                  <div style={{ marginBottom: '4px' }}>
                    <span className={`doc-status ${doc.status === 'online' ? 'ds-online' : 'ds-busy'}`}>● {doc.status === 'online' ? 'Online' : 'Sibuk'}</span>
                  </div>
                  <div className="cb-icon">💬</div>
                  <div className="cb-label">Chat</div>
                </div>
              </div>
            ))}
            </>
          ) : (
            <>
            {[doctors[0], doctors[2]].map((doc, i) => (
              <div key={`hist-${i}`} className="doctor-card" onClick={() => openChat(doc)}>
                <div className="doc-ava">{doc.ava}</div>
                <div className="doc-info" style={{ overflow: 'hidden' }}>
                  <div className="doc-name">{doc.name}</div>
                  <div className="doc-spec">Selesai • {i === 0 ? '2 hari yang lalu' : '1 minggu yang lalu'}</div>
                  <div className="history-msg">{i === 0 ? '"Terima kasih infonya dok..."' : '"Bisa diberikan obat alerginya..."'}</div>
                </div>
              </div>
            ))}
            </>
          )}
          </div>
          <BottomNav />
        </>
      ) : (
        <div className="chat-view">
          <style jsx>{`
            .chat-view { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }
            .chat-header { background: var(--white); padding: 50px 16px 12px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
            .back-btn { width: 32px; height: 32px; border-radius: 9px; background: var(--bg); display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; border: none; }
            .chat-doc-ava { width: 36px; height: 36px; border-radius: 11px; background: linear-gradient(135deg, var(--pr), var(--sc)); display: flex; align-items: center; justify-content: center; font-size: 18px; color: #fff; }
            .chat-doc-name { font-size: 13.5px; font-weight: 800; color: var(--ink); }
            .chat-online { font-size: 11px; color: var(--green); font-weight: 600; }
            
            .messages { flex: 1; overflow-y: auto; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
            .msg { max-width: 78%; display: flex; flex-direction: column; gap: 3px; }
            .msg.sent { align-self: flex-end; align-items: flex-end; }
            .msg.recv { align-self: flex-start; }
            .msg-bubble { padding: 10px 13px; border-radius: 16px; font-size: 13.5px; line-height: 1.5; }
            .sent .msg-bubble { background: var(--pr); color: #fff; border-radius: 16px 16px 4px 16px; }
            .recv .msg-bubble { background: var(--white); color: var(--ink); border: 1.5px solid var(--border); border-radius: 16px 16px 16px 4px; }
            .msg-time { font-size: 10px; color: var(--muted); }

            .chat-input-row { padding: 10px 14px 30px; background: var(--white); border-top: 1px solid var(--border); display: flex; gap: 8px; align-items: center; }
            .chat-input { flex: 1; padding: 10px 14px; border-radius: 22px; border: 1.5px solid var(--border); font-size: 14px; outline: none; background: var(--bg); }
            .send-btn { width: 40px; height: 40px; border-radius: 12px; background: var(--pr); border: none; display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; }
          `}</style>
          <div className="chat-header">
            <button className="back-btn" onClick={() => setChatOpened(false)}>←</button>
            <div className="chat-doc-ava">{activeDoctor.ava}</div>
            <div style={{ flex: 1 }}>
              <div className="chat-doc-name">{activeDoctor.name}</div>
              <div className="chat-online">● Online sekarang</div>
            </div>
            <div className="back-btn">📞</div>
          </div>
          
          <div style={{ background: 'linear-gradient(90deg, #1a0f2e 0%, #4a2b8e 100%)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🐱</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#fff' }}>Luna</div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--red)', background: '#fff', padding: '1px 6px', borderRadius: '10px' }}>Vaksin!</span>
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Kucing Persia Mix · 2 Thn</div>
              </div>
              <button style={{ background: 'rgba(255,255,255,0.14)', border: 'none', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '6px 12px', borderRadius: '8px' }}>Detail RM</button>
          </div>

          <div className="messages">
            {messages.map(msg => (
              <div key={msg.id} className={`msg ${msg.type}`}>
                <div className="msg-bubble">{msg.text}</div>
                <div className="msg-time">{msg.time}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <input 
              className="chat-input" 
              placeholder="Ketik pesan..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
            />
            <button className="send-btn" onClick={sendMsg}>🚀</button>
          </div>
        </div>
      )}
    </div>
  );
}




