import { router } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ParentGateScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close parent space" onPress={() => router.back()} style={styles.close}>
        <Text style={styles.closeText}>×</Text>
      </Pressable>
      <View style={styles.card}>
        <Text style={styles.lock}>🔒</Text>
        <Text style={styles.title}>Parents only</Text>
        <Text style={styles.copy}>Production authentication will protect this space. For the current development build, continue to view the real local learning progress.</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Open learning progress" onPress={() => router.push('/parent-progress')} style={styles.button}>
          <Text style={styles.buttonText}>View learning progress</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to Budly" onPress={() => router.back()} style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Back to Budly</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3EEFF', padding: 18 },
  close: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 32, color: '#57476E' },
  card: { margin: 24, marginTop: 80, backgroundColor: '#FFF', borderRadius: 34, padding: 32, alignItems: 'center', gap: 15 },
  lock: { fontSize: 48 },
  title: { fontSize: 30, fontWeight: '900', color: '#413556' },
  copy: { fontSize: 17, lineHeight: 25, textAlign: 'center', color: '#695F76' },
  button: { marginTop: 10, minHeight: 62, borderRadius: 31, backgroundColor: '#6550A8', justifyContent: 'center', paddingHorizontal: 24 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  secondaryButton: { minHeight: 50, justifyContent: 'center', paddingHorizontal: 20 },
  secondaryText: { color: '#6550A8', fontSize: 16, fontWeight: '800' },
});
