export type Category = 'general' | 'gym' | 'work' | 'study' | 'health';

export interface Task {
  id: string;
  title: string;
  category: Category;
  time: string;       // "7:00 AM"
  date: string;       // ISO date string "yyyy-MM-dd"
  completed: boolean;
  createdAt: string;  // ISO timestamp
  completedAt?: string;
  priority?: 'low' | 'medium' | 'high';
  description?: string;
}
