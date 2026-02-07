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

    fetch('/api/staff/sessions') 
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
        <Link href="/patient/portal" className="flex items-center text-gray-500 mb-6 hover:text-blue-600 font-bold no-print">
          <ChevronLeft size={20}/> Back to Portal
        </Link>
        <h1 className="text-3xl font-black mb-8 text-gray-900 no-print">My Report History</h1>

        {reports.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border shadow-sm no-print">
            <FileText className="mx-auto text-gray-200 mb-4" size={64}/>
            <p className="text-gray-500 font-medium">You haven't submitted any reports yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((r: any) => (
              <div key={r.id} className="bg-white p-6 rounded-2xl border shadow-sm space-y-4 break-inside-avoid">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Calendar size={24}/></div>
                    <div>
                      <div className="font-bold text-gray-900">{r.category || 'General Consultation'}</div>
                      <div className="text-xs text-gray-400 font-bold uppercase">{new Date(r.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <UrgencyBadge level={r.urgency_score}/>
                     <button 
                       onClick={() => window.print()} 
                       className="text-blue-600 font-bold text-sm hover:underline no-print"
                     >
                       Download PDF
                     </button>
                  </div>
                </div>

                {/* Expanded Clinical Details */}
                <div className="bg-gray-50 p-4 rounded-xl text-sm border-l-4 border-blue-400">
                  <p className="font-bold text-blue-800 mb-1">Clinical Summary:</p>
                  <p className="italic text-gray-600 leading-relaxed">"{r.summary || 'Summary pending clinical review.'}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Print logic to keep PDFs clean */}
      <style jsx global>{`
        @media print {
          .no-print, nav, .ChevronLeft { display: none !important; }
          body { background-color: white !important; }
          .bg-white { border: 1px solid #e5e7eb !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}