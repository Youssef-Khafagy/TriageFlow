"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import UrgencyBadge from '@/components/UrgencyBadge';
import { ChevronLeft, CheckCircle, Phone, MapPin, DoorOpen, Printer } from 'lucide-react';

export default function StaffReview() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [room, setRoom] = useState('');

  useEffect(() => {
    fetch('/api/staff/sessions')
      .then(res => res.json())
      .then(json => {
        const session = json.find((s: any) => s.id === id);
        setData(session);
        if (session?.room_number) setRoom(session.room_number);
      });
  }, [id]);

  async function handleAction(status: string) {
    const res = await fetch('/api/staff/verify', {
      method: 'PATCH',
      body: JSON.stringify({ 
        sessionId: id, 
        status,
        roomNumber: room,
        urgency: data.urgency_score,
        notes: data.summary
      })
    });

    if (res.ok) {
      router.push('/staff/dashboard');
    }
  }

  const handlePrint = () => window.print();

  if (!data) {
    return (
      <div className="p-10 text-center font-bold">
        Loading patient record...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Global print styles and SBAR styling */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; }
          .sbar-container { border: none !important; box-shadow: none !important; width: 100% !important; padding: 0 !important; }
        }

        /* Elite SBAR Styling */
        .markdown-report h1 {
          @apply text-3xl font-black tracking-tighter border-b-4 border-blue-600 pb-2 mb-8;
        }
        .markdown-report h2, .markdown-report strong {
          @apply text-blue-800 font-black uppercase tracking-widest text-sm;
        }
        .markdown-report hr {
          @apply border-t-2 border-gray-100 my-6;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 no-print">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 font-bold"
          >
            <ChevronLeft size={20} /> Back
          </button>

          <button 
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
          >
            <Printer size={20} /> Print SBAR Report
          </button>
        </div>

        {/* Main Review Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border mb-8 no-print">
          <div
            className={`p-6 text-white flex justify-between items-center ${
              data.urgency_score === '1'
                ? 'bg-red-600 animate-pulse'
                : 'bg-blue-600'
            }`}
          >
            <h1 className="text-2xl font-black">Clinical Triage Review</h1>
            <UrgencyBadge level={data.urgency_score} />
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <section className="bg-gray-50 p-6 rounded-2xl border">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  Demographics
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {data.patient_name || 'N/A'}</p>
                  <p><strong>Age/Sex:</strong> {data.patient_age} / {data.patient_sex}</p>
                  <p className="text-blue-600 font-mono">
                    <strong>Healthcard:</strong> {data.healthcard}
                  </p>
                </div>
              </section>

              <section className="bg-gray-50 p-6 rounded-2xl border">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  Contact Info
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <Phone size={14} /> {data.phone || 'No phone'}
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin size={14} className="mt-1" /> {data.address || 'No address'}
                  </p>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                <h3 className="text-blue-800 font-black uppercase text-xs mb-4">
                  AI Clinical Summary
                </h3>
                <p className="text-blue-900 text-lg italic">
                  "{data.summary}"
                </p>
              </section>

              {/* Room Assignment */}
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                <h3 className="text-amber-800 font-black uppercase text-xs mb-4 flex items-center gap-2">
                  <DoorOpen size={16} /> Room Assignment
                </h3>

                <div className="flex gap-4">
                  <input
                    className="flex-1 p-4 bg-white border border-amber-200 rounded-2xl font-bold text-xl outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter Room Number (e.g. 102)"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                  />

                  <button
                    onClick={() => handleAction('IN_ROOM')}
                    disabled={!room}
                    className="bg-amber-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-amber-600 transition-all disabled:opacity-50"
                  >
                    Send to Room
                  </button>
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={() => handleAction('READY')}
                className="w-full bg-green-600 text-white py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:bg-green-700 shadow-2xl transition-all"
              >
                <CheckCircle size={28} /> Verify & Place in Queue
              </button>
            </div>
          </div>
        </div>

        {/* Printable SBAR Report */}
        <div className="bg-white rounded-[40px] shadow-2xl border p-12 sbar-container print-only">
          {/* Wrap ReactMarkdown in a div to fix className issue */}
          <div className="prose prose-blue prose-lg max-w-none markdown-report">
            <ReactMarkdown>
              {data?.summary}
            </ReactMarkdown>
          </div>

          <div className="mt-12 pt-8 border-t border-dashed flex justify-between text-xs font-black uppercase text-gray-400">
            <div>Physician Signature: ______________________</div>
            <div>Date: {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
