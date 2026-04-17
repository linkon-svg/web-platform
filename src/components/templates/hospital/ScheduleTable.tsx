'use client';

import { useMemo } from 'react';

const DEFAULT_HOURS = [
  { day: '평일', time: '10:00 - 20:30', color: 'text-hospital-dark' },
  { day: '토요일', time: '10:00 - 16:00', color: 'text-hospital-gold-dark' },
  { day: '일요일', time: '10:00 - 16:00', color: 'text-red-500' },
  { day: '공휴일', time: '10:00 - 16:00', color: 'text-red-500' },
  { day: '점심시간', time: '없음', color: 'text-hospital-gray-light' },
];

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; current: boolean }[] = [];

  // Previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, current: false });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, current: true });
  }
  // Next month
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({ day: i, current: false });
  }

  return cells;
}

interface ScheduleData {
  weekday?: string | null;
  saturday?: string | null;
  sunday?: string | null;
  holiday?: string | null;
  lunch_time?: string | null;
}

interface ScheduleTableProps {
  schedule?: ScheduleData | null;
}

function buildHours(schedule?: ScheduleData | null) {
  if (!schedule) return DEFAULT_HOURS;
  return [
    { day: '평일', time: schedule.weekday || '10:00 - 20:30', color: 'text-hospital-dark' },
    { day: '토요일', time: schedule.saturday || '10:00 - 16:00', color: 'text-hospital-gold-dark' },
    { day: '일요일', time: schedule.sunday || '10:00 - 16:00', color: 'text-red-500' },
    { day: '공휴일', time: schedule.holiday || '10:00 - 16:00', color: 'text-red-500' },
    { day: '점심시간', time: schedule.lunch_time || '없음', color: 'text-hospital-gray-light' },
  ];
}

export default function ScheduleTable({ schedule }: ScheduleTableProps) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const monthName = now.toLocaleDateString('en-US', { month: 'long' });
  const cells = useMemo(() => getCalendarDays(year, month), [year, month]);
  const HOURS = useMemo(() => buildHours(schedule), [schedule]);

  return (
    <section className="section-padding bg-white">
      <div className="section-narrow">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-hospital-dark">
            {monthName} Schedule
          </h2>
          <p className="mt-3 text-sm text-hospital-gray">
            예피다의원 진료 스케줄을 안내합니다.
            <br />
            진료시간을 미리 확인하셔서 내원 시 불편 없길 바랍니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Left: Image placeholder + Hours */}
          <div className="space-y-6">
            {/* Space image placeholder */}
            <div className="aspect-[4/3] bg-gradient-to-br from-hospital-beige to-hospital-cream rounded-sm" />

            {/* Hours table */}
            <div className="space-y-2">
              {HOURS.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className={`font-medium ${item.color}`}>{item.day}</span>
                  <span className="text-hospital-gray">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Calendar */}
          <div>
            <div className="text-center mb-4">
              <span className="text-lg font-medium text-hospital-dark">
                {year}.{String(month + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 text-center text-xs text-hospital-gray-light mb-2">
              {DAYS.map((d) => (
                <div key={d} className="py-2">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 text-center text-sm">
              {cells.map((cell, idx) => {
                const isToday = cell.current && cell.day === today;
                const isSunday = idx % 7 === 0;
                const isSaturday = idx % 7 === 6;

                return (
                  <div
                    key={idx}
                    className={`py-3 relative ${
                      cell.current ? '' : 'opacity-30'
                    } ${isSunday ? 'text-red-400' : isSaturday ? 'text-hospital-gold-dark' : 'text-hospital-dark'}`}
                  >
                    {isToday && (
                      <span className="absolute inset-0 m-auto w-8 h-8 rounded-full border-2 border-hospital-gold" />
                    )}
                    <span className="relative">{cell.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
