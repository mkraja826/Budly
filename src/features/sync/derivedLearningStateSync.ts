import type { ChildSkillState, SkillId } from '../../domain/learning/mastery';
import { supabase } from '../../infrastructure/supabase/client';
import { getChildSkillState } from '../learningEvidence/childSkillStateStore';
import { getReviewPlan } from '../learningEvidence/reviewScheduleStore';

export async function syncDerivedLearningState(childId: string, skillId: SkillId): Promise<boolean> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return false;

  const state = await getChildSkillState(childId, skillId);
  const review = await getReviewPlan(childId, skillId);

  const { error } = await supabase.rpc('sync_child_learning_state', {
    p_child_id: childId,
    p_skill_id: skillId,
    p_mastery: state.mastery,
    p_confidence: state.confidence,
    p_evidence_count: state.evidenceCount,
    p_last_evidence_at: state.lastEvidenceAt ?? null,
    p_engine_version: state.engineVersion,
    p_review_due_at: review?.due_at ?? null,
    p_review_interval_days: review?.interval_days ?? null,
    p_review_reason: review?.reason ?? null,
    p_scheduler_version: review?.scheduler_version ?? null,
    p_completed_reviews: review?.completed_reviews ?? 0,
  });

  return !error;
}

export type RemoteLearningSnapshot = Readonly<{
  state: ChildSkillState | null;
  review: {
    dueAt: string;
    intervalDays: number;
    reason: string;
    schedulerVersion: string;
    completedReviews: number;
  } | null;
}>;

export async function fetchRemoteLearningSnapshot(childId: string, skillId: SkillId): Promise<RemoteLearningSnapshot> {
  const [{ data: stateRow, error: stateError }, { data: reviewRow, error: reviewError }] = await Promise.all([
    supabase
      .from('child_skill_states')
      .select('skill_id,mastery,confidence,evidence_count,last_evidence_at,engine_version')
      .eq('child_id', childId)
      .eq('skill_id', skillId)
      .maybeSingle(),
    supabase
      .from('review_schedule')
      .select('due_at,interval_days,reason,scheduler_version,completed_reviews')
      .eq('child_id', childId)
      .eq('skill_id', skillId)
      .maybeSingle(),
  ]);

  if (stateError || reviewError) return { state: null, review: null };

  return {
    state: stateRow
      ? {
          skillId: stateRow.skill_id as SkillId,
          mastery: stateRow.mastery as ChildSkillState['mastery'],
          confidence: Number(stateRow.confidence),
          evidenceCount: Number(stateRow.evidence_count),
          lastEvidenceAt: stateRow.last_evidence_at ?? undefined,
          engineVersion: stateRow.engine_version,
        }
      : null,
    review: reviewRow
      ? {
          dueAt: reviewRow.due_at,
          intervalDays: reviewRow.interval_days,
          reason: reviewRow.reason,
          schedulerVersion: reviewRow.scheduler_version,
          completedReviews: reviewRow.completed_reviews,
        }
      : null,
  };
}
