import type { Category } from './task.types';

export interface WeeklyStats {
  id: string;
  weekStart: string;
  weekEnd: string;
  completionPercentage: number;
  tasksCompleted: number;
  rewardsUnlocked: number;
  bestCategory: Category;
  personalBest: number;
  dailyTaskCounts: number[];  // [mon, tue, wed, thu, fri, sat, sun]
}
