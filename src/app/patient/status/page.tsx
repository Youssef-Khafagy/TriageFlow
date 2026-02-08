"use client";
import { useEffect, useState, useCallback } from 'react';
import { Clock, ShieldCheck, Loader2, UserCheck, CheckCircle2 } from 'lucide-react';
import { getCategoryWaitTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function PatientStatus() {
  const [session, setSession] = useState<any>(null);
  const [queueInfo, setQueueInfo] = useState({ position: 0, waitTime: 0 });
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) { const p = JSON.parse(u); if (p.role === 'staff') router.replace('/staff/dashboard'); }
  }, [router]);

  const checkStatus = useCallback(async () => {
    const sid = localStorage.getItem('currentSessionId');
    if (!sid) return;
    try {
      const res = await fetch('/api/staff/sessions');
      const all = await res.json();
      const cur = all.find((s: any) => s.id === sid);
      if (cur?.status === 'COMPLETED' && session?.status !== 'COMPLETED') {
        setShowToast(true);
        setTimeout(() => router.push('/'), 4000);
      }
      if (cur?.status === 'IN_ROOM') { setSession(cur); setLoading(false); return; }
      setSession(cur);
      if (cur && cur.status === 'READY') {
        const rq = all.filter((s: any) => s.status === 'READY');
        const idx = rq.findIndex((s: any) => s.id === sid);
        const wait = rq.slice(0, idx).reduce((a: number, s: any) => a + getCategoryWaitTime(s.category), 0);
        setQueueInfo({ position: idx + 1, waitTime: wait });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [session, router]);

  useEffect(() => {
    checkStatus();
    const i = setInterval(checkStatus, 3000);
    return () => clearInterval(i);
  }, [checkStatus]);

  const S = { bg: { background: 'var(--bg-base)' }, surface: { background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }, text: { color: 'var(--text-primary)' }, sub: { color: 'var(--text-secondary)' }, muted: { color: 'var(--text-muted)' }, font: { fontFamily: 'var(--font-display)' } };

  if (loading && !session) return <div className="h-[calc(100vh-64px)] flex items-center justify-center" style={S.bg}><Loader2 className="animate-spin" size={36} style={{ color: 'var(--color-primary)' }} /></div>;

  if (showToast) return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center p-6" style={S.bg}>
      <div className="bg-emerald-600 text-white p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-scale-in text-center max-w-sm">
        <CheckCircle2 size={64} />
        <h2 className="text-2xl font-bold" style={S.font}>Session Complete</h2>
        <p className="opacity-80 text-sm">Redirecting to home...</p>
      </div>
    </div>
  );

  if (session?.status === 'IN_ROOM') return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6" style={S.bg}>
      <div className="rounded-3xl border p-10 max-w-md w-full text-center animate-scale-in" style={{ ...S.surface, boxShadow: 'var(--shadow-lg)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--color-primary-light)' }}>
          <UserCheck size={32} style={{ color: 'var(--color-primary)' }} />
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ ...S.font, ...S.text }}>It's your turn!</h1>
        <p className="text-sm mb-6" style={S.sub}>Please proceed to the location below.</p>
        <div className="p-6 rounded-2xl text-white mb-6" style={{ background: 'var(--color-primary)' }}>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Assigned Location</div>
          <div className="text-4xl font-bold" style={S.font}>{session.room_number ? `Room ${session.room_number}` : 'Main Care Station'}</div>
        </div>
        <p className="text-xs" style={S.muted}>A healthcare provider is waiting for you.</p>
      </div>
    </div>
  );

  if (!session || session.status !== 'READY') return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6" style={S.bg}>
      <div className="text-center max-w-sm animate-fade-up">
        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6"><ShieldCheck className="text-amber-500" size={32} /></div>
        <h1 className="text-2xl font-bold mb-2" style={{ ...S.font, ...S.text }}>Report In Review</h1>
        <p className="text-sm mb-6" style={S.sub}>A staff member is verifying your AI-assisted intake summary.</p>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 rounded-full text-amber-500 text-xs font-bold">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" /> Reviewing Clinical Data
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6" style={S.bg}>
      <div className="text-center max-w-md w-full animate-fade-up">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6"><UserCheck className="text-emerald-500" size={32} /></div>
        <h1 className="text-2xl font-bold mb-1" style={{ ...S.font, ...S.text }}>You're in the queue</h1>
        <p className="text-sm mb-8" style={S.sub}>Verification complete. Please wait for your position to be called.</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border" style={S.surface}>
            <div className="text-[10px] uppercase font-bold tracking-widest mb-2" style={S.muted}>Position</div>
            <div className="text-4xl font-bold text-emerald-500" style={S.font}>#{queueInfo.position}</div>
          </div>
          <div className="p-6 rounded-2xl border" style={S.surface}>
            <div className="text-[10px] uppercase font-bold tracking-widest mb-2" style={S.muted}>Est. Wait</div>
            <div className="text-4xl font-bold text-emerald-500" style={S.font}>{queueInfo.waitTime}<span className="text-lg">m</span></div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs" style={S.muted}><Clock size={13} /> Updates every 3 seconds</div>
      </div>
    </div>
  );
}