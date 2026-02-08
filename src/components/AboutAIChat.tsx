"use client";
import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function AboutAIChat() {
  const [messages, setMessages] = useState([{ role: 'model', parts: [{ text: "Hi! I'm TriageFlow's mission assistant. Ask me anything about our vision for healthcare!" }] }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    const ci = input;
    setInput('');
    try {
      const res = await fetch('/api/about/chat', { method: 'POST', body: JSON.stringify({ message: ci, history: messages.slice(0, -1) }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.reply }] }]);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="flex flex-col h-[420px]">
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'text-white rounded-tr-md shadow-md' : 'rounded-tl-md border'}`}
              style={m.role === 'user' ? { background: 'var(--color-primary)' } : { background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
              {m.parts[0].text}
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start animate-fade-up"><div className="border px-4 py-3 rounded-2xl rounded-tl-md" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}><div className="flex gap-1.5"><span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--text-muted)' }} /><span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--text-muted)', animationDelay: '150ms' }} /><span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--text-muted)', animationDelay: '300ms' }} /></div></div></div>}
      </div>
      <div className="p-4 flex gap-2.5" style={{ borderTop: '1px solid var(--border-color)' }}>
        <input className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none border transition-colors" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Ask about the team..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
        <button onClick={sendMessage} disabled={isLoading} className="text-white p-2.5 rounded-xl transition-colors disabled:opacity-50" style={{ background: 'var(--color-primary)' }}><Send size={17} /></button>
      </div>
    </div>
  );
}