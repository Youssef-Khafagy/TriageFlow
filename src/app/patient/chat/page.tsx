"use client";
import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, Activity } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import { useRouter } from 'next/navigation';

export default function PatientChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sid, setSid] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const initialized = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) { const p = JSON.parse(storedUser); if (p.role === 'staff') { router.replace('/staff/dashboard'); return; } }
  }, [router]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!initialized.current) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const isGuest = !user.email || !profile.firstName;
      const content = isGuest
        ? 'Hello, I am your Triage Nurse. What is your Full Name, Age, Sex, and Healthcard Number?'
        : `Hello ${profile.firstName}, I see your health profile is on file. How can I help you today?`;
      setMessages([{ role: 'assistant', content }]);
      initialized.current = true;
    }
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ sessionId: sid, message: currentInput, hospitalId: 'demo', patientEmail: user.email, profile })
      });
      const data = await res.json();
      if (data.sessionId) { setSid(data.sessionId); localStorage.setItem('currentSessionId', data.sessionId); }
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      if (data.isEmergency) setTimeout(() => finalize(true), 1500);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was a connection error. Please try again.' }]);
    } finally { setIsTyping(false); }
  }

  async function finalize(isEmergency = false) {
    setIsFinishing(true);
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    try {
      const res = await fetch('/api/triage/finalize', {
        method: 'POST',
        body: JSON.stringify({ sessionId: sid || localStorage.getItem('currentSessionId'), profile, isEmergency })
      });
      if (res.ok) router.push('/patient/status');
      else { setIsFinishing(false); alert("Failed to submit intake. Please try again."); }
    } catch { setIsFinishing(false); alert("Network error. Please try again."); }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-3xl mx-auto" style={{ background: 'var(--bg-base)' }}>
      <div className="px-5 py-3.5 border-b flex items-center gap-3 no-print" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary-light)' }}>
          <Activity size={16} style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>AI Triage Nurse</h2>
          <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Collecting intake information</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Active</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.map((m, i) => <ChatMessage key={i} role={m.role} content={m.content} />)}
        {isTyping && <ChatMessage role="assistant" content="" isTyping />}
      </div>

      <div className="p-4 border-t space-y-3 no-print" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
        {sid && (
          <button onClick={() => finalize(false)} disabled={isFinishing} className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-60">
            <CheckCircle size={17} />
            {isFinishing ? 'Processing Report...' : 'Submit Intake for Review'}
          </button>
        )}
        <div className="flex gap-2">
          <input className="flex-1 px-4 py-3 rounded-xl text-sm border outline-none transition-colors" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()} placeholder="Describe your symptoms..." />
          <button onClick={sendMessage} disabled={isTyping || !input.trim()} className="px-4 text-white rounded-xl transition-colors disabled:opacity-40 active:scale-[0.96]" style={{ background: 'var(--color-primary)' }}>
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}