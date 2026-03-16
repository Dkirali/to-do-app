import type { Category } from './task.types';

export interface Goal {
  id: string;
  title: string;
  category: Category;
  targetType: 'tasks' | 'hours';
  targetValue: number;
  currentValue: number;
  rewardId?: string;
  weekStart: string;  // ISO date "yyyy-MM-dd"
  motivationText?: string;
}
