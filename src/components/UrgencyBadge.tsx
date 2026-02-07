import { URGENCY_COLORS } from '@/lib/utils';

export default function UrgencyBadge({ level }: { level: string }) {
  const labels: any = { "1": "Emergent", "2": "Urgent", "3": "Moderate", "4": "Low", "5": "Non-Urgent" };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${URGENCY_COLORS[level] || 'bg-gray-200'}`}>
      Level {level}: {labels[level] || 'Pending'}
    </span>
  );
}