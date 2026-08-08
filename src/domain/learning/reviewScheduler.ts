import type { ChildSkillState } from './mastery';

export type ReviewReason =
  | 'EARLY_REINFORCEMENT'
  | 'DEVELOPING_REINFORCEMENT'
  | 'PROFICIENCY_CHECK'
  | 'MASTERY_RETENTION';

export type ReviewPlan = Readonly<{
  dueAt: string;
  intervalDays: number;
  reason: ReviewReason;
  schedulerVersion: string;
}>;

const SCHEDULER_VERSION = 'review-v1';

function addDays(isoDate: string, days: number): string {
  const date = new Date(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

/**
 * Deterministic v1 spaced review policy.
 * Review intervals grow only when repeated evidence supports doing so.
 */
export function scheduleReview(
  state: ChildSkillState,
  scheduledFrom: string,
  priorCompletedReviews = 0,
): ReviewPlan | null {
  if (state.mastery === 'NOT_INTRODUCED') return null;

  if (state.mastery === 'INTRODUCED' || state.mastery === 'LEARNING') {
    return {
      dueAt: addDays(scheduledFrom, 1),
      intervalDays: 1,
      reason: 'EARLY_REINFORCEMENT',
      schedulerVersion: SCHEDULER_VERSION,
    };
  }

  if (state.mastery === 'DEVELOPING') {
    const intervalDays = state.confidence >= 0.5 ? 3 : 2;
    return {
      dueAt: addDays(scheduledFrom, intervalDays),
      intervalDays,
      reason: 'DEVELOPING_REINFORCEMENT',
      schedulerVersion: SCHEDULER_VERSION,
    };
  }

  if (state.mastery === 'PROFICIENT') {
    const intervalDays = Math.min(14, 5 + priorCompletedReviews * 3);
    return {
      dueAt: addDays(scheduledFrom, intervalDays),
      intervalDays,
      reason: 'PROFICIENCY_CHECK',
      schedulerVersion: SCHEDULER_VERSION,
    };
  }

  const intervalDays = Math.min(30, 7 * Math.max(1, priorCompletedReviews + 1));
  return {
    dueAt: addDays(scheduledFrom, intervalDays),
    intervalDays,
    reason: 'MASTERY_RETENTION',
    schedulerVersion: SCHEDULER_VERSION,
  };
}
