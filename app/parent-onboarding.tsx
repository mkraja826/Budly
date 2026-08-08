import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { setActiveChildId } from '../src/features/family/activeChildStore';
import { createFamilyWithFirstChild, listMyChildProfiles } from '../src/features/family/familyService';

export default function ParentOnboardingScreen() {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void listMyChildProfiles().then(async (children) => {
      if (!active || children.length === 0) return;
      await setActiveChildId(children[0].id);
      router.replace('/');
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const createChild = async () => {
    setBusy(true);
    try {
      const child = await createFamilyWithFirstChild({
        childDisplayName: name.trim() || undefined,
        learningLanguage: 'en',
        locale: 'en-IN',
      });
      await setActiveChildId(child.id);
      router.replace('/');
    } catch (error) {
      Alert.alert('Could not create profile', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Budly family setup</Text>
        <Text style={styles.title}>Create your child’s profile</Text>
        <Text style={styles.copy}>For the first build, Budly only needs a display name. More profile details can be added later by the parent.</Text>
        <TextInput placeholder="Child display name (optional)" value={name} onChangeText={setName} style={styles.input} />
        <Pressable disabled={busy} onPress={createChild} style={styles.primary}>
          <Text style={styles.primaryText}>{busy ? 'Creating…' : 'Start Budly 🌱'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EEF8EE', padding: 20, justifyContent: 'center' },
  card: { backgroundColor: '#FFF', borderRadius: 30, padding: 26, gap: 14 },
  eyebrow: { fontSize: 14, fontWeight: '900', color: '#5D7C62' },
  title: { fontSize: 29, lineHeight: 35, fontWeight: '900', color: '#29404F' },
  copy: { fontSize: 16, lineHeight: 24, color: '#667085' },
  input: { minHeight: 58, borderRadius: 18, backgroundColor: '#F4F7F4', paddingHorizontal: 16, fontSize: 17, color: '#29404F' },
  primary: { minHeight: 62, borderRadius: 31, backgroundColor: '#62B84F', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  primaryText: { color: '#FFF', fontSize: 19, fontWeight: '900' },
});
