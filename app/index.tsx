import { router } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const zones = [
  { title: 'Learning Tree', icon: '🌳', action: () => router.push('/activity') },
  { title: 'Adventure Path', icon: '🐾', action: () => router.push('/activity') },
  { title: 'Music Garden', icon: '🎵', action: () => router.push('/activity') },
];

export default function SeedHomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.sky}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.brand}>Budly 🌱</Text>
            <Text style={styles.tagline}>Learn. Play. Grow.</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Open parent space" onPress={() => router.push('/parent-gate')} style={styles.parentButton}>
            <Text style={styles.parentButtonText}>🔒 Parents</Text>
          </Pressable>
        </View>

        <View style={styles.companionWrap}>
          <Text style={styles.speech}>Hi! Ready for an adventure?</Text>
          <View style={styles.character}>
            <Text style={styles.characterEmoji}>🧒</Text>
          </View>
        </View>

        <View style={styles.zones}>
          {zones.map((zone) => (
            <Pressable key={zone.title} onPress={zone.action} style={({ pressed }) => [styles.zone, pressed && styles.zonePressed]} accessibilityRole="button" accessibilityLabel={zone.title}>
              <Text style={styles.zoneIcon}>{zone.icon}</Text>
              <Text style={styles.zoneTitle}>{zone.title}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.goalCard}>
            <Text style={styles.goalLabel}>Today’s adventure</Text>
            <Text style={styles.goalValue}>⭐ 3 little activities</Text>
          </View>
          <Pressable onPress={() => router.push('/garden')} style={styles.gardenCard} accessibilityRole="button" accessibilityLabel="Open my garden">
            <Text style={styles.goalLabel}>My Garden</Text>
            <Text style={styles.goalValue}>🌱 12</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EAF7FF' },
  sky: { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { fontSize: 34, fontWeight: '900', color: '#4A55C7' },
  tagline: { fontSize: 16, fontWeight: '700', color: '#426174', marginTop: 2 },
  parentButton: { backgroundColor: '#FFFFFFCC', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  parentButtonText: { fontWeight: '800', color: '#4A3B6D' },
  companionWrap: { alignItems: 'center', gap: 10 },
  speech: { backgroundColor: '#FFFFFF', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 22, fontSize: 18, fontWeight: '800', color: '#29404F' },
  character: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#BFE7A8', alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: '#FFFFFF' },
  characterEmoji: { fontSize: 90 },
  zones: { flexDirection: 'row', gap: 12 },
  zone: { flex: 1, minHeight: 150, borderRadius: 30, backgroundColor: '#F7F1C7', alignItems: 'center', justifyContent: 'center', padding: 10, borderWidth: 4, borderColor: '#FFFFFF' },
  zonePressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  zoneIcon: { fontSize: 55, marginBottom: 8 },
  zoneTitle: { fontSize: 17, fontWeight: '900', textAlign: 'center', color: '#38503C' },
  bottomRow: { flexDirection: 'row', gap: 12 },
  goalCard: { flex: 1.4, backgroundColor: '#FFF7DD', borderRadius: 22, padding: 16 },
  gardenCard: { flex: 1, backgroundColor: '#E6F5DE', borderRadius: 22, padding: 16 },
  goalLabel: { fontSize: 13, fontWeight: '800', color: '#68747B' },
  goalValue: { fontSize: 17, fontWeight: '900', color: '#2E454F', marginTop: 5 },
});
