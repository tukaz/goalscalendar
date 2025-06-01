
export type DayState = 'empty' | 'success' | 'fail';

export interface GoalData {
  [date: string]: DayState; // Date format: "YYYY-MM-DD"
}

export interface Goal {
  id: string;
  name: string;
}
