import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'budly-learning.db';
let dbPromise: ReturnType<typeof SQLite.openDatabaseAsync> | null = null;

async function getDb() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  const db = await dbPromise;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_identity_state (
      singleton_id INTEGER PRIMARY KEY CHECK (singleton_id = 1),
      active_child_id TEXT,
      updated_at TEXT NOT NULL
    );
  `);
  return db;
}

export async function getActiveChildId(): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ active_child_id: string | null }>(
    'SELECT active_child_id FROM app_identity_state WHERE singleton_id = 1',
  );
  return row?.active_child_id ?? null;
}

export async function setActiveChildId(childId: string | null): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO app_identity_state (singleton_id, active_child_id, updated_at)
     VALUES (1, ?, ?)
     ON CONFLICT(singleton_id) DO UPDATE SET
       active_child_id = excluded.active_child_id,
       updated_at = excluded.updated_at`,
    childId,
    new Date().toISOString(),
  );
}
