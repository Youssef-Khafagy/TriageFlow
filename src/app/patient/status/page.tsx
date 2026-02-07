"use client";
import { useEffect, useState } from 'react';
import { Clock, ShieldCheck, Loader2, UserCheck } from 'lucide-react';
import { getCategoryWaitTime } from '@/lib/utils';

export default function PatientStatus() {
  const [session, setSession] = useState<any>(null);
  const [queueInfo, setQueueInfo] = useState({ position: 0, waitTime: 0 });
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    const sid = localStorage.getItem('currentSessionId');
    if (!sid) return;

    try {
      const res = await fetch('/api/staff/sessions');
      const allSessions = await res.json();
      
      // 1. Find the current user's session
      const current = allSessions.find((s: any) => s.id === sid);
      setSession(current);

      if (current && current.status === 'READY') {
        // 2. Filter for ONLY verified (READY) patients
        const readyQueue = allSessions.filter((s: any) => s.status === 'READY');
        
        // 3. Find our index in that queue
        const myIndex = readyQueue.findIndex((s: any) => s.id === sid);
        
        // 4. Calculate total wait time (Sum of service times of everyone ahead)
        const totalWait = readyQueue
          .slice(0, myIndex)
          .reduce((acc: number, s: any) => acc + getCategoryWaitTime(s.category), 0);

        setQueueInfo({
          position: myIndex + 1,
          waitTime: totalWait
        });
      }
    } catch (error) {
      console.error("Queue Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !session) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  // Processing Stage
  if (!session || session.status !== 'READY') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="text-amber-600" size={40} />
        </div>
        <h1 className="text-2xl font-black mb-2">Report In Process</h1>
        <p className="text-gray-500 max-w-sm mb-6">A staff member is verifying your AI-nurse intake summary.</p>
        <div className="px-6 py-2 bg-amber-50 rounded-full text-amber-700 text-sm font-bold animate-pulse">
          Status: Reviewing Clinical Data...
        </div>
      </div>
    );
  }

  // Verified & In Queue Stage
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <UserCheck className="text-green-600" size={40} />
      </div>
      <h1 className="text-3xl font-black mb-2">You are now in queue</h1>
      <p className="text-gray-500 mb-10">Verification complete. Please wait for your position to be called.</p>
      
      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        <div className="p-8 bg-gray-50 rounded-3xl border-2 border-green-100">
          <div className="text-xs text-gray-400 uppercase font-black tracking-widest mb-2">Position</div>
          <div className="text-5xl font-black text-green-600">#{queueInfo.position}</div>
        </div>
        <div className="p-8 bg-gray-50 rounded-3xl border-2 border-green-100">
          <div className="text-xs text-gray-400 uppercase font-black tracking-widest mb-2">Est. Wait</div>
          <div className="text-5xl font-black text-green-600">{queueInfo.waitTime}m</div>
        </div>
      </div>
    </div>
  );
}