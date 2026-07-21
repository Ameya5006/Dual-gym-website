// src/components/ui/TimingsTable.tsx
// SRP: Renders a weekly timings table with Sunday closed highlighted
// Reusable for both gyms

import { GYM_CONTACT } from '../../constants/plans';
import type { GymType } from '../../types';

interface TimingsTableProps {
  gym: GymType;
}

const DAY_LABELS = [
  { key: 'monday',    label: 'Monday' },
  { key: 'tuesday',   label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday',  label: 'Thursday' },
  { key: 'friday',    label: 'Friday' },
  { key: 'saturday',  label: 'Saturday' },
  { key: 'sunday',    label: 'Sunday' },
] as const;

export default function TimingsTable({ gym }: TimingsTableProps) {
  const contact = GYM_CONTACT[gym];
  const isBoxing = gym === 'boxing';
  const accent = isBoxing ? 'text-boxing-red' : 'text-nisha-rose';
  const closedBg = isBoxing ? 'bg-red-950/40' : 'bg-rose-950/40';

  // Get today's day name (lowercase) to highlight current day
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  return (
    <div className="w-full overflow-hidden rounded border border-white/10">
      {/* Header */}
      <div className="grid grid-cols-2 bg-white/5 px-4 py-2 border-b border-white/10">
        <span className="text-white/40 text-xs uppercase tracking-widest font-semibold">Day</span>
        <span className="text-white/40 text-xs uppercase tracking-widest font-semibold">Hours</span>
      </div>

      {DAY_LABELS.map(({ key, label }) => {
        const timing = contact.timings[key];
        const isToday = key === today;
        const isClosed = !timing.open;

        return (
          <div
            key={key}
            className={`grid grid-cols-2 px-4 py-3 border-b border-white/5 last:border-0 transition-all
              ${isClosed ? closedBg : ''}
              ${isToday && !isClosed ? 'bg-white/5' : ''}
            `}
          >
            {/* Day name */}
            <div className="flex items-center gap-2">
              {isToday && !isClosed && (
                <span className={`w-1.5 h-1.5 rounded-full ${isBoxing ? 'bg-boxing-red' : 'bg-nisha-rose'} animate-pulse`} />
              )}
              <span className={`text-sm font-semibold
                ${isClosed ? 'text-white/30' : isToday ? 'text-white' : 'text-white/70'}
              `}>
                {label}
                {isToday && !isClosed && (
                  <span className={`ml-2 text-xs ${accent} font-normal`}>today</span>
                )}
              </span>
            </div>

            {/* Hours or Closed */}
            <div className="flex items-center">
              {isClosed ? (
                <span className="flex items-center gap-1.5 text-sm text-red-400/80 font-semibold">
                  <span className="text-red-500">✕</span> Closed
                </span>
              ) : (
                <span className="text-white/60 text-sm">{timing.hours}</span>
              )}
            </div>
          </div>
        );
      })}

      {/* Sunday note */}
      <div className={`px-4 py-2 ${closedBg} border-t border-white/10`}>
        <p className="text-white/30 text-xs">
          ✕ Closed every Sunday — rest and recovery day
        </p>
      </div>
    </div>
  );
}
