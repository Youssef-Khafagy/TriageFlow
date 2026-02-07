"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UrgencyBadge from '@/components/UrgencyBadge';
import { ChevronLeft, CheckCircle, User, ShieldCheck, Phone, MapPin, Activity, Printer } from 'lucide-react';

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

  function handlePrint() { window.print(); }

  async function handleVerify() {
    const res = await fetch('/api/staff/verify', {
      method: 'PATCH',
      body: JSON.stringify({ sessionId: id, urgency: data.urgency_score, notes: data.summary })
    });
    if (res.ok) router.push('/staff/dashboard');
  }

  if (!data) return <div className="p-10 text-center font-bold text-gray-400">Loading comprehensive medical record...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-blue-600 font-bold no-print">
          <ChevronLeft size={20} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border">
          <div className={`p-6 text-white flex justify-between items-center ${data.urgency_score === '1' ? 'bg-red-600 animate-pulse' : 'bg-blue-600'}`}>
            <div className="flex items-center gap-3"><ShieldCheck size={28} /><h1 className="text-2xl font-black">Clinical Triage Review</h1></div>
            <UrgencyBadge level={data.urgency_score} />
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <section className="bg-gray-50 p-6 rounded-2xl border">
                <h3 className="text-gray-400 uppercase text-xs font-black tracking-widest mb-4 flex items-center gap-2"><User size={14}/> Demographics</h3>
                <div className="space-y-3">
                  <p className="text-sm"><strong>Full Name:</strong> {data.patient_name || 'Not provided'}</p>
                  <p className="text-sm"><strong>Age/Sex:</strong> {data.patient_age} / {data.patient_sex}</p>
                  <p className="text-sm text-blue-600 font-mono font-bold"><strong>Healthcard:</strong> {data.healthcard || 'N/A'}</p>
                </div>
              </section>

              <section className="bg-gray-50 p-6 rounded-2xl border">
                <h3 className="text-gray-400 uppercase text-xs font-black tracking-widest mb-4 flex items-center gap-2"><Phone size={14}/> Contact & History</h3>
                <div className="space-y-4">
                  <p className="text-sm"><strong>Phone:</strong> {data.phone || 'N/A'}</p>
                  <p className="text-sm"><strong>Address:</strong> {data.address || 'N/A'}</p>
                  <div className="pt-3 border-t">
                    <p className="text-xs font-bold text-red-500 uppercase">Allergies: <span className="text-gray-900">{data.allergies || 'None'}</span></p>
                    <p className="text-xs font-bold text-blue-500 uppercase mt-1">Disabilities: <span className="text-gray-900">{data.disabilities || 'None'}</span></p>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <section className="bg-blue-50 p-8 rounded-3xl border border-blue-100 relative">
                <Activity className="absolute right-6 top-6 text-blue-200" size={40} />
                <h3 className="text-blue-800 font-black uppercase text-xs mb-4">AI Clinical Summary</h3>
                <p className="text-blue-900 text-lg italic font-medium">"{data.summary}"</p>
              </section>

              <div className="flex gap-4 pt-4 no-print">
                <button onClick={handlePrint} className="bg-gray-800 text-white px-8 py-5 rounded-3xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"><Printer size={20}/> Save PDF</button>
                <button onClick={handleVerify} className="flex-1 bg-green-600 text-white py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:bg-green-700 shadow-2xl transition-all"><CheckCircle size={28} /> Verify & Move to Queue</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`@media print {.no-print, nav { display: none !important; }.bg-white { border: none !important; box-shadow: none !important; }}`}</style>
    </div>
  );
}