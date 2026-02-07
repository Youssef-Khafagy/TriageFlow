"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, History, Lock } from 'lucide-react';

export default function PatientPortal() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Patient Portal</h1>
        <p className="text-gray-500 mb-10">Manage your ER intake reports and history.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Create New Report */}
          <Link href="/patient/chat" className="group bg-white p-8 rounded-3xl border-2 border-transparent hover:border-blue-600 transition-all shadow-sm">
            <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
              <PlusCircle className="text-blue-600 group-hover:text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Create a New Report</h2>
            <p className="text-gray-500">Start an AI-guided intake to describe your current symptoms.</p>
          </Link>

          {/* Box 2: My Reports */}
          {user ? (
            <Link href="/patient/reports" className="group bg-white p-8 rounded-3xl border-2 border-transparent hover:border-indigo-600 transition-all shadow-sm">
              <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                <History className="text-indigo-600 group-hover:text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">My Reports</h2>
              <p className="text-gray-500">View and track your previous triage submissions.</p>
            </Link>
          ) : (
            <div className="bg-gray-100 p-8 rounded-3xl border-2 border-dashed border-gray-300 relative overflow-hidden grayscale">
              <div className="bg-gray-200 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="text-gray-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-400">My Reports</h2>
              <p className="text-gray-400">Login required to view report history.</p>
              <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                <Link href="/login" className="bg-gray-800 text-white px-6 py-2 rounded-xl font-bold text-sm">Login to Unlock</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}