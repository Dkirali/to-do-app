export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    time TEXT,
    date TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    completed_at TEXT,
    priority TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_value REAL NOT NULL,
    current_value REAL DEFAULT 0,
    reward_id TEXT,
    week_start TEXT NOT NULL,
    motivation_text TEXT
  );

  CREATE TABLE IF NOT EXISTS rewards (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    linked_goal_id TEXT,
    is_unlocked INTEGER DEFAULT 0,
    is_claimed INTEGER DEFAULT 0,
    unlocked_at TEXT,
    week_start TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS weekly_stats (
    id TEXT PRIMARY KEY,
    week_start TEXT NOT NULL,
    week_end TEXT NOT NULL,
    completion_percentage REAL,
    tasks_completed INTEGER,
    rewards_unlocked INTEGER,
    best_category TEXT,
    personal_best INTEGER,
    daily_task_counts TEXT
  );
`;
