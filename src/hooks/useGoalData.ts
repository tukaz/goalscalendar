
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DayState, GoalData } from '@/types';
import { formatDateISO, addMonths, parseDateISO } from '@/lib/dateUtils';
import { differenceInCalendarDays } from 'date-fns';

const LOCAL_STORAGE_KEY_PREFIX = 'goalCalendarData_';

export function useGoalData(goalId: string | null) {
  const [goalData, setGoalData] = useState<GoalData>({});
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState<Date>(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  const getLocalStorageKey = useCallback(() => {
    return goalId ? `${LOCAL_STORAGE_KEY_PREFIX}${goalId}` : null;
  }, [goalId]);

  useEffect(() => {
    if (!goalId) {
      setIsLoaded(true);
      setGoalData({}); // Reset data if no goalId
      return;
    }
    const storageKey = getLocalStorageKey();
    if (!storageKey) return;

    try {
      const storedData = localStorage.getItem(storageKey);
      if (storedData) {
        setGoalData(JSON.parse(storedData));
      } else {
        setGoalData({}); // Initialize if no data found
      }
    } catch (error) {
      console.error("Failed to load goal data from localStorage:", error);
      setGoalData({});
    }
    setIsLoaded(true);
  }, [goalId, getLocalStorageKey]);

  useEffect(() => {
    if (isLoaded && goalId) {
      const storageKey = getLocalStorageKey();
      if (!storageKey) return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(goalData));
      } catch (error) {
        console.error("Failed to save goal data to localStorage:", error);
      }
    }
  }, [goalData, isLoaded, goalId, getLocalStorageKey]);

  const setDayState = useCallback((date: Date, currentState: DayState) => {
    if (!goalId) return; // Do nothing if no goalId

    const dateString = formatDateISO(date);
    let nextState: DayState = 'empty';
    if (currentState === 'empty') nextState = 'success';
    else if (currentState === 'success') nextState = 'fail';
    else if (currentState === 'fail') nextState = 'empty';

    setGoalData(prevData => {
      const newData = { ...prevData };
      if (nextState === 'empty') {
        delete newData[dateString];
      } else {
        newData[dateString] = nextState;
      }
      return newData;
    });
  }, [goalId]);

  const navigateMonth = useCallback((offset: number) => {
    setCurrentDisplayMonth(prevMonth => addMonths(prevMonth, offset));
  }, []);

  const streaks = useMemo(() => {
    if (!isLoaded || !goalId) return { longestStreak: 0, currentStreak: 0 };

    const successDates = Object.entries(goalData)
      .filter(([, state]) => state === 'success')
      .map(([dateStr]) => parseDateISO(dateStr))
      .filter((date): date is Date => date !== null)
      .sort((a, b) => a.getTime() - b.getTime());

    let longestStreak = 0;
    let currentOverallStreak = 0;

    if (successDates.length > 0) {
      longestStreak = 1;
      currentOverallStreak = 1;
      for (let i = 1; i < successDates.length; i++) {
        if (differenceInCalendarDays(successDates[i], successDates[i - 1]) === 1) {
          currentOverallStreak++;
        } else {
          currentOverallStreak = 1;
        }
        if (currentOverallStreak > longestStreak) {
          longestStreak = currentOverallStreak;
        }
      }
    } else {
      longestStreak = 0;
    }
    
    let currentStreakFromToday = 0;
    let checkDate = new Date();
    checkDate.setHours(0,0,0,0);

    // Iterate backwards from today
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const dateStr = formatDateISO(checkDate);
        if (goalData[dateStr] === 'success') {
            currentStreakFromToday++;
            const newCheckDate = new Date(checkDate); // Create new date object
            newCheckDate.setDate(newCheckDate.getDate() - 1);
            checkDate = newCheckDate;
        } else {
            const todayStr = formatDateISO(new Date());
            if (goalData[todayStr] !== 'success') {
                currentStreakFromToday = 0;
            }
            break; 
        }
    }

    return { longestStreak, currentStreak: currentStreakFromToday };
  }, [goalData, isLoaded, goalId]);

  const monthlySummary = useMemo(() => {
    if (!isLoaded || !goalId) return { success: 0, fail: 0 };

    let successCount = 0;
    let failCount = 0;
    const year = currentDisplayMonth.getFullYear();
    const month = currentDisplayMonth.getMonth();

    Object.entries(goalData).forEach(([dateStr, state]) => {
      const date = parseDateISO(dateStr);
      if (date && date.getFullYear() === year && date.getMonth() === month) {
        if (state === 'success') successCount++;
        else if (state === 'fail') failCount++;
      }
    });
    return { success: successCount, fail: failCount };
  }, [goalData, currentDisplayMonth, isLoaded, goalId]);

  return {
    goalData,
    setDayState,
    currentDisplayMonth,
    navigateMonth,
    longestStreak: streaks.longestStreak,
    currentStreak: streaks.currentStreak,
    monthlySummary,
    isLoaded,
  };
}
