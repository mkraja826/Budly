import { StyleSheet, Text, View } from 'react-native';
import type { CharacterExpression, CharacterPose } from './characterManifest';

type Props = {
  size?: number;
  pose?: CharacterPose;
  expression?: CharacterExpression;
  accessibilityLabel?: string;
};

const poseGlyph: Record<CharacterPose, string> = {
  idle: '🙂',
  wave: '👋',
  point: '👉',
  listen: '👂',
  think: '🤔',
  celebrate: '🙌',
  tryAgain: '💪',
};

export function DefaultChildCharacter({
  size = 150,
  pose = 'idle',
  accessibilityLabel = 'Budly child character',
}: Props) {
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.frame, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <View style={styles.body}>
        <View style={styles.head}><Text style={[styles.face, { fontSize: size * 0.34 }]}>🧒</Text></View>
        <View style={styles.shirt}>
          <Text style={[styles.sun, { fontSize: size * 0.12 }]}>☀️</Text>
        </View>
      </View>
      <Text accessibilityElementsHidden style={[styles.pose, { fontSize: size * 0.2 }]}>{poseGlyph[pose]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: '#BFE7A8',
    borderWidth: 6,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  body: { alignItems: 'center', justifyContent: 'center' },
  head: { zIndex: 2 },
  face: { lineHeight: undefined },
  shirt: {
    marginTop: -9,
    width: 72,
    height: 54,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#3187D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sun: { textAlign: 'center' },
  pose: { position: 'absolute', right: 8, top: 10 },
});
