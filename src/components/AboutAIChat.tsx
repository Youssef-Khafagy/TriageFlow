"use client";
import { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

export default function AboutAIChat() {
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Hi! I'm TriageFlow's mission assistant. Ask me anything about our vision for healthcare!" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || isLoading) return;
    
    const userMsg = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    const currentInput = input;
    setInput('');

    try {
      const res = await fetch('/api/about/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          message: currentInput,
          // Gemini expects a specific history format
          history: messages.slice(0, -1) 
        })
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.reply }] }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[500px] bg-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}>
              {m.parts[0].text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-3xl animate-pulse text-gray-400">
              <Loader2 size={18} className="animate-spin" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 border-t flex gap-3">
        <input 
          className="flex-1 p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all" 
          placeholder="Ask about the team..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button 
          onClick={sendMessage}
          className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
          disabled={isLoading}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}