import UrgencyBadge from './UrgencyBadge';

export default function QueueBoard({ sessions }: { sessions: any[] }) {
  return (
    <div className="space-y-3">
      {sessions.map((s) => (
        <div key={s.id} className="flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
              {s.category?.charAt(0) || '?'}
            </div>
            <div>
              <div className="font-bold text-gray-900">{s.category || 'General Triage'}</div>
              <div className="text-xs text-gray-500">Arrived: {new Date(s.created_at).toLocaleTimeString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <UrgencyBadge level={s.urgency_score} />
            <button className="text-blue-600 font-semibold hover:underline">Details</button>
          </div>
        </div>
      ))}
    </div>
  );
}