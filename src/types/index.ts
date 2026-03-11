// ─── Category ────────────────────────────────────────────────────────────────

export type Category = 'general' | 'gym' | 'work' | 'study' | 'health';

// ─── Navigation ──────────────────────────────────────────────────────────────

export type RootTabParamList = {
  Tasks: undefined;
  Goals: undefined;
  Rewards: undefined;
  Stats: undefined;
  Settings: undefined;
};

export type TasksStackParamList = {
  TasksList: undefined;
  TaskDetail: { taskId: string };
};

// ─── Task ─────────────────────────────────────────────────────────────────────

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

// ─── Goal ─────────────────────────────────────────────────────────────────────

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

// ─── Reward ───────────────────────────────────────────────────────────────────

export interface Reward {
  id: string;
  title: string;
  description: string;
  icon: string;       // emoji or Ionicon name
  linkedGoalId?: string;
  isUnlocked: boolean;
  isClaimed: boolean;
  unlockedAt?: string;
  weekStart: string;
}

// ─── WeeklyStats ──────────────────────────────────────────────────────────────

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

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface Settings {
  dailyRemindersEnabled: boolean;
  reminderTime: string;           // "09:00 AM"
  goalProgressUpdates: boolean;
}
