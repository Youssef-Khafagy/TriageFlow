"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import UrgencyBadge from '@/components/UrgencyBadge';
import { ChevronLeft, CheckCircle, Phone, MapPin, DoorOpen, Printer, AlertTriangle, Edit3, FileText, Activity} from 'lucide-react';

const URGENCY_LABELS: Record<string,string> = { "1":"Emergent","2":"Urgent","3":"Moderate","4":"Low","5":"Non-Urgent" };

export default function StaffReview() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [room, setRoom] = useState('');
  const [overrideUrgency, setOverrideUrgency] = useState('');
  const [staffNotes, setStaffNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { router.replace('/staff/login'); return; }
    const parsed = JSON.parse(storedUser);
    if (parsed.role !== 'staff') { router.replace('/patient/portal'); return; }
  }, [router]);

  useEffect(() => {
    fetch('/api/staff/sessions')
      .then(res => res.json())
      .then(json => {
        const session = json.find((s: any) => s.id === id);
        if (session) {
          setData(session);
          if (session.room_number) setRoom(session.room_number);
          setOverrideUrgency(session.urgency_score || '3');
        }
      });
  }, [id]);

  async function handleAction(status: string) {
    setSaving(true);
    const res = await fetch('/api/staff/verify', {
      method: 'PATCH',
      body: JSON.stringify({
        sessionId: id,
        status,
        roomNumber: room,
        urgency: overrideUrgency || data.urgency_score,
        notes: staffNotes || data.summary
      })
    });
    if (res.ok) router.push('/staff/dashboard');
    else setSaving(false);
  }

  if (!data) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  const isEmergent = data.urgency_score === '1';

  // Extract a clean one-line summary from SBAR (first sentence of SITUATION section)
  const extractQuickSummary = (sbar: string) => {
    if (!sbar) return 'No summary available.';
    // Try to extract the SITUATION line
    const sitMatch = sbar.match(/\[S\]\s*SITUATION\s*\*{0,2}\s*:?\s*(.+?)(?:\n|---|$)/i);
    if (sitMatch) return sitMatch[1].trim().replace(/^\*+|\*+$/g, '').trim();
    // Fallback: first meaningful line
    const lines = sbar.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---'));
    return lines[0]?.replace(/\*+/g, '').trim() || 'Intake data collected via AI nurse.';
  };

  const quickSummary = extractQuickSummary(data.summary);

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 md:p-8" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 no-print">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: 'var(--text-muted)' }}>
            <ChevronLeft size={17} /> Back to Dashboard
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 border px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            <Printer size={15} /> Print Report
          </button>
        </div>

        {/* Main card */}
        <div className="rounded-2xl border overflow-hidden mb-6 no-print animate-fade-up" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
          {/* Status bar */}
          <div className={`px-6 py-4 flex items-center justify-between ${isEmergent ? 'bg-red-600' : ''}`} style={!isEmergent ? { background: 'var(--color-primary)' } : {}}>
            <div className="flex items-center gap-3">
              {isEmergent && <AlertTriangle size={18} className="text-white animate-pulse" />}
              <h1 className="text-white text-lg font-bold">Clinical Triage Review</h1>
            </div>
            <UrgencyBadge level={data.urgency_score} />
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Demographics */}
            <div className="space-y-5">
              <section className="p-5 rounded-xl border" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Demographics</h3>
                <div className="space-y-2 text-sm">
                  <p><span style={{ color: 'var(--text-muted)' }}>Name:</span> <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{data.patient_name || 'N/A'}</span></p>
                  <p><span style={{ color: 'var(--text-muted)' }}>Age/Sex:</span> <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{data.patient_age} / {data.patient_sex}</span></p>
                  <p><span style={{ color: 'var(--text-muted)' }}>Healthcard:</span> <span className="font-mono font-semibold" style={{ color: 'var(--color-primary)' }}>{data.healthcard}</span></p>
                  {data.allergies && data.allergies !== 'None' && (
                    <p><span className="text-red-400">Allergies:</span> <span className="font-semibold text-red-400">{data.allergies}</span></p>
                  )}
                </div>
              </section>

              <section className="p-5 rounded-xl border" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Contact</h3>
                <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <p className="flex items-center gap-2"><Phone size={13} style={{ color: 'var(--text-muted)' }} /> {data.phone || 'No phone'}</p>
                  <p className="flex items-start gap-2"><MapPin size={13} className="mt-0.5" style={{ color: 'var(--text-muted)' }} /> {data.address || 'No address'}</p>
                </div>
              </section>

              {/* Urgency Override */}
              <section className="p-5 rounded-xl border" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                  <Edit3 size={12} /> Override Urgency
                </h3>
                <select className="w-full px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} value={overrideUrgency} onChange={e => setOverrideUrgency(e.target.value)}>
                  {Object.entries(URGENCY_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>Level {val}: {label}</option>
                  ))}
                </select>
              </section>
            </div>

            {/* Right */}
            <div className="lg:col-span-2 space-y-5">
              {/* ═══ CLEAN AI SUMMARY (separate from SBAR) ═══ */}
              <section className="p-6 rounded-xl border" style={{ background: 'var(--color-primary-light)', borderColor: 'var(--border-color)' }}>
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-primary)' }}>
                  <Activity size={13} /> AI Quick Summary
                </h3>
                <p className="text-lg font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {quickSummary}
                </p>
              </section>

              {/* ═══ FULL SBAR REPORT (collapsible) ═══ */}
              <details className="group rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                <summary className="flex items-center gap-2 px-5 py-4 cursor-pointer font-semibold text-sm select-none" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                  <FileText size={15} />
                  Full SBAR Clinical Report
                  <span className="ml-auto text-xs group-open:rotate-180 transition-transform" style={{ color: 'var(--text-muted)' }}>▼</span>
                </summary>
                <div className="p-5 prose prose-sm max-w-none markdown-report" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  <ReactMarkdown>{data?.summary || 'No SBAR report available.'}</ReactMarkdown>
                </div>
              </details>

              {/* Staff Notes */}
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Staff Notes (Optional)</h3>
                <textarea className="w-full px-4 py-3 rounded-xl text-sm border resize-none h-24 outline-none transition-colors" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Add any clinical observations or override notes..." value={staffNotes} onChange={e => setStaffNotes(e.target.value)} />
              </section>

              {/* Room Assignment */}
              <section className="p-5 rounded-xl border" style={{ background: 'rgba(217,119,6,0.08)', borderColor: 'rgba(217,119,6,0.2)' }}>
                <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <DoorOpen size={13} /> Room Assignment
                </h3>
                <div className="flex gap-3">
                  <input className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold border outline-none" style={{ background: 'var(--bg-surface)', borderColor: 'rgba(217,119,6,0.3)', color: 'var(--text-primary)' }} placeholder="Room number (e.g. 102)" value={room} onChange={(e) => setRoom(e.target.value)} />
                  <button onClick={() => handleAction('IN_ROOM')} disabled={!room || saving} className="bg-amber-500 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all disabled:opacity-40">Assign</button>
                </div>
              </section>

              {/* Verify Button */}
              <button onClick={() => handleAction('READY')} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-xl text-base font-semibold hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-60">
                {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle size={20} /> Verify & Place in Queue</>}
              </button>
            </div>
          </div>
        </div>

        {/* Printable SBAR */}
        <div className="rounded-2xl border p-8 md:p-10 print-only" style={{ display: 'none', background: 'white' }}>
          <div className="prose prose-sm max-w-none markdown-report">
            <ReactMarkdown>{data?.summary}</ReactMarkdown>
          </div>
          <div className="mt-10 pt-6 border-t border-dashed flex justify-between text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            <div>Physician Signature: ______________________</div>
            <div>Date: {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}