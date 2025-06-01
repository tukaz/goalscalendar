
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Goal, GoalData, DayState } from '@/types';
import { AppHeader } from '@/components/layout/AppHeader';
import { CreateGoalDialog } from '@/components/dashboard/CreateGoalDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, CalendarDays, ListChecks, Trash2, Smile, Frown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatDateISO } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

const GOALS_LIST_STORAGE_KEY = 'goalsList';
const GOAL_DATA_LOCAL_STORAGE_KEY_PREFIX = 'goalCalendarData_';

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isGoalsLoaded, setIsGoalsLoaded] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedGoals = localStorage.getItem(GOALS_LIST_STORAGE_KEY);
    if (storedGoals) {
      try {
        setGoals(JSON.parse(storedGoals));
      } catch (e) {
        console.error("Error parsing goals from localStorage", e);
        setGoals([]);
      }
    }
    setIsGoalsLoaded(true);
  }, []);

  const handleCreateGoal = (name: string) => {
    const newName = name.trim();
    if (newName) {
      const newGoal: Goal = {
        id: crypto.randomUUID(),
        name: newName,
      };
      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      localStorage.setItem(GOALS_LIST_STORAGE_KEY, JSON.stringify(updatedGoals));
      router.push(`/goal/${newGoal.id}`);
    }
  };

  const handleDeleteRequest = (goal: Goal) => {
    setGoalToDelete(goal);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (!goalToDelete) return;

    const updatedGoals = goals.filter(g => g.id !== goalToDelete.id);
    setGoals(updatedGoals);
    localStorage.setItem(GOALS_LIST_STORAGE_KEY, JSON.stringify(updatedGoals));

    const goalDataKey = `${GOAL_DATA_LOCAL_STORAGE_KEY_PREFIX}${goalToDelete.id}`;
    localStorage.removeItem(goalDataKey);

    setGoalToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const { metTodayGoals, failedTodayGoals, pendingOrOtherGoals } = useMemo(() => {
    if (!isGoalsLoaded) return { metTodayGoals: [], failedTodayGoals: [], pendingOrOtherGoals: [] };

    const todayISO = formatDateISO(new Date());
    const metToday: Goal[] = [];
    const failedToday: Goal[] = [];
    const pendingOrOthers: Goal[] = [];

    goals.forEach(goal => {
      const goalDataKey = `${GOAL_DATA_LOCAL_STORAGE_KEY_PREFIX}${goal.id}`;
      const storedGoalData = localStorage.getItem(goalDataKey);
      let statusToday: DayState = 'empty'; 

      if (storedGoalData) {
        try {
          const parsedGoalData: GoalData = JSON.parse(storedGoalData);
          if (parsedGoalData[todayISO]) {
            statusToday = parsedGoalData[todayISO];
          }
        } catch (e) {
          console.error(`Error parsing goal data for goal ${goal.id}`, e);
        }
      }

      if (statusToday === 'success') {
        metToday.push(goal);
      } else if (statusToday === 'fail') {
        failedToday.push(goal);
      } else { 
        pendingOrOthers.push(goal);
      }
    });
    return { metTodayGoals: metToday, failedTodayGoals: failedToday, pendingOrOtherGoals: pendingOrOthers };
  }, [goals, isGoalsLoaded]);

  const renderGoalCard = (goal: Goal, type: 'met' | 'failed' | 'pending') => (
    <Card key={goal.id} className={cn(
        "hover:shadow-lg transition-shadow duration-200 flex flex-col",
        type === 'met' && "border-primary", 
        type === 'failed' && "border-destructive"
      )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className={cn(
            "text-xl truncate flex-grow mr-2",
            type === 'met' && "text-primary", 
            type === 'failed' && "text-destructive",
          )} title={goal.name}>
          {goal.name}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive/80 p-1 h-auto w-auto shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleDeleteRequest(goal);
          }}
          aria-label={`Delete goal ${goal.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pt-2 px-4 pb-4">
        {/* Removed subtext */}
        <Link href={`/goal/${goal.id}`} passHref legacyBehavior>
          <Button asChild className="w-full mt-4" variant={type === 'met' ? "default" : "outline"}> 
            <a><CalendarDays className="mr-2 h-5 w-5" /> View Calendar</a>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader goalName="My Goals" />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-primary">Goal Dashboard</h2>
          <CreateGoalDialog onCreateGoal={handleCreateGoal}>
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Goal
            </Button>
          </CreateGoalDialog>
        </div>

        {!isGoalsLoaded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isGoalsLoaded && goals.length === 0 && (
          <Card className="text-center py-12">
            <CardHeader>
              <ListChecks className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <CardTitle className="text-2xl text-muted-foreground">You don't have any goals yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">Start by creating your first goal to track your progress!</p>
              <CreateGoalDialog onCreateGoal={handleCreateGoal}>
                <Button size="lg">
                  <PlusCircle className="mr-2 h-5 w-5" /> Create My First Goal
                </Button>
              </CreateGoalDialog>
            </CardContent>
          </Card>
        )}

        {isGoalsLoaded && goals.length > 0 && (
          <>
            {metTodayGoals.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <Smile className="h-7 w-7 text-[#4CAF50] opacity-85 mr-3" />
                  <h3 className="text-2xl font-semibold text-[#4CAF50] opacity-85">Goals Met Today</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {metTodayGoals.map(goal => renderGoalCard(goal, 'met'))}
                </div>
              </section>
            )}

            {failedTodayGoals.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <Frown className="h-7 w-7 text-destructive mr-3" />
                  <h3 className="text-2xl font-semibold text-destructive">Goals Missed Today</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {failedTodayGoals.map(goal => renderGoalCard(goal, 'failed'))}
                </div>
              </section>
            )}
            
            {pendingOrOtherGoals.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <ListChecks className="h-7 w-7 text-muted-foreground mr-3" />
                  <h3 className="text-2xl font-semibold text-muted-foreground">Other Pending Goals</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingOrOtherGoals.map(goal => renderGoalCard(goal, 'pending'))}
                </div>
              </section>
            )}
             
            {metTodayGoals.length === 0 && failedTodayGoals.length === 0 && pendingOrOtherGoals.length === 0 && goals.length > 0 && (
               <p className="text-muted-foreground text-center">All your goals have been processed.</p>
             )}
          </>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Goal Tracker. Achieve your targets.</p>
      </footer>

      {goalToDelete && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the goal <span className="font-semibold text-foreground">"{goalToDelete.name}"</span> and all its progress data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirmed}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
