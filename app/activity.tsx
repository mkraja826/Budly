import { router } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ActivityScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>←</Text></Pressable>
      <View style={styles.content}>
        <Text style={styles.character}>🧒</Text>
        <Text style={styles.prompt}>Can you find THREE apples?</Text>
        <View style={styles.objects}>
          <Text style={styles.apple}>🍎</Text><Text style={styles.apple}>🍎</Text><Text style={styles.apple}>🍎</Text>
        </View>
        <Pressable onPress={() => router.push('/garden')} style={styles.action}><Text style={styles.actionText}>I found them! ⭐</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EAF7FF', padding: 18 },
  back: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 30, fontWeight: '900' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 26 },
  character: { fontSize: 82 },
  prompt: { fontSize: 28, lineHeight: 35, fontWeight: '900', color: '#29404F', textAlign: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 28 },
  objects: { flexDirection: 'row', gap: 22 },
  apple: { fontSize: 72 },
  action: { minWidth: 230, minHeight: 68, borderRadius: 34, backgroundColor: '#62B84F', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  actionText: { color: '#FFF', fontSize: 20, fontWeight: '900' },
});
