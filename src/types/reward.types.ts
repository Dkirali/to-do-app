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
