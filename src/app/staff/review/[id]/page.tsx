"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UrgencyBadge from '@/components/UrgencyBadge';
import { ChevronLeft, CheckCircle, Phone, MapPin, DoorOpen } from 'lucide-react';

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
        roomNumber: room, // persist room assignment
        urgency: data.urgency_score,
        notes: data.summary
      })
    });

    if (res.ok) {
      router.push('/staff/dashboard');
    }
  }

  if (!data) {
    return (
      <div className="p-10 text-center font-bold">
        Loading patient record...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 mb-6 hover:text-blue-600 font-bold no-print"
        >
          <ChevronLeft size={20} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border">
          {/* Header */}
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
      </div>
    </div>
  );
}
