import {
  format,
  addMonths as dfAddMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay as dfIsSameDay,
  isToday as dfIsToday,
  parseISO,
  isValid
} from 'date-fns';

export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function parseDateISO(dateString: string): Date | null {
  const parsed = parseISO(dateString);
  return isValid(parsed) ? parsed : null;
}

export function getMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function addMonths(date: Date, amount: number): Date {
  return dfAddMonths(date, amount);
}

export function getCalendarMonthDays(date: Date): { dateObj: Date, isCurrentMonth: boolean }[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return days.map(day => ({
    dateObj: day,
    isCurrentMonth: isSameMonth(day, monthStart),
  }));
}

export function getDayOfWeekHeaders(): string[] {
  // Assuming week starts on Sunday
  const weekStart = startOfWeek(new Date());
  return eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart) }).map(day => format(day, 'E')); // 'E' gives short day name like 'Sun'
}


export function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return dfIsSameDay(date1, date2);
}

export function isToday(date: Date | null): boolean {
  if (!date) return false;
  return dfIsToday(date);
}
