export const MASTERY_STATES = [
  'NOT_INTRODUCED',
  'INTRODUCED',
  'LEARNING',
  'DEVELOPING',
  'PROFICIENT',
  'MASTERED',
  'RETENTION_DUE',
] as const;

export type MasteryState = (typeof MASTERY_STATES)[number];

export type Confidence = number;

export type SkillId = string & { readonly __brand: 'SkillId' };

export type SkillEvidence = Readonly<{
  skillId: SkillId;
  correct: boolean;
  attempts: number;
  hintsUsed: number;
  responseTimeMs?: number;
  difficulty: number;
  independentCompletion: boolean;
  transferActivity: boolean;
  occurredAt: string;
}>;

export type ChildSkillState = Readonly<{
  skillId: SkillId;
  mastery: MasteryState;
  confidence: Confidence;
  evidenceCount: number;
  lastEvidenceAt?: string;
  engineVersion: string;
}>;

export type MasteryUpdate = Readonly<{
  previous: ChildSkillState;
  next: ChildSkillState;
  reasons: readonly string[];
}>;

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

/**
 * Conservative v1 mastery update.
 *
 * This is intentionally deterministic and small. It is a domain contract,
 * not the final educational model. Significant state changes require repeated
 * evidence; a single successful interaction never produces MASTERED.
 */
export function evaluateEvidence(
  current: ChildSkillState,
  evidence: SkillEvidence,
): MasteryUpdate {
  if (evidence.skillId !== current.skillId) {
    throw new Error('Evidence skill must match child skill state.');
  }

  if (evidence.attempts < 1 || evidence.hintsUsed < 0) {
    throw new RangeError('Invalid evidence attempt/hint counts.');
  }

  const independentSuccess = evidence.correct && evidence.independentCompletion;
  const supportedSuccess = evidence.correct && !evidence.independentCompletion;
  const failed = !evidence.correct;

  let confidenceDelta = 0;
  if (independentSuccess) confidenceDelta += evidence.transferActivity ? 0.12 : 0.08;
  if (supportedSuccess) confidenceDelta += 0.03;
  if (failed) confidenceDelta -= 0.06;
  if (evidence.hintsUsed > 0) confidenceDelta -= Math.min(0.04, evidence.hintsUsed * 0.01);
  if (evidence.attempts > 1) confidenceDelta -= Math.min(0.03, (evidence.attempts - 1) * 0.01);

  const nextConfidence = clamp01(current.confidence + confidenceDelta);
  const nextEvidenceCount = current.evidenceCount + 1;
  let nextMastery = current.mastery;
  const reasons: string[] = [];

  if (current.mastery === 'NOT_INTRODUCED') {
    nextMastery = 'INTRODUCED';
    reasons.push('First accepted evidence introduced the skill.');
  } else if (independentSuccess && nextEvidenceCount >= 2 && nextConfidence >= 0.35) {
    if (current.mastery === 'INTRODUCED') nextMastery = 'LEARNING';
    else if (current.mastery === 'LEARNING') nextMastery = 'DEVELOPING';
    else if (current.mastery === 'DEVELOPING' && nextEvidenceCount >= 4 && nextConfidence >= 0.6) {
      nextMastery = 'PROFICIENT';
    } else if (
      current.mastery === 'PROFICIENT' &&
      evidence.transferActivity &&
      nextEvidenceCount >= 6 &&
      nextConfidence >= 0.8
    ) {
      nextMastery = 'MASTERED';
    }

    if (nextMastery !== current.mastery) {
      reasons.push(`Repeated independent evidence advanced mastery to ${nextMastery}.`);
    }
  }

  if (failed && nextConfidence < 0.25 && current.mastery === 'PROFICIENT') {
    nextMastery = 'DEVELOPING';
    reasons.push('Low-confidence recent evidence requires additional practice.');
  }

  if (reasons.length === 0) {
    reasons.push('Evidence updated confidence without a major mastery transition.');
  }

  return {
    previous: current,
    next: {
      ...current,
      mastery: nextMastery,
      confidence: nextConfidence,
      evidenceCount: nextEvidenceCount,
      lastEvidenceAt: evidence.occurredAt,
    },
    reasons,
  };
}
