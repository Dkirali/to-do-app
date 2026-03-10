import { getDatabase } from '../migrations';
import type { Goal } from '@app-types/index';

export async function getAllGoals(): Promise<Goal[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>('SELECT * FROM goals ORDER BY week_start DESC');
  return rows.map(rowToGoal);
}

export async function getGoalsByWeek(weekStart: string): Promise<Goal[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>('SELECT * FROM goals WHERE week_start = ?', [weekStart]);
  return rows.map(rowToGoal);
}

export async function insertGoal(goal: Goal): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO goals (id, title, category, target_type, target_value, current_value, reward_id, week_start, motivation_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [goal.id, goal.title, goal.category, goal.targetType, goal.targetValue, goal.currentValue, goal.rewardId ?? null, goal.weekStart, goal.motivationText ?? null]
  );
}

export async function updateGoalProgress(id: string, currentValue: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE goals SET current_value = ? WHERE id = ?', [currentValue, id]);
}

export async function resetAllGoalProgress(): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE goals SET current_value = 0');
}

export async function deleteGoal(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM goals WHERE id = ?', [id]);
}

function rowToGoal(row: any): Goal {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    targetType: row.target_type,
    targetValue: row.target_value,
    currentValue: row.current_value,
    rewardId: row.reward_id ?? undefined,
    weekStart: row.week_start,
    motivationText: row.motivation_text ?? undefined,
  };
}
