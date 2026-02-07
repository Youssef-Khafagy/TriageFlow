export const URGENCY_COLORS: any = {
  "1": "bg-red-600 text-white",
  "2": "bg-orange-500 text-white",
  "3": "bg-yellow-400 text-black",
  "4": "bg-green-500 text-white",
  "5": "bg-blue-500 text-white",
};

// Map categories to estimated treatment minutes
export const SERVICE_TIMES: Record<string, number> = {
  "Cardiac": 45,
  "Respiratory": 30,
  "Injury": 20,
  "Other": 15
};

export function getCategoryWaitTime(category: string | null): number {
  if (!category) return 15;
  return SERVICE_TIMES[category as keyof typeof SERVICE_TIMES] || 15;
}