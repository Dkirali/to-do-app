import { create } from 'zustand';
import type { Reward } from '@app-types';
import {
  getRewardsByWeek,
  insertReward,
  claimReward as dbClaimReward,
  unlockReward as dbUnlockReward,
  deleteReward as dbDeleteReward,
} from '@database/queries/rewardQueries';

interface RewardStore {
  rewards: Reward[];
  loadRewards: (weekStart: string) => Promise<void>;
  addReward: (reward: Reward) => Promise<void>;
  updateReward: (id: string, updates: Partial<Reward>) => void;
  deleteReward: (id: string) => Promise<void>;
  claimReward: (id: string) => Promise<void>;
  checkAndUnlock: (goalId: string) => Promise<void>;
}

export const useRewardStore = create<RewardStore>((set, get) => ({
  rewards: [],
  loadRewards: async (weekStart) => {
    const rewards = await getRewardsByWeek(weekStart);
    set({ rewards });
  },
  addReward: async (reward) => {
    await insertReward(reward);
    set((state) => ({ rewards: [...state.rewards, reward] }));
  },
  updateReward: (id, updates) =>
    set((state) => ({ rewards: state.rewards.map((r) => (r.id === id ? { ...r, ...updates } : r)) })),
  deleteReward: async (id) => {
    await dbDeleteReward(id);
    set((state) => ({ rewards: state.rewards.filter((r) => r.id !== id) }));
  },
  claimReward: async (id) => {
    await dbClaimReward(id);
    set((state) => ({
      rewards: state.rewards.map((r) => (r.id === id ? { ...r, isClaimed: true } : r)),
    }));
  },
  checkAndUnlock: async (goalId) => {
    const toUnlock = get().rewards.filter(
      (r) => r.linkedGoalId === goalId && !r.isUnlocked
    );
    for (const r of toUnlock) {
      await dbUnlockReward(r.id);
    }
    const unlockedAt = new Date().toISOString();
    set((state) => ({
      rewards: state.rewards.map((r) =>
        r.linkedGoalId === goalId && !r.isUnlocked
          ? { ...r, isUnlocked: true, unlockedAt }
          : r
      ),
    }));
  },
}));
