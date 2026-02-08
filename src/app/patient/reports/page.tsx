"use client";
import { useEffect, useState } from 'react';
import UrgencyBadge from '@/components/UrgencyBadge';
import { ChevronLeft, FileText, Calendar, Printer } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) { const p = JSON.parse(u); if (p.role === 'staff') { router.replace('/staff/dashboard'); return; } }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email) { setLoading(false); return; }
    fetch('/api/staff/sessions').then(r => r.json()).then(data => {
      setReports(data.filter((s: any) => s.patient_email === user.email));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 md:p-8" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/patient/portal" className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors no-print" style={{ color: 'var(--text-muted)' }}><ChevronLeft size={15} /> Back to Portal</Link>
        <h1 className="text-2xl font-bold mb-8 no-print" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>My Reports</h1>
        {loading ? (
          <div className="space-y-4">{[1,2].map(i => <div key={i} className="rounded-2xl border p-6 animate-shimmer h-28" style={{ borderColor: 'var(--border-color)' }} />)}</div>
        ) : reports.length === 0 ? (
          <div className="p-12 rounded-2xl text-center border animate-fade-up" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
            <FileText className="mx-auto mb-4" size={48} style={{ color: 'var(--text-muted)' }} /><p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No reports submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((r: any, i: number) => (
              <div key={r.id} className="rounded-2xl border p-6 animate-fade-up hover:shadow-md transition-shadow" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', animationDelay: `${i*80}ms` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}><Calendar size={18} /></div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{r.category || 'General'}</div>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <UrgencyBadge level={r.urgency_score} />
                    <button onClick={() => window.print()} className="p-1.5 rounded-lg transition-all no-print" style={{ color: 'var(--text-muted)' }}><Printer size={15} /></button>
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'var(--bg-input)', borderLeft: '3px solid var(--color-primary)' }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary)' }}>Clinical Summary</p>
                  <p className="text-sm leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>{r.summary || 'Summary pending clinical review.'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}