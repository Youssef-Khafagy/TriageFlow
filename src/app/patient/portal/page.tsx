"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, History, Lock, ArrowRight } from 'lucide-react';

export default function PatientPortal() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) { const p = JSON.parse(stored); if (p.role === 'staff') { router.replace('/staff/dashboard'); return; } setUser(p); }
    setLoading(false);
  }, [router]);

  if (loading) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-3xl w-full animate-fade-up">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Patient Portal</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your ER intake reports and start new consultations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link href="/patient/chat" className="group rounded-2xl p-8 border transition-all hover:shadow-lg animate-fade-up delay-1" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors group-hover:scale-110" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}><PlusCircle size={24} /></div>
            <h2 className="text-lg font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Start New Intake</h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>Begin an AI-guided conversation to describe your symptoms.</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Get started <ArrowRight size={14} /></span>
          </Link>
          {user ? (
            <Link href="/patient/reports" className="group rounded-2xl p-8 border transition-all hover:shadow-lg animate-fade-up delay-2" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-indigo-500/10 text-indigo-500 transition-colors group-hover:scale-110"><History size={24} /></div>
              <h2 className="text-lg font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>My Reports</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>View and track your previous triage submissions.</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-500">View history <ArrowRight size={14} /></span>
            </Link>
          ) : (
            <div className="rounded-2xl p-8 border border-dashed opacity-70 animate-fade-up delay-2" style={{ background: 'var(--bg-surface-hover)', borderColor: 'var(--border-color)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}><Lock size={24} /></div>
              <h2 className="text-lg font-bold mb-1.5" style={{ color: 'var(--text-muted)' }}>My Reports</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>Login required to view report history.</p>
              <Link href="/login" className="inline-flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-lg border transition-all" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>Sign in to unlock</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}