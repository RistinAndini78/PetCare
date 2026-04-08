'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';

export default function DiagnosaAI() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Halo! Saya asisten AI PetCare. Ceritakan gejala yang dialami hewan peliharaan Anda (misal: "kucing saya muntah kuning dan lemas"). Saya akan bantu memberikan diagnosa awal.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: `Error: ${data.error}` }]);
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: `Maaf, terjadi kesalahan: ${error.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app bg-white flex flex-col h-screen relative">
      <style jsx>{`
        .app { height: 100vh; display: flex; flex-direction: column; background: var(--bg); overflow: hidden; }
        .header { background: var(--white); padding: 16px 20px; display: flex; align-items: center; gap: 15px; border-bottom: 1.5px solid var(--border); z-index: 10; position: sticky; top: 0; }
        .back-btn { width: 36px; height: 36px; border-radius: 12px; background: var(--bg); display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1.5px solid var(--border); text-decoration: none; color: var(--ink); }
        .ai-avatar { width: 42px; height: 42px; border-radius: 14px; background: linear-gradient(135deg, var(--pr) 0%, #a470ff 100%); display: flex; align-items: center; justify-content: center; color: white; }
        .header-info { flex: 1; }
        .header-title { font-size: 16px; font-weight: 800; color: var(--ink); }
        .header-sub { font-size: 11px; font-weight: 600; color: var(--pr); display: flex; align-items: center; gap: 4px; margin-top: 2px; }
        .status-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; box-shadow: 0 0 0 2px var(--green-pale); }
        
        .chat-area { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; background: var(--bg); }
        .msg-row { display: flex; width: 100%; }
        .msg-row.ai { justify-content: flex-start; }
        .msg-row.user { justify-content: flex-end; }
        
        .msg-bubble { max-width: 80%; padding: 14px 16px; font-size: 14px; line-height: 1.5; position: relative; }
        .ai .msg-bubble { background: var(--white); border-radius: 16px 16px 16px 4px; border: 1.5px solid var(--border); color: var(--ink); box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .user .msg-bubble { background: linear-gradient(135deg, var(--pr) 0%, #a470ff 100%); border-radius: 16px 16px 4px 16px; color: var(--white); box-shadow: 0 4px 12px rgba(142,82,252,0.25); }
        
        .typing-indicator { padding: 14px 16px; background: var(--white); border-radius: 16px 16px 16px 4px; border: 1.5px solid var(--border); display: flex; gap: 4px; align-items: center; width: max-content; }
        .dot { width: 6px; height: 6px; background: var(--muted); border-radius: 50%; animation: blink 1.4s infinite both; }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0% { opacity: 0.2; transform: scale(0.8); } 20% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.2; transform: scale(0.8); } }

        .input-area { background: var(--white); border-top: 1.5px solid var(--border); padding: 16px 20px 96px; display: flex; gap: 12px; align-items: flex-end; z-index: 10; }
        .input-wrapper { flex: 1; background: var(--bg); border: 1.5px solid var(--border); border-radius: 20px; padding: 12px 16px; display: flex; flex-direction: column; transition: border-color 0.2s; }
        .input-wrapper:focus-within { border-color: var(--pr); box-shadow: 0 0 0 3px var(--pr-pale); }
        .chat-input { background: transparent; border: none; outline: none; font-size: 14px; color: var(--ink); resize: none; max-height: 100px; min-height: 24px; font-family: inherit; width: 100%; }
        .send-btn { width: 48px; height: 48px; border-radius: 50%; background: var(--pr); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: transform 0.2s; border: none; }
        .send-btn:active { transform: scale(0.95); }
        .send-btn:disabled { background: var(--muted); cursor: not-allowed; opacity: 0.5; }
      `}</style>

      <div className="header">
        <Link href="/hewan-saya" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </Link>
        <div className="ai-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2z"/><path d="M19 8h-2V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2z"/><path d="M8 12h.01"/><path d="M16 12h.01"/><path d="M9 16c1-1 2-1 3-1s2 0 3 1"/></svg>
        </div>
        <div className="header-info">
          <div className="header-title">PetCare AI</div>
          <div className="header-sub"><span className="status-dot"></span> Online</div>
        </div>
      </div>

      <div className="chat-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`msg-row ${msg.sender} animate-pop`}>
            <div className="msg-bubble">{msg.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="msg-row ai animate-pop">
            <div className="typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <div className="input-wrapper">
          <textarea 
            className="chat-input" 
            placeholder="Ketik gejala hewan Anda..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
          />
        </div>
        <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '-2px' }}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
