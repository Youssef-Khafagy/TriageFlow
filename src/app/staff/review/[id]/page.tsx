"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UrgencyBadge from '@/components/UrgencyBadge';
import { ChevronLeft, CheckCircle, User, ShieldCheck } from 'lucide-react';

export default function StaffReview() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/staff/sessions').then(res => res.json()).then(json => {
      const session = json.find((s: any) => s.id === id);
      setData(session);
    });
  }, [id]);

  async function handleVerify() {
    const res = await fetch('/api/staff/verify', {
      method: 'PATCH',
      body: JSON.stringify({ sessionId: id, urgency: data.urgency_score, notes: data.summary })
    });
    if (res.ok) router.push('/staff/dashboard');
  }

  if (!data) return <div className="p-10 text-center">Loading patient record...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center text-gray-500 mb-6 hover:text-blue-600">
          <ChevronLeft size={20} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border">
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">Clinical Triage Review</h1>
            <UrgencyBadge level={data.urgency_score} />
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Patient Data */}
            <div className="space-y-6">
              <section>
                <h3 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-3 flex items-center gap-2">
                  <User size={14}/> Patient Details
                </h3>
                <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border">
                  <p className="text-sm"><strong>Name:</strong> {data.patient_name || 'Not provided'}</p>
                  <p className="text-sm"><strong>Age:</strong> {data.patient_age || 'Unknown'}</p>
                  <p className="text-sm"><strong>Sex:</strong> {data.patient_sex || 'Unknown'}</p>
                  <p className="text-sm text-blue-600 font-mono"><strong>Healthcard:</strong> {data.healthcard || 'N/A'}</p>
                </div>
              </section>
            </div>

            {/* Column 2 & 3: AI Summary & Decision */}
            <div className="md:col-span-2 space-y-6">
              <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-blue-800 font-bold mb-3">AI Clinical Summary</h3>
                <p className="text-blue-900 leading-relaxed italic">"{data.summary}"</p>
              </section>

              <div className="flex gap-4 pt-4">
                <button onClick={handleVerify} className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-green-700 shadow-lg shadow-green-100 transition-all">
                  <CheckCircle size={24} /> Verify & Move to Queue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}