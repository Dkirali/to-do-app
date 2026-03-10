import { create } from 'zustand';
import type { Reward } from '@app-types/index';

interface RewardStore {
  rewards: Reward[];
  addReward: (reward: Reward) => void;
  updateReward: (id: string, updates: Partial<Reward>) => void;
  deleteReward: (id: string) => void;
  claimReward: (id: string) => void;
  checkAndUnlock: (goalId: string) => void;
}

export const useRewardStore = create<RewardStore>((set) => ({
  rewards: [],
  addReward: (reward) => set((state) => ({ rewards: [...state.rewards, reward] })),
  updateReward: (id, updates) =>
    set((state) => ({ rewards: state.rewards.map((r) => (r.id === id ? { ...r, ...updates } : r)) })),
  deleteReward: (id) => set((state) => ({ rewards: state.rewards.filter((r) => r.id !== id) })),
  claimReward: (id) =>
    set((state) => ({
      rewards: state.rewards.map((r) => (r.id === id ? { ...r, isClaimed: true } : r)),
    })),
  checkAndUnlock: (goalId) =>
    set((state) => ({
      rewards: state.rewards.map((r) =>
        r.linkedGoalId === goalId && !r.isUnlocked
          ? { ...r, isUnlocked: true, unlockedAt: new Date().toISOString() }
          : r
      ),
    })),
}));
