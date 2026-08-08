import { Stack } from 'expo-router';
import { useEffect } from 'react';
import type { SkillId } from '../src/domain/learning/mastery';
import { getActiveChildId } from '../src/features/family/activeChildStore';
import { reconcileDerivedLearningState } from '../src/features/sync/derivedLearningStateSync';
import { syncPendingLearningEvents } from '../src/features/sync/learningEventSync';

const COUNTING_SKILL_ID = 'MATH.NUMBERS.COUNTING.01' as SkillId;

export default function RootLayout() {
  useEffect(() => {
    const syncLearningState = async () => {
      await syncPendingLearningEvents();
      const childId = await getActiveChildId();
      if (childId) {
        await reconcileDerivedLearningState(childId, COUNTING_SKILL_ID);
      }
    };

    void syncLearningState().catch(() => {
      // Offline/auth failures are expected. Local evidence and derived state remain available.
    });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="learning-tree" />
      <Stack.Screen name="activity" />
      <Stack.Screen name="garden" />
      <Stack.Screen name="parent-gate" />
      <Stack.Screen name="parent-auth" />
      <Stack.Screen name="parent-onboarding" />
      <Stack.Screen name="parent-progress" />
    </Stack>
  );
}
