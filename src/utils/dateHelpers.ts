import { startOfWeek, endOfWeek, format, addWeeks, subWeeks, isThisWeek } from 'date-fns';

export function getCurrentWeekStart(): string {
  return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
}

export function getCurrentWeekEnd(): string {
  return format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
}

export function getWeekStart(date: Date): string {
  return format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
}

export function getWeekLabel(weekStart: string): string {
  const start = new Date(weekStart);
  const end = endOfWeek(start, { weekStartsOn: 1 });
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
}

export function getDaysOfWeek(weekStart: string): string[] {
  const start = new Date(weekStart);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return format(d, 'yyyy-MM-dd');
  });
}

export function formatTime(isoDate: string): string {
  return format(new Date(isoDate), 'h:mm a');
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}
