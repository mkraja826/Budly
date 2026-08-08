import * as SQLite from 'expo-sqlite';
import type { SkillId } from '../../domain/learning/mastery';
import type { ReviewPlan } from '../../domain/learning/reviewScheduler';

const DATABASE_NAME = 'budly-learning.db';
let dbPromise: ReturnType<typeof SQLite.openDatabaseAsync> | null = null;

async function getDb() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  const db = await dbPromise;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS review_schedule (
      child_id TEXT NOT NULL,
      skill_id TEXT NOT NULL,
      due_at TEXT NOT NULL,
      interval_days INTEGER NOT NULL,
      reason TEXT NOT NULL,
      scheduler_version TEXT NOT NULL,
      completed_reviews INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (child_id, skill_id)
    );
    CREATE INDEX IF NOT EXISTS review_schedule_due_idx
      ON review_schedule(child_id, due_at);
  `);
  return db;
}

export async function getCompletedReviewCount(childId: string, skillId: SkillId): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ completed_reviews: number }>(
    `SELECT completed_reviews FROM review_schedule WHERE child_id = ? AND skill_id = ?`,
    childId,
    skillId,
  );
  return row?.completed_reviews ?? 0;
}

export async function getReviewPlan(childId: string, skillId: SkillId) {
  const db = await getDb();
  return db.getFirstAsync<{
    due_at: string;
    interval_days: number;
    reason: ReviewPlan['reason'];
    scheduler_version: string;
    completed_reviews: number;
  }>(
    `SELECT due_at, interval_days, reason, scheduler_version, completed_reviews
     FROM review_schedule
     WHERE child_id = ? AND skill_id = ?`,
    childId,
    skillId,
  );
}

export async function upsertReviewPlan(childId: string, skillId: SkillId, plan: ReviewPlan): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO review_schedule (
      child_id, skill_id, due_at, interval_days, reason,
      scheduler_version, completed_reviews, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 0, ?)
    ON CONFLICT(child_id, skill_id) DO UPDATE SET
      due_at = excluded.due_at,
      interval_days = excluded.interval_days,
      reason = excluded.reason,
      scheduler_version = excluded.scheduler_version,
      updated_at = excluded.updated_at`,
    childId,
    skillId,
    plan.dueAt,
    plan.intervalDays,
    plan.reason,
    plan.schedulerVersion,
    new Date().toISOString(),
  );
}

export async function getDueReviews(childId: string, nowIso = new Date().toISOString()) {
  const db = await getDb();
  return db.getAllAsync<{
    skill_id: string;
    due_at: string;
    interval_days: number;
    reason: ReviewPlan['reason'];
    scheduler_version: string;
  }>(
    `SELECT skill_id, due_at, interval_days, reason, scheduler_version
     FROM review_schedule
     WHERE child_id = ? AND due_at <= ?
     ORDER BY due_at ASC`,
    childId,
    nowIso,
  );
}

export async function markReviewCompleted(childId: string, skillId: SkillId): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE review_schedule
     SET completed_reviews = completed_reviews + 1,
         updated_at = ?
     WHERE child_id = ? AND skill_id = ?`,
    new Date().toISOString(),
    childId,
    skillId,
  );
}
