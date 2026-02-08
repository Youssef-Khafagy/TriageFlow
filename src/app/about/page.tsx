"use client";
import { Zap, Sparkles, Code2, BrainCircuit, Layout, Database, Users } from 'lucide-react';
import AboutAIChat from '@/components/AboutAIChat';

export default function About() {
  const team = [
    { name: "Youssef Elshafei", role: "AI & Backend", icon: <BrainCircuit size={20} />, desc: "Architected the AI Triage logic and neural symptom assessment." },
    { name: "Subhan Razzaq", role: "Lead Full-Stack", icon: <Code2 size={20} />, desc: "Engineered the real-time staff dashboard and session synchronization." },
    { name: "Youssef Khafagy", role: "UI/UX & Frontend", icon: <Layout size={20} />, desc: "Designed the clinical interface and patient portal experience." },
    { name: "Adib El Dada", role: "Systems & Database", icon: <Database size={20} />, desc: "Optimized PostgreSQL performance and medical profile persistence." }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <section className="py-20 md:py-28 px-6 max-w-4xl mx-auto text-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--color-primary)', background: 'var(--color-primary-light)' }}><Sparkles size={12} /> The Future of ER Intake</span>
        </div>
        <h1 className="text-5xl md:text-7xl tracking-[-0.03em] leading-[1.05] mb-6 animate-fade-up delay-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Built for speed. <br /><span style={{ color: 'var(--color-primary)' }} className="italic">Designed for care.</span></h1>
        <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed animate-fade-up delay-2" style={{ color: 'var(--text-secondary)' }}>TriageFlow is an AI-powered platform built by four engineering students to eliminate the ER waiting room bottleneck.</p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="mb-10 animate-fade-up delay-2"><h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Meet the Team</h2><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Four engineering minds solving real-world healthcare challenges.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.map((m, i) => (
            <div key={i} className="group rounded-2xl p-6 border transition-all hover:shadow-lg animate-fade-up" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', animationDelay: `${(i+3)*80}ms` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:scale-110" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>{m.icon}</div>
              <h3 className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{m.name}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>{m.role}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-4 pb-20">
        <div className="md:col-span-2 rounded-2xl p-8 border group transition-all hover:shadow-lg animate-fade-up delay-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
          <Zap className="mb-6 group-hover:scale-110 transition-transform" size={32} style={{ color: 'var(--color-primary)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>The Vision</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Automate clinical summaries so providers can focus on life-saving care.</p>
        </div>
        <div className="rounded-2xl p-8 text-white flex flex-col justify-between animate-fade-up delay-6" style={{ background: 'var(--color-primary)' }}>
          <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>4</div>
          <div><p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Engineering Minds</p><p className="text-xs mt-2 opacity-70 leading-relaxed">Pushing boundaries to solve real healthcare crises.</p></div>
        </div>
      </section>

      <section className="py-20 border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8 text-center"><h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Ask the Assistant</h2><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Have questions about our mission or tech stack?</p></div>
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-md)' }}><AboutAIChat /></div>
        </div>
      </section>
    </div>
  );
}