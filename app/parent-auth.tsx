import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../src/infrastructure/supabase/client';

export default function ParentAuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const signIn = async () => {
    if (!email.trim() || !password) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      Alert.alert('Could not sign in', error.message);
      return;
    }
    router.replace('/parent-onboarding');
  };

  const signUp = async () => {
    if (!email.trim() || password.length < 8) {
      Alert.alert('Check details', 'Use a valid email and a password with at least 8 characters.');
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      Alert.alert('Could not create account', error.message);
      return;
    }
    Alert.alert('Account created', 'If email confirmation is enabled, confirm your email, then sign in.');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>←</Text></Pressable>
      <View style={styles.card}>
        <Text style={styles.title}>Parent sign in</Text>
        <Text style={styles.copy}>Create and manage your child’s protected Budly profile.</Text>
        <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput secureTextEntry autoComplete="password" placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} />
        <Pressable disabled={busy} onPress={signIn} style={styles.primary}><Text style={styles.primaryText}>{busy ? 'Please wait…' : 'Sign in'}</Text></Pressable>
        <Pressable disabled={busy} onPress={signUp} style={styles.secondary}><Text style={styles.secondaryText}>Create parent account</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC', padding: 18 },
  back: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 28, fontWeight: '900', color: '#334155' },
  card: { marginTop: 48, backgroundColor: '#FFF', borderRadius: 28, padding: 24, gap: 14 },
  title: { fontSize: 28, fontWeight: '900', color: '#263244' },
  copy: { fontSize: 16, lineHeight: 23, color: '#667085' },
  input: { minHeight: 56, borderRadius: 16, backgroundColor: '#F3F5F8', paddingHorizontal: 16, fontSize: 17, color: '#263244' },
  primary: { minHeight: 58, borderRadius: 29, backgroundColor: '#6550A8', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  primaryText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  secondary: { minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: '#6550A8', fontSize: 16, fontWeight: '800' },
});
