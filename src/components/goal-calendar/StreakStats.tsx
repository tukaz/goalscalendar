'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Sparkles } from 'lucide-react';

interface StreakStatsProps {
  longestStreak: number;
  currentStreak: number;
}

export function StreakStats({ longestStreak, currentStreak }: StreakStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
          <TrendingUp className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{longestStreak} day{longestStreak !== 1 && 's'}</div>
          <p className="text-xs text-muted-foreground">
            Your all-time best consecutive success.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Sparkles className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStreak} day{currentStreak !== 1 && 's'}</div>
          <p className="text-xs text-muted-foreground">
            Your current run of success up to today.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
