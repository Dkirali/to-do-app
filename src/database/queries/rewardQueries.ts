import { getDatabase } from '../migrations';
import type { Reward } from '@app-types';

export async function getAllRewards(): Promise<Reward[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>('SELECT * FROM rewards ORDER BY week_start DESC');
  return rows.map(rowToReward);
}

export async function getRewardsByWeek(weekStart: string): Promise<Reward[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>('SELECT * FROM rewards WHERE week_start = ?', [weekStart]);
  return rows.map(rowToReward);
}

export async function insertReward(reward: Reward): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO rewards (id, title, description, icon, linked_goal_id, is_unlocked, is_claimed, unlocked_at, week_start) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [reward.id, reward.title, reward.description, reward.icon, reward.linkedGoalId ?? null, reward.isUnlocked ? 1 : 0, reward.isClaimed ? 1 : 0, reward.unlockedAt ?? null, reward.weekStart]
  );
}

export async function unlockReward(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE rewards SET is_unlocked = 1, unlocked_at = ? WHERE id = ?', [new Date().toISOString(), id]);
}

export async function claimReward(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE rewards SET is_claimed = 1 WHERE id = ?', [id]);
}

export async function resetAllRewards(): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE rewards SET is_unlocked = 0, is_claimed = 0, unlocked_at = NULL');
}

export async function deleteReward(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM rewards WHERE id = ?', [id]);
}

function rowToReward(row: any): Reward {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    linkedGoalId: row.linked_goal_id ?? undefined,
    isUnlocked: row.is_unlocked === 1,
    isClaimed: row.is_claimed === 1,
    unlockedAt: row.unlocked_at ?? undefined,
    weekStart: row.week_start,
  };
}
