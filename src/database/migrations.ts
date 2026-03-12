import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL } from './schema';
import { format, startOfWeek } from 'date-fns';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('productivity.db');
  }
  return db;
}

export async function runMigrations(): Promise<void> {
  const database = await getDatabase();
  await database.execAsync(CREATE_TABLES_SQL);
  await seedDemoData(database);
}

// ─── Seed demo goals + reward (only if goals table is empty) ─────────────────

async function seedDemoData(database: SQLite.SQLiteDatabase): Promise<void> {
  const existing = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM goals'
  );
  if (existing && existing.count > 0) return;

  const weekStart = format(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    'yyyy-MM-dd'
  );
  const rewardId = 'seed-reward-1';

  await database.execAsync(`
    INSERT OR IGNORE INTO goals (id, title, category, target_type, target_value, current_value, reward_id, week_start, motivation_text)
    VALUES
      ('seed-goal-1', 'Complete 50 tasks', 'general', 'tasks', 50, 34, '${rewardId}', '${weekStart}', NULL),
      ('seed-goal-2', 'Gym 4 times', 'health', 'tasks', 4, 2, NULL, '${weekStart}', 'Keep it up! 2 more to go.'),
      ('seed-goal-3', 'Study 20 hours', 'study', 'hours', 20, 15, NULL, '${weekStart}', 'Almost there!');

    INSERT OR IGNORE INTO rewards (id, title, description, icon, linked_goal_id, is_unlocked, is_claimed, week_start)
    VALUES
      ('${rewardId}', 'Go out to eat', 'A nice dinner as a reward', 'restaurant', 'seed-goal-1', 0, 0, '${weekStart}');
  `);
}
