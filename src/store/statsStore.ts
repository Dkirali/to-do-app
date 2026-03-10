import { create } from 'zustand';
import type { WeeklyStats } from '@app-types/index';

interface StatsStore {
  weeklyStats: WeeklyStats[];
  selectedWeek: string | null;
  currentWeekIndex: number;
  setSelectedWeek: (weekStart: string) => void;
  setCurrentWeekIndex: (index: number) => void;
  addWeeklyStats: (stats: WeeklyStats) => void;
}

export const useStatsStore = create<StatsStore>((set) => ({
  weeklyStats: [],
  selectedWeek: null,
  currentWeekIndex: 0,
  setSelectedWeek: (weekStart) => set({ selectedWeek: weekStart }),
  setCurrentWeekIndex: (index) => set({ currentWeekIndex: index }),
  addWeeklyStats: (stats) => set((state) => ({ weeklyStats: [...state.weeklyStats, stats] })),
}));
