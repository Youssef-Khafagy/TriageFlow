"use client";
import { Activity, Users, Zap, Sparkles, Code2, BrainCircuit, Layout, Database } from 'lucide-react';
import AboutAIChat from '@/components/AboutAIChat';

export default function About() {
  const team = [
    { name: "Youssef Elshafei", role: "AI & Backend Engineer", icon: <BrainCircuit size={24} />, desc: "Architected the AI Triage logic and neural symptom assessment." },
    { name: "Subhan Razzaq", role: "Lead Full-Stack Developer", icon: <Code2 size={24} />, desc: "Engineered the real-time staff dashboard and session synchronization." },
    { name: "Youssef Khafagy", role: "UI/UX & Frontend", icon: <Layout size={24} />, desc: "Designed the high-fidelity clinical interface and patient portal." },
    { name: "Adib El Dada", role: "Systems & Database", icon: <Database size={24} />, desc: "Optimized PostgreSQL performance and medical profile persistence." }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-8">
          <Sparkles size={14} /> The Future of ER Intake
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-10">
          Built for speed. <br />
          <span className="text-blue-600 italic">Designed for care.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
          TriageFlow is an AI-powered ecosystem designed by four software engineering students to eliminate the ER waiting room bottleneck.
        </p>
      </section>

      {/* Meet the Innovators Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-100">
        <div className="mb-16">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Meet the Innovators</h2>
          <p className="text-gray-500 font-medium max-w-xl">A dedicated team of four engineering minds building solutions for real-world healthcare crises.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {member.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">{member.name}</h3>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">{member.role}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Section (Your existing vision section) */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 pb-24">
        <div className="md:col-span-2 bg-gray-50 p-12 rounded-[40px] border border-gray-100 flex flex-col justify-between group hover:border-blue-200 transition-all">
          <Zap className="text-blue-600 mb-8 group-hover:scale-110 transition-transform" size={48} />
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">The Vision</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              The TriageFlow platform automates clinical summaries so providers can focus on life-saving care.
            </p>
          </div>
        </div>
        
        <div className="bg-blue-600 p-12 rounded-[40px] text-white flex flex-col justify-between shadow-2xl shadow-blue-200">
          <Users size={48} className="opacity-50" />
          <div>
            <div className="text-5xl font-black mb-2 tracking-tighter">4</div>
            <p className="text-blue-100 font-bold uppercase text-xs tracking-widest">Engineering Minds</p>
            <p className="mt-4 text-sm opacity-80">Our team pushes the boundaries of software engineering to solve real-world healthcare crises.</p>
          </div>
        </div>
      </section>

      {/* Gemini Assistant Section */}
      <section className="bg-gray-50 py-24 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6 text-center md:text-left">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Ask Gemini</h2>
              <p className="text-gray-500 font-medium">Have questions about our mission or tech stack? Our AI is ready.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-[40px] shadow-2xl border border-blue-100 overflow-hidden ring-1 ring-black/5">
            <AboutAIChat />
          </div>
        </div>
      </section>
    </div>
  );
}