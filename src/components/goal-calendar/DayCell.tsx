
'use client';

import type React from 'react';
import { Check, X } from 'lucide-react';
import type { DayState } from '@/types';
import { cn } from '@/lib/utils';
import { format, isAfter, startOfDay } from 'date-fns';

interface DayCellProps {
  date: Date;
  state: DayState;
  isCurrentMonth: boolean;
  isTodayFlag: boolean;
  onClick: () => void;
}

export function DayCell({ date, state, isCurrentMonth, isTodayFlag, onClick }: DayCellProps) {
  const dayNumber = format(date, 'd');

  const today = startOfDay(new Date());
  const cellDateStart = startOfDay(date);
  const isFutureDay = isAfter(cellDateStart, today);

  const cellClasses = cn(
    'p-2 aspect-square flex flex-col items-center justify-center border rounded-md transition-all duration-200 ease-in-out',
    isCurrentMonth ? 'bg-card text-card-foreground' : 'bg-muted text-muted-foreground opacity-50',
    isCurrentMonth && !isFutureDay && 'cursor-pointer transform hover:scale-105',
    isTodayFlag && isCurrentMonth && 'ring-2 ring-accent', // Accent is cyan
    state === 'success' && isCurrentMonth && 'bg-primary/20 border-primary', // Primary is cyan
    state === 'fail' && isCurrentMonth && 'bg-destructive/20 border-destructive', // Destructive is dark red
    (!isCurrentMonth || isFutureDay) && 'cursor-not-allowed opacity-75'
  );

  const iconSize = 'w-6 h-6 md:w-8 md:h-8';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cellClasses}
      aria-label={`Date ${format(date, 'MMMM d, yyyy')}, status: ${state}${isFutureDay && isCurrentMonth ? ', future date, cannot be edited' : ''}`}
      aria-pressed={state !== 'empty'}
      disabled={!isCurrentMonth || isFutureDay}
    >
      <span className="text-sm md:text-base font-medium">{dayNumber}</span>
      <div className="mt-1 h-8 w-8 flex items-center justify-center">
        {isCurrentMonth && state === 'success' && <Check className={cn('text-[#4CAF50] opacity-85', iconSize)} />}
        {isCurrentMonth && state === 'fail' && <X className={cn('text-destructive', iconSize)} />} {/* Uses theme's destructive color */}
      </div>
    </button>
  );
}
