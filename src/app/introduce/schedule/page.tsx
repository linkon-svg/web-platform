import ScheduleTable from '@/components/templates/hospital/ScheduleTable';

export default function SchedulePage() {
  return (
    <>
      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />

      <ScheduleTable />
    </>
  );
}
