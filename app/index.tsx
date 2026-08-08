import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { DefaultChildCharacter } from '../src/features/character/DefaultChildCharacter';
import { childSelectionFeedback, speakChildPrompt, stopChildSpeech } from '../src/features/feedback/childFeedback';

const zones = [
  { title: 'Learning Tree', icon: '🌳', route: '/learning-tree' as const, voice: 'Let’s visit the Learning Tree!', style: 'tree' as const },
  { title: 'Adventure Path', icon: '🐾', route: null, voice: 'Adventure Path is coming soon!', style: 'path' as const },
  { title: 'Music Garden', icon: '🎵', route: null, voice: 'Music Garden is coming soon!', style: 'music' as const },
];

export default function SeedHomeScreen() {
  useEffect(() => {
    void speakChildPrompt('Hi! Ready for an adventure?');
    return () => {
      void stopChildSpeech();
    };
  }, []);

  const openZone = async (route: '/learning-tree' | null, voice: string) => {
    await childSelectionFeedback();
    await speakChildPrompt(voice);
    if (route) router.push(route);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.world}>
        <View style={styles.sun}><Text style={styles.sunText}>☀️</Text></View>
        <Text style={[styles.cloud, styles.cloudLeft]}>☁️</Text>
        <Text style={[styles.cloud, styles.cloudRight]}>☁️</Text>

        <View style={styles.topRow}>
          <View>
            <Text style={styles.brand}>Budly 🌱</Text>
            <Text style={styles.tagline}>Learn. Play. Grow.</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Open parent space" onPress={() => router.push('/parent-gate')} style={styles.parentButton}>
            <Text style={styles.parentButtonText}>🔒</Text>
          </Pressable>
        </View>

        <View style={styles.scene}>
          <View style={styles.hillsBack} />
          <View style={styles.hillsFront} />
          <View style={styles.ground} />

          <Pressable accessibilityRole="button" accessibilityLabel="Hear Budly greeting again" onPress={() => speakChildPrompt('Hi! Ready for an adventure?')} style={styles.speech}>
            <Text style={styles.speechText}>🔊 Hi! Ready for an adventure?</Text>
          </Pressable>

          <View style={styles.characterSpot}>
            <DefaultChildCharacter size={164} pose="wave" expression="happy" accessibilityLabel="Budly default child waving hello" />
          </View>

          {zones.map((zone) => {
            const zoneStyle = zone.style === 'tree' ? styles.treeZone : zone.style === 'path' ? styles.pathZone : styles.musicZone;
            const badgeStyle = zone.style === 'tree' ? styles.treeBadge : zone.style === 'path' ? styles.pathBadge : styles.musicBadge;
            return (
              <Pressable key={zone.title} onPress={() => openZone(zone.route, zone.voice)} style={({ pressed }) => [styles.worldZone, zoneStyle, pressed && styles.zonePressed]} accessibilityRole="button" accessibilityLabel={zone.title}>
                <Text style={styles.zoneIcon}>{zone.icon}</Text>
                <View style={[styles.zoneBadge, badgeStyle]}>
                  <Text style={styles.zoneTitle}>{zone.title}</Text>
                  {!zone.route ? <Text style={styles.soon}>Soon</Text> : null}
                </View>
              </Pressable>
            );
          })}

          <Pressable onPress={() => router.push('/garden')} style={styles.gardenPatch} accessibilityRole="button" accessibilityLabel="Open my garden">
            <Text style={styles.gardenEmoji}>🌱 🌷 🦋</Text>
            <Text style={styles.gardenTitle}>My Garden</Text>
            <Text style={styles.gardenCount}>12 seeds</Text>
          </Pressable>

          <View style={styles.todayBubble}>
            <Text style={styles.todayLabel}>Today</Text>
            <Text style={styles.todayValue}>⭐ 1 adventure ready</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#CFEFFF' },
  world: { flex: 1, backgroundColor: '#CFEFFF', overflow: 'hidden' },
  sun: { position: 'absolute', top: 36, right: 28, width: 84, height: 84, borderRadius: 42, backgroundColor: '#FFF2A8', alignItems: 'center', justifyContent: 'center' },
  sunText: { fontSize: 48 },
  cloud: { position: 'absolute', fontSize: 64, opacity: 0.9 },
  cloudLeft: { top: 88, left: 18 },
  cloudRight: { top: 124, right: 96 },
  topRow: { zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 8 },
  brand: { fontSize: 34, fontWeight: '900', color: '#4A55C7' },
  tagline: { fontSize: 16, fontWeight: '700', color: '#426174', marginTop: 2 },
  parentButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFFCC', alignItems: 'center', justifyContent: 'center' },
  parentButtonText: { fontSize: 22 },
  scene: { flex: 1, marginTop: 6, position: 'relative' },
  hillsBack: { position: 'absolute', left: -80, right: -80, bottom: 170, height: 230, borderTopLeftRadius: 280, borderTopRightRadius: 280, backgroundColor: '#A9D88E' },
  hillsFront: { position: 'absolute', left: -130, right: -30, bottom: 90, height: 220, borderTopLeftRadius: 320, borderTopRightRadius: 320, backgroundColor: '#7FCB72' },
  ground: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 180, backgroundColor: '#69B95D' },
  speech: { position: 'absolute', top: 10, alignSelf: 'center', zIndex: 7, backgroundColor: '#FFFFFFF2', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, maxWidth: 310 },
  speechText: { fontSize: 17, fontWeight: '900', color: '#29404F', textAlign: 'center' },
  characterSpot: { position: 'absolute', alignSelf: 'center', bottom: 118, zIndex: 6 },
  worldZone: { position: 'absolute', alignItems: 'center', justifyContent: 'center', minWidth: 120, minHeight: 130 },
  treeZone: { left: 16, top: 92 },
  pathZone: { right: 12, top: 120 },
  musicZone: { left: 32, bottom: 54 },
  zonePressed: { transform: [{ scale: 0.95 }], opacity: 0.92 },
  zoneIcon: { fontSize: 84 },
  zoneBadge: { marginTop: -4, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 3, borderColor: '#FFF', alignItems: 'center' },
  treeBadge: { backgroundColor: '#F5E49B' },
  pathBadge: { backgroundColor: '#F2D9C6' },
  musicBadge: { backgroundColor: '#DCCDF7' },
  zoneTitle: { fontSize: 15, fontWeight: '900', color: '#38503C', textAlign: 'center' },
  soon: { marginTop: 2, fontSize: 11, fontWeight: '800', color: '#7A6E69' },
  gardenPatch: { position: 'absolute', right: 20, bottom: 36, width: 150, minHeight: 106, borderRadius: 30, backgroundColor: '#DDF4CD', borderWidth: 4, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center', padding: 10 },
  gardenEmoji: { fontSize: 28 },
  gardenTitle: { fontSize: 16, fontWeight: '900', color: '#3A703A', marginTop: 4 },
  gardenCount: { fontSize: 13, fontWeight: '800', color: '#59725A', marginTop: 2 },
  todayBubble: { position: 'absolute', left: 18, bottom: 166, backgroundColor: '#FFF7D4E8', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 3, borderColor: '#FFF' },
  todayLabel: { fontSize: 12, fontWeight: '800', color: '#68747B' },
  todayValue: { fontSize: 15, fontWeight: '900', color: '#2E454F', marginTop: 2 },
});
