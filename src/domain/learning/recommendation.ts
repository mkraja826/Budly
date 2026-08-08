import type { ChildSkillState } from './mastery';

export type CountingRecommendationKind =
  | 'EASIER_PRACTICE'
  | 'NORMAL_PRACTICE'
  | 'STRETCH_PRACTICE'
  | 'REVIEW';

export type CountingRecommendation = Readonly<{
  kind: CountingRecommendationKind;
  startActivityIndex: number;
  reason: string;
}>;

/**
 * Deterministic v1 recommendation policy for the Seed counting skill.
 * This deliberately uses broad confidence/mastery bands and never makes a
 * major path change from a single interaction.
 */
export function recommendCountingPractice(state: ChildSkillState): CountingRecommendation {
  if (state.mastery === 'RETENTION_DUE' || state.mastery === 'MASTERED') {
    return {
      kind: 'REVIEW',
      startActivityIndex: 1,
      reason: 'Previously learned counting should be checked again for retention.',
    };
  }

  if (
    state.mastery === 'NOT_INTRODUCED' ||
    state.mastery === 'INTRODUCED' ||
    state.confidence < 0.25
  ) {
    return {
      kind: 'EASIER_PRACTICE',
      startActivityIndex: 1,
      reason: 'Use a small count first while Budly gathers more evidence.',
    };
  }

  if (
    (state.mastery === 'DEVELOPING' || state.mastery === 'PROFICIENT') &&
    state.confidence >= 0.55 &&
    state.evidenceCount >= 4
  ) {
    return {
      kind: 'STRETCH_PRACTICE',
      startActivityIndex: 2,
      reason: 'Repeated evidence supports trying a slightly larger count.',
    };
  }

  return {
    kind: 'NORMAL_PRACTICE',
    startActivityIndex: 0,
    reason: 'Continue age-appropriate counting practice while confidence develops.',
  };
}
