"use client";
import { useEffect, useState } from 'react';
import UrgencyBadge from '@/components/UrgencyBadge';
import Link from 'next/link';
import { Filter, Search, CheckCircle, Clock, Archive, AlertTriangle } from 'lucide-react';

export default function StaffDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('ALL'); 
  const [filterUrgency, setFilterUrgency] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Updated useEffect with async loadData
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/staff/sessions');
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
      }
    };

    loadData(); // Load immediately
    const interval = setInterval(loadData, 5000); // Check for new patients every 5 seconds

    return () => clearInterval(interval); // Stop checking if we leave the page
  }, []);

  const handleComplete = async (session: any) => {
    try {
      const res = await fetch('/api/staff/verify', {
        method: 'PATCH',
        body: JSON.stringify({ 
          sessionId: session.id, 
          status: 'COMPLETED', 
          urgency: session.urgency_score,
          notes: session.summary 
        })
      });
      if (res.ok) setSessions(prev => prev.filter(s => s.id !== session.id));
    } catch (error) {
      console.error("Error completing session:", error);
    }
  };

  // ✅ Send patient to room
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

  // ✅ FIFO: first READY only
  const firstReadySessionId =
    filteredSessions.find(s => s.status === 'READY')?.id;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <style jsx global>{`
        @keyframes pulse-red-bg {
          0% { background-color: rgba(254, 226, 226, 1); }
          50% { background-color: rgba(254, 202, 202, 1); }
          100% { background-color: rgba(254, 226, 226, 1); }
        }
        .animate-critical {
          animation: pulse-red-bg 2s infinite ease-in-out;
          border-left: 6px solid #dc2626 !important;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Live Triage Feed
            </h1>
            <p className="text-gray-500 font-medium">
              Monitor incoming patient intake and verify clinical reports.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              className="pl-10 pr-4 py-2 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-64"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-wrap gap-4 items-center border">
          <div className="flex items-center gap-2 px-3 border-r pr-6">
            <Filter size={18} className="text-gray-400" />
            <span className="text-sm font-bold text-gray-700">Display:</span>
          </div>

          <select
            className="text-sm bg-gray-100 rounded-lg px-4 py-2 font-semibold outline-none cursor-pointer"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Live Feed (Active)</option>
            <option value="SUBMITTED">Pending Review</option>
            <option value="READY">Verified</option>
            <option value="ARCHIVED">Archived / Completed</option>
          </select>

          <select
            className="text-sm bg-gray-100 rounded-lg px-4 py-2 font-semibold outline-none cursor-pointer"
            onChange={(e) => setFilterUrgency(e.target.value)}
          >
            <option value="ALL">All Urgencies</option>
            <option value="1">Level 1: Emergent</option>
            <option value="2">Level 2: Urgent</option>
            <option value="3">Level 3: Moderate</option>
            <option value="4">Level 4: Low</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr className="text-xs uppercase tracking-widest text-gray-400 font-black">
                <th className="p-6">Arrival</th>
                <th className="p-6">Urgency</th>
                <th className="p-6">Category</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredSessions.map((s: any) => (
                <tr
                  key={s.id}
                  className={`transition-colors hover:bg-gray-50 ${
                    s.urgency_score === '1' ? 'animate-critical' : ''
                  }`}
                >
                  <td className="p-6 text-sm font-bold text-gray-600 flex items-center gap-2">
                    {s.urgency_score === '1' && (
                      <AlertTriangle size={16} className="text-red-600 animate-pulse" />
                    )}
                    {new Date(s.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>

                  <td className="p-6">
                    <UrgencyBadge level={s.urgency_score} />
                  </td>

                  <td className="p-6">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-black uppercase">
                      {s.category || 'General'}
                    </span>
                  </td>

                  <td className="p-6">
                    {s.status === 'READY' ? (
                      <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold uppercase">
                        <CheckCircle size={14} /> Verified
                      </span>
                    ) : s.status === 'IN_ROOM' ? (
                      <span className="flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase">
                        <Clock size={14} /> In Room
                      </span>
                    ) : s.status === 'COMPLETED' ? (
                      <span className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase">
                        <Archive size={14} /> Archived
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-500 text-xs font-bold uppercase">
                        <Clock size={14} /> Pending Review
                      </span>
                    )}
                  </td>

                  {/* Action Cell */}
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/staff/review/${s.id}`}
                        className="bg-blue-50 text-blue-600 px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        {s.status === 'IN_ROOM' ? 'Change Room' : 'Review'}
                      </Link>

                      {s.status === 'READY' && s.id === firstReadySessionId && (
                        <button
                          onClick={() => handleSendToRoom(s.id)}
                          className="bg-amber-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-amber-600 transition-all shadow-sm"
                        >
                          Send to Room
                        </button>
                      )}

                      {(s.status === 'READY' || s.status === 'IN_ROOM') && (
                        <button
                          onClick={() => handleComplete(s)}
                          className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-sm flex items-center gap-1"
                        >
                          <CheckCircle size={14} /> Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
