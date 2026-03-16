import { create } from 'zustand';
import type { Goal } from '@app-types';
import {
  getGoalsByWeek,
  insertGoal,
  updateGoalProgress as dbUpdateGoalProgress,
  deleteGoal as dbDeleteGoal,
} from '@database/queries/goalQueries';

interface GoalStore {
  goals: Goal[];
  isLoading: boolean;
  loadGoals: (weekStart: string) => Promise<void>;
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => Promise<void>;
  updateProgress: (id: string, increment: number) => Promise<void>;
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: [],
  isLoading: false,
  loadGoals: async (weekStart) => {
    set({ isLoading: true });
    try {
      const goals = await getGoalsByWeek(weekStart);
      set({ goals });
    } finally {
      set({ isLoading: false });
    }
  },
  addGoal: async (goal) => {
    await insertGoal(goal);
    set((state) => ({ goals: [...state.goals, goal] }));
  },
  updateGoal: (id, updates) =>
    set((state) => ({ goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)) })),
  deleteGoal: async (id) => {
    await dbDeleteGoal(id);
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
  },
  updateProgress: async (id, increment) => {
    const goal = get().goals.find((g) => g.id === id);
    if (!goal) return;
    const newValue = Math.min(goal.currentValue + increment, goal.targetValue);
    await dbUpdateGoalProgress(id, newValue);
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, currentValue: newValue } : g
      ),
    }));
  },
}));
