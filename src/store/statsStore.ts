import { create } from 'zustand';
import type { WeeklyStats } from '@app-types';
import { getDatabase } from '@database/migrations';

interface WeeklyStatsRow {
  id: string;
  week_start: string;
  week_end: string;
  completion_percentage: number;
  tasks_completed: number;
  rewards_unlocked: number;
  best_category: string;
  personal_best: number;
  daily_task_counts: string | null;
}

interface StatsStore {
  weeklyStats: WeeklyStats[];
  selectedWeek: string | null;
  currentWeekIndex: number;
  isLoading: boolean;
  setSelectedWeek: (weekStart: string) => void;
  setCurrentWeekIndex: (index: number) => void;
  loadStats: () => Promise<void>;
  addWeeklyStats: (stats: WeeklyStats) => void;
}

export const useStatsStore = create<StatsStore>((set) => ({
  weeklyStats: [],
  selectedWeek: null,
  currentWeekIndex: 0,
  isLoading: false,
  setSelectedWeek: (weekStart) => set({ selectedWeek: weekStart }),
  setCurrentWeekIndex: (index) => set({ currentWeekIndex: index }),
  loadStats: async () => {
    set({ isLoading: true });
    try {
      const db = await getDatabase();
      const rows = await db.getAllAsync<WeeklyStatsRow>(
        'SELECT * FROM weekly_stats ORDER BY week_start DESC'
      );
      const weeklyStats: WeeklyStats[] = rows.map((row) => ({
        id: row.id,
        weekStart: row.week_start,
        weekEnd: row.week_end,
        completionPercentage: row.completion_percentage,
        tasksCompleted: row.tasks_completed,
        rewardsUnlocked: row.rewards_unlocked,
        bestCategory: row.best_category,
        personalBest: row.personal_best,
        dailyTaskCounts: JSON.parse(row.daily_task_counts ?? '[0,0,0,0,0,0,0]'),
      }));
      set({ weeklyStats });
    } finally {
      set({ isLoading: false });
    }
  },
  addWeeklyStats: (stats) =>
    set((state) => ({ weeklyStats: [...state.weeklyStats, stats] })),
}));
