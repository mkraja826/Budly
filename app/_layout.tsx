import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { syncPendingLearningEvents } from '../src/features/sync/learningEventSync';

export default function RootLayout() {
  useEffect(() => {
    void syncPendingLearningEvents().catch(() => {
      // Offline/auth failures are expected; events remain PENDING for the next sync attempt.
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
