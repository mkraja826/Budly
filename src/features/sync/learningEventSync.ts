import { getPendingLearningEvents, markLearningEventsSynced } from '../learningEvidence/localEvidenceStore';
import { supabase } from '../../lib/supabase';

export type LearningEventSyncResult = {
  attempted: number;
  synced: number;
  skipped: number;
};

export async function syncPendingLearningEvents(limit = 100): Promise<LearningEventSyncResult> {
  const pending = await getPendingLearningEvents(limit);
  if (pending.length === 0) {
    return { attempted: 0, synced: 0, skipped: 0 };
  }

  const { data, error } = await supabase.rpc('ingest_learning_events', {
    events: pending,
  });

  if (error) throw error;

  const acknowledgedIds = new Set(
    (data ?? []).map((row: { event_id: string }) => row.event_id),
  );
  const syncedIds = pending
    .map((event) => event.eventId)
    .filter((eventId) => acknowledgedIds.has(eventId));

  await markLearningEventsSynced(syncedIds);

  return {
    attempted: pending.length,
    synced: syncedIds.length,
    skipped: pending.length - syncedIds.length,
  };
}
