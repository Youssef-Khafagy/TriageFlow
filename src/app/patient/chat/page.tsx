"use client";
import { useState, useEffect } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import { useRouter } from 'next/navigation';

export default function PatientChat() {
  const router = useRouter();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sid, setSid] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  // 1. Initial State Logic: Separate from initializer to prevent hydration issues
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const content = profile.firstName 
      ? `Hello ${profile.firstName}, I see your health profile is on file. How can I help you today?`
      : 'Hello, I am your Triage Nurse. What is your Full Name, Age, Sex, and Healthcard Number?';
    setMessages([{ role: 'assistant', content }]);
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        sessionId: sid, 
        message: currentInput, 
        hospitalId: 'demo',
        patientEmail: user.email,
        profile: profile 
      })
    });
    
    const data = await res.json();
    
    if (data.sessionId) {
      setSid(data.sessionId);
      localStorage.setItem('currentSessionId', data.sessionId);
    }
    
    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

    // AUTO-SUBMIT on Emergency Detection
    if (data.isEmergency) {
      setTimeout(() => finalize(true), 1500);
    }
  }

  // 2. Updated finalize function to accept the profile and isEmergency flag
  async function finalize(isEmergency = false) {
    setIsFinishing(true);
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    const res = await fetch('/api/triage/finalize', {
      method: 'POST',
      body: JSON.stringify({ 
        sessionId: sid || localStorage.getItem('currentSessionId'), 
        profile,        // CRITICAL: Send profile so dashboard isn't empty
        isEmergency     // CRITICAL: Triggers red pulse alert
      })
    });
    
    if (res.ok) {
      router.push('/patient/status');
    } else {
      setIsFinishing(false);
      alert("Failed to submit intake. Please try again.");
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-3xl mx-auto bg-white shadow-lg border-x">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} content={m.content} />
        ))}
      </div>
      
      <div className="p-4 border-t bg-white flex flex-col gap-3">
        {sid && (
          <button 
            // FIX: Wrap in anonymous function to prevent TypeScript MouseEvent error
            onClick={() => finalize(false)} 
            disabled={isFinishing} 
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-100"
          >
            <CheckCircle size={18} /> {isFinishing ? "Processing Report..." : "Submit Intake for Review"}
          </button>
        )}
        
        <div className="flex gap-2">
          <input 
            className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && sendMessage()} 
            placeholder="Describe your symptoms..." 
          />
          <button 
            onClick={sendMessage} 
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            <Send size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
}