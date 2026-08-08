import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { DefaultChildCharacter } from '../src/features/character/DefaultChildCharacter';

const APPLES = ['apple-1', 'apple-2', 'apple-3'] as const;

export default function ActivityScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const complete = selected.length === APPLES.length;

  const prompt = useMemo(() => {
    if (complete) return 'You found THREE apples!';
    if (selected.length === 0) return 'Can you find THREE apples?';
    return `${selected.length}... keep looking!`;
  }, [complete, selected.length]);

  const toggleApple = (id: string) => {
    if (complete) return;
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>←</Text>
      </Pressable>

      <View style={styles.content}>
        <DefaultChildCharacter
          size={138}
          pose={complete ? 'celebrate' : 'point'}
          expression={complete ? 'proud' : 'curious'}
          accessibilityLabel={complete ? 'Budly child celebrating' : 'Budly child pointing to the counting activity'}
        />

        <View style={[styles.speechBubble, complete && styles.speechBubbleComplete]}>
          <Text accessibilityLiveRegion="polite" style={styles.prompt}>{prompt}</Text>
          <Text style={styles.voiceHint}>🔊 Tap the apples as you count</Text>
        </View>

        <View accessibilityLabel="Three apples to count" style={styles.objects}>
          {APPLES.map((apple, index) => {
            const isSelected = selected.includes(apple);
            return (
              <Pressable
                accessibilityLabel={`Apple ${index + 1}${isSelected ? ', counted' : ''}`}
                accessibilityRole="button"
                key={apple}
                onPress={() => toggleApple(apple)}
                style={[styles.appleButton, isSelected && styles.appleButtonSelected]}
              >
                <Text style={styles.apple}>🍎</Text>
                {isSelected ? <Text style={styles.countBadge}>{selected.indexOf(apple) + 1}</Text> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.progressDots}>
          {APPLES.map((apple) => <View key={apple} style={[styles.dot, selected.includes(apple) && styles.dotDone]} />)}
        </View>

        {complete ? (
          <View style={styles.celebration}>
            <Text style={styles.stars}>⭐ ⭐ ⭐</Text>
            <Text style={styles.encouragement}>Great counting!</Text>
            <Pressable accessibilityLabel="Collect your seed reward" accessibilityRole="button" onPress={() => router.replace('/garden?earned=seed')} style={styles.action}>
              <Text style={styles.actionText}>Collect my seed 🌱</Text>
            </Pressable>
          </View>
        ) : <Text style={styles.helper}>Tap each apple once.</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EAF7FF', padding: 18 },
  back: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 32, fontWeight: '900', color: '#29404F' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  speechBubble: { width: '100%', maxWidth: 440, backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 20, borderRadius: 30, alignItems: 'center', gap: 8 },
  speechBubbleComplete: { backgroundColor: '#FFF9D7' },
  prompt: { fontSize: 30, lineHeight: 36, fontWeight: '900', color: '#29404F', textAlign: 'center' },
  voiceHint: { fontSize: 15, fontWeight: '700', color: '#657985', textAlign: 'center' },
  objects: { flexDirection: 'row', gap: 14, flexWrap: 'wrap', justifyContent: 'center' },
  appleButton: { width: 94, height: 94, borderRadius: 47, backgroundColor: '#FFF', borderWidth: 4, borderColor: '#D7ECF6', alignItems: 'center', justifyContent: 'center' },
  appleButtonSelected: { borderColor: '#62B84F', transform: [{ scale: 1.06 }] },
  apple: { fontSize: 62 },
  countBadge: { position: 'absolute', right: -3, top: -3, minWidth: 32, height: 32, borderRadius: 16, backgroundColor: '#FFD34E', color: '#473D18', textAlign: 'center', lineHeight: 32, fontSize: 18, fontWeight: '900' },
  progressDots: { flexDirection: 'row', gap: 10 },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#C7D7DF' },
  dotDone: { backgroundColor: '#62B84F' },
  helper: { fontSize: 17, fontWeight: '700', color: '#657985' },
  celebration: { alignItems: 'center', gap: 12 },
  stars: { fontSize: 32 },
  encouragement: { fontSize: 22, fontWeight: '900', color: '#3A703A' },
  action: { minWidth: 250, minHeight: 72, borderRadius: 36, backgroundColor: '#62B84F', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 26 },
  actionText: { color: '#FFF', fontSize: 20, fontWeight: '900' },
});
