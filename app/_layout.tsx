import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="learning-tree" />
      <Stack.Screen name="activity" />
      <Stack.Screen name="garden" />
      <Stack.Screen name="parent-gate" />
    </Stack>
  );
}
