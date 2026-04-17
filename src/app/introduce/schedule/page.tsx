import ScheduleTable from '@/components/templates/hospital/ScheduleTable';

const API_BASE = 'http://localhost:8000';

async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function SchedulePage() {
  const schedule = await fetchAPI('/api/hospitals/1/schedule');

  return (
    <>
      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />

      <ScheduleTable schedule={schedule} />
    </>
  );
}
