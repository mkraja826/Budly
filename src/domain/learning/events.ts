export type LearningEventType =
  | 'SESSION_STARTED'
  | 'ACTIVITY_STARTED'
  | 'OBJECT_SELECTED'
  | 'ANSWER_SUBMITTED'
  | 'HINT_REQUESTED'
  | 'ACTIVITY_COMPLETED'
  | 'SKILL_EVIDENCE_RECORDED'
  | 'REVIEW_SCHEDULED'
  | 'REVIEW_COMPLETED';

export type LearningEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> = {
  eventId: string;
  eventType: LearningEventType;
  occurredAt: string;
  childId: string;
  activityId?: string;
  activityVersion?: number;
  skillIds?: readonly string[];
  payload: TPayload;
};

export type CountingSelectionEvidence = {
  targetCount: number;
  selectedCount: number;
  distinctSelections: number;
  attempts: number;
  hintsUsed: number;
  responseTimeMs: number;
  completedIndependently: boolean;
};

export function createLearningEventId(prefix = 'evt'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function buildCountingEvidence(input: {
  targetCount: number;
  selectedObjectIds: readonly string[];
  attempts: number;
  hintsUsed: number;
  responseTimeMs: number;
}): CountingSelectionEvidence {
  const distinctSelections = new Set(input.selectedObjectIds).size;

  return {
    targetCount: input.targetCount,
    selectedCount: input.selectedObjectIds.length,
    distinctSelections,
    attempts: Math.max(0, input.attempts),
    hintsUsed: Math.max(0, input.hintsUsed),
    responseTimeMs: Math.max(0, input.responseTimeMs),
    completedIndependently:
      distinctSelections === input.targetCount && input.hintsUsed === 0,
  };
}
