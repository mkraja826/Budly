import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function GardenScreen() {
  const { earned } = useLocalSearchParams<{ earned?: string }>();
  const earnedSeed = earned === 'seed';

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable
        accessibilityLabel="Return to Budly home"
        accessibilityRole="button"
        onPress={() => router.replace('/')}
        style={styles.back}
      >
        <Text style={styles.backText}>⌂</Text>
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>My Garden</Text>
        <Text style={styles.subtitle}>Every little bit of learning helps your world grow.</Text>

        <View accessibilityLabel="Budly reward garden" style={styles.world}>
          <Text style={styles.sun}>☀️</Text>
          <Text style={styles.worldEmoji}>🌱  🌷  🌻</Text>
          <Text style={styles.worldEmoji}>🦋  🌳  🐰</Text>
          {earnedSeed ? <Text style={styles.newPlant}>🌱</Text> : null}
        </View>

        {earnedSeed ? (
          <View accessibilityLiveRegion="polite" style={styles.reward}>
            <Text style={styles.rewardIcon}>🌱</Text>
            <Text style={styles.rewardTitle}>A new seed!</Text>
            <Text style={styles.rewardText}>Your counting helped the garden grow.</Text>
          </View>
        ) : (
          <View style={styles.rewardMuted}>
            <Text style={styles.rewardText}>Learn and play to grow your garden.</Text>
          </View>
        )}

        <Pressable
          accessibilityLabel="Continue learning"
          accessibilityRole="button"
          onPress={() => router.replace('/')}
          style={styles.continueButton}
        >
          <Text style={styles.continueText}>Back to Budly 🌈</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EDF8E8', padding: 18 },
  back: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 30, color: '#315B34' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 },
  title: { fontSize: 38, fontWeight: '900', color: '#3A703A' },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#59725A',
    textAlign: 'center',
    maxWidth: 340,
  },
  world: {
    width: '100%',
    maxWidth: 440,
    minHeight: 250,
    borderRadius: 40,
    backgroundColor: '#CDEDBD',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#FFF',
    gap: 12,
    overflow: 'hidden',
  },
  sun: { position: 'absolute', right: 24, top: 20, fontSize: 46 },
  worldEmoji: { fontSize: 48, textAlign: 'center' },
  newPlant: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    fontSize: 54,
    transform: [{ rotate: '-8deg' }],
  },
  reward: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFF4BF',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 5,
  },
  rewardMuted: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFF',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  rewardIcon: { fontSize: 40 },
  rewardTitle: { fontSize: 23, fontWeight: '900', color: '#4E642E' },
  rewardText: { fontSize: 17, fontWeight: '700', color: '#5E623F', textAlign: 'center' },
  continueButton: {
    minWidth: 240,
    minHeight: 68,
    borderRadius: 34,
    backgroundColor: '#62B84F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  continueText: { color: '#FFF', fontSize: 20, fontWeight: '900' },
});
