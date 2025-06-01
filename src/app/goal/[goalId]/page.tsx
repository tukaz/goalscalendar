
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoalCalendar } from '@/components/goal-calendar/GoalCalendar';
import { AppHeader } from '@/components/layout/AppHeader';
import { SetGoalNameDialog } from '@/components/goal-calendar/SetGoalNameDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Goal } from '@/types';
import { ChevronLeft } from 'lucide-react';

const GOALS_LIST_STORAGE_KEY = 'goalsList';

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = typeof params.goalId === 'string' ? params.goalId : null;

  const [goalName, setGoalName] = useState<string | null>(null);
  const [isGoalDetailsLoaded, setIsGoalDetailsLoaded] = useState(false);

  useEffect(() => {
    if (goalId) {
      const storedGoals = localStorage.getItem(GOALS_LIST_STORAGE_KEY);
      if (storedGoals) {
        try {
          const goals: Goal[] = JSON.parse(storedGoals);
          const currentGoal = goals.find(g => g.id === goalId);
          if (currentGoal) {
            setGoalName(currentGoal.name);
          } else {
            console.warn(`Goal with id ${goalId} not found.`);
            router.push('/'); 
          }
        } catch (e) {
          console.error("Error parsing goals from localStorage", e);
          router.push('/');
        }
      } else {
         router.push('/');
      }
    }
    setIsGoalDetailsLoaded(true);
  }, [goalId, router]);

  const handleSetGoalName = useCallback((name: string) => {
    if (!goalId) return;
    const newName = name.trim();
    if (newName) {
      const storedGoals = localStorage.getItem(GOALS_LIST_STORAGE_KEY);
      let goals: Goal[] = [];
      if (storedGoals) {
        try {
          goals = JSON.parse(storedGoals);
        } catch (e) {
          console.error("Error parsing goals from localStorage for update", e);
          return; 
        }
      }
      const goalIndex = goals.findIndex(g => g.id === goalId);
      if (goalIndex !== -1) {
        goals[goalIndex].name = newName;
        localStorage.setItem(GOALS_LIST_STORAGE_KEY, JSON.stringify(goals));
        setGoalName(newName);
      }
    }
  }, [goalId]);

  if (!isGoalDetailsLoaded || !goalId) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader goalName={null} />
        <main className="flex-grow container mx-auto p-4">
          <Skeleton className="h-8 w-1/4 mb-4" /> {/* Back button placeholder */}
          <Skeleton className="h-10 w-3/4 mb-6" /> {/* Goal title placeholder */}
          <div className="container mx-auto p-4 max-w-4xl">
            <Skeleton className="h-16 w-full mb-4" /> {/* Controls */}
            <Skeleton className="h-10 w-full mb-2" /> {/* Day headers */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader goalName={goalName} />
      <main className="flex-grow container mx-auto p-4">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" passHref>
            <Button variant="outline" className="w-full sm:w-auto">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          {goalName && (
             <SetGoalNameDialog currentGoalName={goalName} onSetGoalName={handleSetGoalName}>
                <Button variant="secondary" className="w-full sm:w-auto">
                  Edit Goal Name
                </Button>
              </SetGoalNameDialog>
          )}
        </div>
        
        {goalName ? (
            <h2 className="text-2xl font-semibold text-foreground text-center sm:text-left mb-6">Progress for: <span className="text-primary">{goalName}</span></h2>
        ) : (
            <Skeleton className="h-8 w-1/2 mb-6" />
        )}

        <GoalCalendar goalId={goalId} />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Goal Tracker. Keep track of your progress.</p>
      </footer>
    </div>
  );
}
