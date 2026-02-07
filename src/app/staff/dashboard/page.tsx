"use client";
import { useEffect, useState } from 'react';
import UrgencyBadge from '@/components/UrgencyBadge';
import Link from 'next/link';
import { Filter, Search, CheckCircle, Clock } from 'lucide-react';

export default function StaffDashboard() {
  const [sessions, setSessions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, SUBMITTED (Pending), READY (Verified)
  const [filterUrgency, setFilterUrgency] = useState('ALL');

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/staff/sessions');
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (session: any) => {
    try {
      const res = await fetch('/api/staff/verify', {
        method: 'PATCH',
        body: JSON.stringify({ 
          sessionId: session.id, 
          status: 'COMPLETED', // This marks them as done
          urgency: session.urgency_score,
          notes: session.summary 
        })
      });
      if (res.ok) {
        // Immediately refresh the list so the UI updates
        fetchSessions();
      }
    } catch (error) {
      console.error("Error completing session:", error);
    }
  };

  const filteredSessions = sessions.filter((s: any) => {
    // We only want to show patients currently in the intake or waiting phase
    // COMPLETED patients should be hidden from the live feed
    if (s.status === 'COMPLETED') return false;

    const statusMatch = filterStatus === 'ALL' || s.status === filterStatus;
    const urgencyMatch = filterUrgency === 'ALL' || s.urgency_score === filterUrgency;
    return statusMatch && urgencyMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Live Triage Feed</h1>
            <p className="text-gray-500">Monitor incoming patient intake and verify clinical reports.</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-wrap gap-4 items-center border">
          <div className="flex items-center gap-2 px-3 border-r pr-6">
            <Filter size={18} className="text-gray-400" />
            <span className="text-sm font-bold text-gray-700">Display:</span>
          </div>
          
          <select 
            className="text-sm bg-gray-100 rounded-lg px-4 py-2 font-semibold focus:ring-2 focus:ring-blue-500 outline-none border-none cursor-pointer"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Pending Verification</option>
            <option value="READY">Verified</option>
          </select>

          <select 
            className="text-sm bg-gray-100 rounded-lg px-4 py-2 font-semibold focus:ring-2 focus:ring-blue-500 outline-none border-none cursor-pointer"
            onChange={(e) => setFilterUrgency(e.target.value)}
          >
            <option value="ALL">All Urgencies</option>
            <option value="1">Level 1: Emergent</option>
            <option value="2">Level 2: Urgent</option>
            <option value="3">Level 3: Moderate</option>
            <option value="4">Level 4: Low</option>
          </select>
        </div>

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
              {filteredSessions.length > 0 ? (
                filteredSessions.map((s: any) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 text-sm font-medium text-gray-600">
                      {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-6"><UrgencyBadge level={s.urgency_score} /></td>
                    <td className="p-6">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                        {s.category || 'General'}
                      </span>
                    </td>
                    <td className="p-6">
                      {s.status === 'READY' ? (
                        <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold uppercase tracking-tight">
                          <CheckCircle size={14} /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-amber-500 text-xs font-bold uppercase tracking-tight">
                          <Clock size={14} /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/staff/review/${s.id}`} 
                          className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          Review
                        </Link>
                        
                        {/* Only show "Complete" button if patient is verified/waiting */}
                        {s.status === 'READY' && (
                          <button 
                            onClick={() => handleComplete(s)}
                            className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-sm flex items-center gap-1"
                          >
                            <CheckCircle size={14} /> Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 font-medium italic">
                    No matching triage records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}