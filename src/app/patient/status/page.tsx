"use client";
import { useEffect, useState } from 'react';
import { Clock, ShieldCheck, Loader2, UserCheck, CheckCircle2 } from 'lucide-react';
import { getCategoryWaitTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function PatientStatus() {
  const [session, setSession] = useState<any>(null);
  const [queueInfo, setQueueInfo] = useState({ position: 0, waitTime: 0 });
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const checkStatus = async () => {
    const sid = localStorage.getItem('currentSessionId');
    if (!sid) return;

    try {
      const res = await fetch('/api/staff/sessions');
      const allSessions = await res.json();
      const current = allSessions.find((s: any) => s.id === sid);

      // 🔁 Completion redirect (unchanged)
      if (current?.status === 'COMPLETED' && session?.status !== 'COMPLETED') {
        setShowToast(true);
        setTimeout(() => router.push('/'), 4000);
      }

      // ✅ IN_ROOM handling (preserves room_number)
      if (current?.status === 'IN_ROOM') {
        setSession(current);
        return;
      }

      setSession(current);

      // 🟢 Queue logic (unchanged)
      if (current && current.status === 'READY') {
        const readyQueue = allSessions.filter((s: any) => s.status === 'READY');
        const myIndex = readyQueue.findIndex((s: any) => s.id === sid);
        const totalWait = readyQueue
          .slice(0, myIndex)
          .reduce(
            (acc: number, s: any) =>
              acc + getCategoryWaitTime(s.category),
            0
          );

        setQueueInfo({ position: myIndex + 1, waitTime: totalWait });
      }
    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [session]);

  if (loading && !session) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  // ✅ Completion Toast (unchanged)
  if (showToast) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 bg-white">
        <div className="bg-green-600 text-white p-10 rounded-[40px] shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-300">
          <CheckCircle2 size={80} />
          <h2 className="text-3xl font-black">Session Complete</h2>
          <p className="font-medium opacity-90">Redirecting to Home...</p>
        </div>
      </div>
    );
  }

  // ✅ UPDATED: IN ROOM SCREEN (new card-style UI)
  if (session?.status === 'IN_ROOM') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-[40px] shadow-2xl p-12 max-w-lg border border-blue-100 flex flex-col items-center gap-6 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <UserCheck size={40} />
          </div>

          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              It is your turn!
            </h1>
            <p className="text-gray-500 font-medium">
              Please proceed to the station below.
            </p>
          </div>

          <div className="w-full bg-blue-600 p-8 rounded-3xl text-white shadow-lg shadow-blue-200">
            <div className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">
              Assigned Location
            </div>
            <div className="text-6xl font-black">
              {session.room_number
                ? `Room ${session.room_number}`
                : 'Main Care Station'}
            </div>
          </div>

          <p className="text-sm text-gray-400 italic">
            A healthcare provider is waiting for you.
          </p>
        </div>
      </div>
    );
  }

  // ⏳ Reviewing state (unchanged)
  if (!session || session.status !== 'READY') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="text-amber-600" size={40} />
        </div>
        <h1 className="text-2xl font-black mb-2">Report In Process</h1>
        <p className="text-gray-500 max-w-sm mb-6">
          A staff member is verifying your AI-nurse intake summary.
        </p>
        <div className="px-6 py-2 bg-amber-50 rounded-full text-amber-700 text-sm font-bold animate-pulse">
          Status: Reviewing Clinical Data...
        </div>
      </div>
    );
  }

  // 🟢 READY / Queue UI (unchanged)
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <UserCheck className="text-green-600" size={40} />
      </div>
      <h1 className="text-3xl font-black mb-2">You are now in queue</h1>
      <p className="text-gray-500 mb-10">
        Verification complete. Please wait for your position to be called.
      </p>

      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        <div className="p-8 bg-gray-50 rounded-3xl border-2 border-green-100">
          <div className="text-xs text-gray-400 uppercase font-black tracking-widest mb-2">
            Position
          </div>
          <div className="text-5xl font-black text-green-600">
            #{queueInfo.position}
          </div>
        </div>

        <div className="p-8 bg-gray-50 rounded-3xl border-2 border-green-100">
          <div className="text-xs text-gray-400 uppercase font-black tracking-widest mb-2">
            Est. Wait
          </div>
          <div className="text-5xl font-black text-green-600">
            {queueInfo.waitTime}m
          </div>
        </div>
      </div>
    </div>
  );
}
