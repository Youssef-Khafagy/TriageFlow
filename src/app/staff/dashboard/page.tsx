"use client";
import { useEffect, useState } from 'react';
import UrgencyBadge from '@/components/UrgencyBadge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Filter, Search, CheckCircle, Clock, Archive, AlertTriangle, Activity, Users, ClipboardList, DoorOpen } from 'lucide-react';

export default function StaffDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterUrgency, setFilterUrgency] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  // Role guard
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { router.replace('/staff/login'); return; }
    const parsed = JSON.parse(storedUser);
    if (parsed.role !== 'staff') { router.replace('/patient/portal'); return; }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/staff/sessions');
        const data = await response.json();
        setSessions(data);
        setLoaded(true);
      } catch (err) {
        console.error("Live feed error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (session: any) => {
    try {
      const res = await fetch('/api/staff/verify', {
        method: 'PATCH',
        body: JSON.stringify({ sessionId: session.id, status: 'COMPLETED', urgency: session.urgency_score, notes: session.summary })
      });
      if (res.ok) setSessions(prev => prev.filter(s => s.id !== session.id));
    } catch (error) {
      console.error("Error completing session:", error);
    }
  };

  const handleSendToRoom = async (sessionId: string) => {
    try {
      await fetch('/api/staff/verify', {
        method: 'PATCH',
        body: JSON.stringify({ sessionId, status: 'IN_ROOM' })
      });
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'IN_ROOM' } : s));
    } catch (error) {
      console.error("Error sending patient to room:", error);
    }
  };

  const filteredSessions = sessions.filter((s: any) => {
    if (filterStatus === 'ARCHIVED') return s.status === 'COMPLETED';
    if (s.status === 'COMPLETED') return false;
    const statusMatch = filterStatus === 'ALL' || s.status === filterStatus;
    const urgencyMatch = filterUrgency === 'ALL' || s.urgency_score === filterUrgency;
    const searchMatch =
      s.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && urgencyMatch && searchMatch;
  });

  const firstReadySessionId = filteredSessions.find(s => s.status === 'READY')?.id;

  // Accurate counts from ALL sessions (not filtered)
  const pendingReview = sessions.filter(s => s.status === 'SUBMITTED').length;
  const inQueue = sessions.filter(s => s.status === 'READY').length;
  const inRoom = sessions.filter(s => s.status === 'IN_ROOM').length;

  const formatTime = (d: string) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 md:p-8" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Live Triage Feed</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Monitor incoming patient intake and verify clinical reports.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-muted)' }} />
            <input className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none w-full md:w-60 border transition-colors" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Search patients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* ═══ 3 STAT BOXES ═══ */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(217,119,6,0.12)' }}>
                <ClipboardList size={18} className="text-amber-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Pending Review</span>
            </div>
            <div className="text-3xl font-bold text-amber-500" style={{ fontFamily: 'var(--font-display)' }}>{pendingReview}</div>
          </div>

          <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(5,150,105,0.12)' }}>
                <Users size={18} className="text-emerald-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>In Queue</span>
            </div>
            <div className="text-3xl font-bold text-emerald-500" style={{ fontFamily: 'var(--font-display)' }}>{inQueue}</div>
          </div>

          <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-light)' }}>
                <DoorOpen size={18} style={{ color: 'var(--color-primary)' }} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>In Room</span>
            </div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{inRoom}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 rounded-xl mb-4 flex flex-wrap gap-3 items-center border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-1.5 px-3 pr-4" style={{ borderRight: '1px solid var(--border-color)' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Filter</span>
          </div>
          <select className="text-xs rounded-lg px-3 py-1.5 font-semibold outline-none cursor-pointer border" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">Active Feed</option>
            <option value="SUBMITTED">Pending Review</option>
            <option value="READY">Verified</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select className="text-xs rounded-lg px-3 py-1.5 font-semibold outline-none cursor-pointer border" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} onChange={(e) => setFilterUrgency(e.target.value)}>
            <option value="ALL">All Urgencies</option>
            <option value="1">Emergent</option>
            <option value="2">Urgent</option>
            <option value="3">Moderate</option>
            <option value="4">Low</option>
          </select>
          <div className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live · {sessions.length} total
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
          {filteredSessions.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="mx-auto mb-3" size={40} style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{loaded ? 'No patients matching filters' : 'Loading...'}</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead style={{ borderBottom: '1px solid var(--border-color)' }}>
                <tr className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Urgency</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((s: any) => (
                  <tr key={s.id} className={`transition-all hover:brightness-95 ${s.urgency_score === '1' ? 'animate-critical-row' : ''}`} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {s.urgency_score === '1' && <AlertTriangle size={14} className="text-red-500 animate-pulse flex-shrink-0" />}
                        <div>
                          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.patient_name || 'Unknown'}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatTime(s.created_at)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><UrgencyBadge level={s.urgency_score} /></td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>{s.category || 'General'}</span>
                    </td>
                    <td className="px-5 py-4">
                      {s.status === 'READY' ? (
                        <span className="flex items-center gap-1 text-emerald-500 text-[11px] font-bold"><CheckCircle size={13} /> Verified</span>
                      ) : s.status === 'IN_ROOM' ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: 'var(--color-primary)' }}><Activity size={13} /> In Room</span>
                      ) : s.status === 'COMPLETED' ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}><Archive size={13} /> Archived</span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-500 text-[11px] font-bold"><Clock size={13} /> Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/staff/review/${s.id}`} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:brightness-110" style={{ borderColor: 'var(--border-color)', color: 'var(--color-primary)', background: 'var(--color-primary-light)' }}>
                          Review
                        </Link>
                        {s.status === 'READY' && s.id === firstReadySessionId && (
                          <button onClick={() => handleSendToRoom(s.id)} className="bg-amber-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-amber-600 transition-all">Send to Room</button>
                        )}
                        {(s.status === 'READY' || s.status === 'IN_ROOM') && (
                          <button onClick={() => handleComplete(s)} className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-all flex items-center gap-1"><CheckCircle size={12} /> Complete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}