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
  completedIndependently: boolean;
};

export const COUNT_THREE_APPLES_ACTIVITY = {
  activityId: 'ACT.COUNTING.OBJECTS.00001',
  version: 1,
  skillIds: ['MATH.NUMBERS.COUNTING.01'] as const,
  targetCount: 3,
} as const;

export function buildCountingEvidence(input: {
  selectedObjectIds: readonly string[];
  attempts: number;
  hintsUsed: number;
}): CountingSelectionEvidence {
  const distinctSelections = new Set(input.selectedObjectIds).size;

  return {
    targetCount: COUNT_THREE_APPLES_ACTIVITY.targetCount,
    selectedCount: input.selectedObjectIds.length,
    distinctSelections,
    attempts: Math.max(0, input.attempts),
    hintsUsed: Math.max(0, input.hintsUsed),
    completedIndependently:
      distinctSelections === COUNT_THREE_APPLES_ACTIVITY.targetCount && input.hintsUsed === 0,
  };
}
