"use client";
import { useEffect, useState } from 'react';
import UrgencyBadge from '@/components/UrgencyBadge';
import { ChevronLeft, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email) return;

    fetch('/api/staff/sessions') // Reuse existing API but filter on client for demo
      .then(res => res.json())
      .then(data => {
        const myData = data.filter((s: any) => s.patient_email === user.email);
        setReports(myData);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/patient/portal" className="flex items-center text-gray-500 mb-6 hover:text-blue-600 font-bold">
          <ChevronLeft size={20}/> Back to Portal
        </Link>
        <h1 className="text-3xl font-black mb-8 text-gray-900">My Report History</h1>

        {reports.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border shadow-sm">
            <FileText className="mx-auto text-gray-200 mb-4" size={64}/>
            <p className="text-gray-500 font-medium">You haven't submitted any reports yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((r: any) => (
              <div key={r.id} className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Calendar size={24}/></div>
                  <div>
                    <div className="font-bold text-gray-900">{r.category || 'General Consultation'}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase">{new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <UrgencyBadge level={r.urgency_score}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}