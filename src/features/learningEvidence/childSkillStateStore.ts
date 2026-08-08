import * as SQLite from 'expo-sqlite';
import type { ChildSkillState, SkillEvidence, SkillId } from '../../domain/learning/mastery';
import { evaluateEvidence } from '../../domain/learning/mastery';

const DATABASE_NAME = 'budly-learning.db';
const ENGINE_VERSION = 'mastery-v1';
let dbPromise: ReturnType<typeof SQLite.openDatabaseAsync> | null = null;

async function getDb() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  const db = await dbPromise;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS child_skill_states (
      child_id TEXT NOT NULL,
      skill_id TEXT NOT NULL,
      mastery TEXT NOT NULL,
      confidence REAL NOT NULL,
      evidence_count INTEGER NOT NULL,
      last_evidence_at TEXT,
      engine_version TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (child_id, skill_id)
    );
    CREATE INDEX IF NOT EXISTS child_skill_states_child_idx
      ON child_skill_states(child_id, updated_at);
  `);
  return db;
}

function initialState(skillId: SkillId): ChildSkillState {
  return {
    skillId,
    mastery: 'NOT_INTRODUCED',
    confidence: 0,
    evidenceCount: 0,
    engineVersion: ENGINE_VERSION,
  };
}

export async function getChildSkillState(childId: string, skillId: SkillId): Promise<ChildSkillState> {
  const db = await getDb();
  const row = await db.getFirstAsync<{
    skill_id: string;
    mastery: ChildSkillState['mastery'];
    confidence: number;
    evidence_count: number;
    last_evidence_at: string | null;
    engine_version: string;
  }>(
    `SELECT skill_id, mastery, confidence, evidence_count, last_evidence_at, engine_version
     FROM child_skill_states
     WHERE child_id = ? AND skill_id = ?`,
    childId,
    skillId,
  );

  if (!row) return initialState(skillId);

  return {
    skillId: row.skill_id as SkillId,
    mastery: row.mastery,
    confidence: row.confidence,
    evidenceCount: row.evidence_count,
    lastEvidenceAt: row.last_evidence_at ?? undefined,
    engineVersion: row.engine_version,
  };
}

export async function applySkillEvidence(childId: string, evidence: SkillEvidence) {
  const db = await getDb();
  const current = await getChildSkillState(childId, evidence.skillId);
  const update = evaluateEvidence(current, evidence);

  await db.runAsync(
    `INSERT INTO child_skill_states (
      child_id, skill_id, mastery, confidence, evidence_count,
      last_evidence_at, engine_version, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(child_id, skill_id) DO UPDATE SET
      mastery = excluded.mastery,
      confidence = excluded.confidence,
      evidence_count = excluded.evidence_count,
      last_evidence_at = excluded.last_evidence_at,
      engine_version = excluded.engine_version,
      updated_at = excluded.updated_at`,
    childId,
    update.next.skillId,
    update.next.mastery,
    update.next.confidence,
    update.next.evidenceCount,
    update.next.lastEvidenceAt ?? null,
    update.next.engineVersion,
    new Date().toISOString(),
  );

  return update;
}
