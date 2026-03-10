import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL } from './schema';

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
}
