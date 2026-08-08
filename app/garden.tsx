import { router } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function GardenScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Pressable onPress={() => router.replace('/')} style={styles.back}><Text style={styles.backText}>⌂</Text></Pressable>
      <View style={styles.content}>
        <Text style={styles.title}>My Garden</Text>
        <Text style={styles.subtitle}>Every little bit of learning helps it grow.</Text>
        <View style={styles.world}><Text style={styles.worldEmoji}>🌱 🌷 🌻 🦋 🌳</Text></View>
        <View style={styles.reward}><Text style={styles.rewardText}>You earned a new seed! 🌱</Text></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EDF8E8', padding: 18 },
  back: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 28 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 },
  title: { fontSize: 38, fontWeight: '900', color: '#3A703A' },
  subtitle: { fontSize: 18, fontWeight: '700', color: '#59725A', textAlign: 'center', maxWidth: 320 },
  world: { width: '100%', maxWidth: 420, minHeight: 240, borderRadius: 40, backgroundColor: '#CDEDBD', alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: '#FFF' },
  worldEmoji: { fontSize: 50, textAlign: 'center' },
  reward: { backgroundColor: '#FFF4BF', borderRadius: 28, paddingHorizontal: 24, paddingVertical: 16 },
  rewardText: { fontSize: 20, fontWeight: '900', color: '#5E562E' },
});
