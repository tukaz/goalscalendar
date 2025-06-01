
'use client';

import React from 'react';
import { useGoalData } from '@/hooks/useGoalData';
import { CalendarControls } from './CalendarControls';
import { CalendarGrid } from './CalendarGrid';
import { StreakStats } from './StreakStats';
import { Skeleton } from '@/components/ui/skeleton';

interface GoalCalendarProps {
  goalId: string | null;
}

export function GoalCalendar({ goalId }: GoalCalendarProps) {
  const {
    goalData,
    setDayState,
    currentDisplayMonth,
    navigateMonth,
    longestStreak,
    currentStreak,
    monthlySummary,
    isLoaded,
  } = useGoalData(goalId);

  if (!isLoaded || !goalId) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Skeleton className="h-16 w-full mb-4" /> {/* Controls */}
        <Skeleton className="h-10 w-full mb-2" /> {/* Day headers */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-24 w-full" /> {/* Streak card */}
          <Skeleton className="h-24 w-full" /> {/* Streak card */}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 sm:p-4 max-w-4xl">
      <CalendarControls
        currentDisplayMonth={currentDisplayMonth}
        onPrevMonth={() => navigateMonth(-1)}
        onNextMonth={() => navigateMonth(1)}
        monthlySummary={monthlySummary}
      />
      <CalendarGrid
        currentDisplayMonth={currentDisplayMonth}
        goalData={goalData}
        onDayClick={setDayState}
      />
      <StreakStats
        longestStreak={longestStreak}
        currentStreak={currentStreak}
      />
    </div>
  );
}
