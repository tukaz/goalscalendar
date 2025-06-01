
'use client';

import type React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { getMonthYear } from '@/lib/dateUtils';

interface CalendarControlsProps {
  currentDisplayMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  monthlySummary: { success: number; fail: number };
}

export function CalendarControls({
  currentDisplayMonth,
  onPrevMonth,
  onNextMonth,
  monthlySummary,
}: CalendarControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 mb-4 bg-card rounded-lg shadow">
      <div className="flex items-center mb-4 sm:mb-0">
        <Button variant="outline" size="icon" onClick={onPrevMonth} aria-label="Previous month">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl md:text-2xl font-semibold mx-4 text-center w-48">
          {getMonthYear(currentDisplayMonth)}
        </h2>
        <Button variant="outline" size="icon" onClick={onNextMonth} aria-label="Next month">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center space-x-4 text-sm md:text-base">
        <div className="flex items-center" title="Successful days this month">
          <CheckCircle className="h-5 w-5 text-[#4CAF50] opacity-85 mr-1" />
          <span>{monthlySummary.success}</span>
        </div>
        <div className="flex items-center" title="Failed days this month">
          <XCircle className="h-5 w-5 text-destructive mr-1" />
          <span>{monthlySummary.fail}</span>
        </div>
      </div>
    </div>
  );
}
