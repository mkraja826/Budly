import * as SQLite from 'expo-sqlite';
import type { LearningEvent } from '../../domain/learning/events';

const DATABASE_NAME = 'budly-learning.db';
let dbPromise: ReturnType<typeof SQLite.openDatabaseAsync> | null = null;

async function getDb() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  const db = await dbPromise;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS learning_events (
      event_id TEXT PRIMARY KEY NOT NULL,
      event_type TEXT NOT NULL,
      occurred_at TEXT NOT NULL,
      child_id TEXT NOT NULL,
      activity_id TEXT,
      activity_version INTEGER,
      skill_ids_json TEXT,
      payload_json TEXT NOT NULL,
      sync_status TEXT NOT NULL DEFAULT 'PENDING',
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS learning_events_child_time_idx
      ON learning_events(child_id, occurred_at);
    CREATE INDEX IF NOT EXISTS learning_events_sync_idx
      ON learning_events(sync_status, occurred_at);
  `);
  return db;
}

export async function appendLearningEvent(event: LearningEvent): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR IGNORE INTO learning_events (
      event_id, event_type, occurred_at, child_id, activity_id,
      activity_version, skill_ids_json, payload_json, sync_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
    event.eventId,
    event.eventType,
    event.occurredAt,
    event.childId,
    event.activityId ?? null,
    event.activityVersion ?? null,
    event.skillIds ? JSON.stringify(event.skillIds) : null,
    JSON.stringify(event.payload),
    new Date().toISOString(),
  );
}

export async function getPendingLearningEvents(limit = 100): Promise<LearningEvent[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    event_id: string;
    event_type: LearningEvent['eventType'];
    occurred_at: string;
    child_id: string;
    activity_id: string | null;
    activity_version: number | null;
    skill_ids_json: string | null;
    payload_json: string;
  }>(
    `SELECT event_id, event_type, occurred_at, child_id, activity_id,
            activity_version, skill_ids_json, payload_json
     FROM learning_events
     WHERE sync_status = 'PENDING'
     ORDER BY occurred_at ASC
     LIMIT ?`,
    limit,
  );

  return rows.map((row) => ({
    eventId: row.event_id,
    eventType: row.event_type,
    occurredAt: row.occurred_at,
    childId: row.child_id,
    activityId: row.activity_id ?? undefined,
    activityVersion: row.activity_version ?? undefined,
    skillIds: row.skill_ids_json ? JSON.parse(row.skill_ids_json) : undefined,
    payload: JSON.parse(row.payload_json),
  }));
}

export async function markLearningEventsSynced(eventIds: readonly string[]): Promise<void> {
  if (eventIds.length === 0) return;
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (const eventId of eventIds) {
      await db.runAsync(
        `UPDATE learning_events SET sync_status = 'SYNCED' WHERE event_id = ?`,
        eventId,
      );
    }
  });
}
