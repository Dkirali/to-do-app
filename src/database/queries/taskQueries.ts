import { getDatabase } from '../migrations';
import type { Task } from '@app-types';

export async function getAllTasks(): Promise<Task[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>('SELECT * FROM tasks ORDER BY date DESC, time ASC');
  return rows.map(rowToTask);
}

export async function getTasksByDate(date: string): Promise<Task[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>('SELECT * FROM tasks WHERE date = ? ORDER BY time ASC', [date]);
  return rows.map(rowToTask);
}

export async function insertTask(task: Task): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO tasks (id, title, category, time, date, completed, created_at, completed_at, priority, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [task.id, task.title, task.category, task.time, task.date, task.completed ? 1 : 0, task.createdAt, task.completedAt ?? null, task.priority ?? null, task.description ?? null]
  );
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
  const db = await getDatabase();
  const fields = Object.keys(updates)
    .map((k) => `${toSnakeCase(k)} = ?`)
    .join(', ');
  const values = [...Object.values(updates).map((v) => (typeof v === 'boolean' ? (v ? 1 : 0) : v)), id];
  await db.runAsync(`UPDATE tasks SET ${fields} WHERE id = ?`, values as any[]);
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
}

function rowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    time: row.time,
    date: row.date,
    completed: row.completed === 1,
    createdAt: row.created_at,
    completedAt: row.completed_at ?? undefined,
    priority: row.priority ?? undefined,
    description: row.description ?? undefined,
  };
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}
