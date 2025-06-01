'use client';

import type React from 'react';
import type { GoalData, DayState } from '@/types';
import { getCalendarMonthDays, getDayOfWeekHeaders, formatDateISO, isToday as checkIsToday } from '@/lib/dateUtils';
import { DayCell } from './DayCell';

interface CalendarGridProps {
  currentDisplayMonth: Date;
  goalData: GoalData;
  onDayClick: (date: Date, currentState: DayState) => void;
}

export function CalendarGrid({ currentDisplayMonth, goalData, onDayClick }: CalendarGridProps) {
  const days = getCalendarMonthDays(currentDisplayMonth);
  const dayHeaders = getDayOfWeekHeaders();

  return (
    <div className="bg-card p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm font-semibold text-muted-foreground">
        {dayHeaders.map(header => (
          <div key={header} className="p-2">{header}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {days.map(({ dateObj, isCurrentMonth }) => {
          const dateString = formatDateISO(dateObj);
          const state = goalData[dateString] || 'empty';
          const isTodayFlag = checkIsToday(dateObj);
          
          return (
            <DayCell
              key={dateString}
              date={dateObj}
              state={state as DayState}
              isCurrentMonth={isCurrentMonth}
              isTodayFlag={isTodayFlag}
              onClick={() => onDayClick(dateObj, state as DayState)}
            />
          );
        })}
      </div>
    </div>
  );
}
