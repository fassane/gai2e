import { useState } from 'react';
import { cn } from '../lib/utils';

type DateDayFilterProps = {
  startDate?: Date;
  daysCount?: number;
  selectedDate?: Date;
  onSelect?: (date: Date) => void;
  // Langue des libellés (jour, mois)
  locale?: string;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Sélecteur de jour sur une période glissante (ex. créneaux de rendez-vous de la semaine)
export default function DateDayFilter({
  startDate = new Date(),
  daysCount = 7,
  selectedDate: selectedDateProp,
  onSelect,
  locale = 'fr-FR',
}: DateDayFilterProps) {
  const days = Array.from({ length: daysCount }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const [internalSelectedDate, setInternalSelectedDate] = useState(days[0]);
  const selectedDate = selectedDateProp ?? internalSelectedDate;

  const handleSelect = (date: Date) => {
    setInternalSelectedDate(date);
    onSelect?.(date);
  };

  const dayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });

  return (
    <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
      {days.map((date) => {
        const isActive = isSameDay(date, selectedDate);
        return (
          <button
            key={date.toISOString()}
            type="button"
            aria-pressed={isActive}
            onClick={() => handleSelect(date)}
            className={cn(
              'flex min-w-19 shrink-0 cursor-pointer flex-col items-center gap-1 rounded-2xl border px-4 py-3 transition-colors',
              isActive
                ? 'border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'bg-card hover:border-primary/30',
            )}
          >
            <span
              className={cn('text-[11px] font-semibold tracking-wide uppercase', !isActive && 'text-muted-foreground')}
            >
              {dayFormatter.format(date).replace('.', '')}
            </span>
            <span className="font-heading text-3xl leading-none font-semibold">{date.getDate()}</span>
            <span className={cn('text-xs', isActive ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
              {monthFormatter.format(date)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
