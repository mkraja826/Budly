import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { recommendCountingPractice } from '../src/domain/learning/recommendation';
import type { ChildSkillState, SkillId } from '../src/domain/learning/mastery';
import { DefaultChildCharacter } from '../src/features/character/DefaultChildCharacter';
import { childSelectionFeedback, speakChildPrompt, stopChildSpeech } from '../src/features/feedback/childFeedback';
import { useActiveChildId } from '../src/features/family/useActiveChildId';
import { getChildSkillState } from '../src/features/learningEvidence/childSkillStateStore';
import { getDueReviews } from '../src/features/learningEvidence/reviewScheduleStore';
import { reconcileDerivedLearningState } from '../src/features/sync/derivedLearningStateSync';

const COUNTING_SKILL_ID = 'MATH.NUMBERS.COUNTING.01' as SkillId;

const FALLBACK_STATE: ChildSkillState = {
  skillId: COUNTING_SKILL_ID,
  mastery: 'NOT_INTRODUCED',
  confidence: 0,
  evidenceCount: 0,
  engineVersion: 'mastery-v1',
};

export default function LearningTreeScreen() {
  const { childId, loading: identityLoading } = useActiveChildId();
  const [skillState, setSkillState] = useState<ChildSkillState>(FALLBACK_STATE);
  const [reviewDue, setReviewDue] = useState(false);

  useEffect(() => {
    if (!childId) return;
    let active = true;

    const loadAdaptiveState = async () => {
      await reconcileDerivedLearningState(childId, COUNTING_SKILL_ID);
      const [state, dueReviews] = await Promise.all([
        getChildSkillState(childId, COUNTING_SKILL_ID),
        getDueReviews(childId),
      ]);
      if (!active) return;
      setSkillState(state);
      setReviewDue(dueReviews.some((review) => review.skill_id === COUNTING_SKILL_ID));
    };

    void loadAdaptiveState();
    return () => { active = false; };
  }, [childId]);

  const recommendation = useMemo(() => {
    if (reviewDue) {
      return { kind: 'REVIEW' as const, startActivityIndex: 1, reason: 'A scheduled counting retention check is due.' };
    }
    return recommendCountingPractice(skillState);
  }, [reviewDue, skillState]);

  const guideCopy = useMemo(() => {
    switch (recommendation.kind) {
      case 'EASIER_PRACTICE': return 'Let’s start with a little counting adventure!';
      case 'STRETCH_PRACTICE': return 'You’re ready for a bigger counting adventure!';
      case 'REVIEW': return 'Let’s see what you remember!';
      default: return 'Let’s count together!';
    }
  }, [recommendation.kind]);

  useEffect(() => {
    if (!childId) return;
    void speakChildPrompt(`Welcome to the Learning Tree. ${guideCopy}`);
    return () => { void stopChildSpeech(); };
  }, [childId, guideCopy]);

  const startCounting = async () => {
    if (!childId) {
      router.push('/parent-auth');
      return;
    }
    await childSelectionFeedback();
    await speakChildPrompt(guideCopy);
    const reviewParam = recommendation.kind === 'REVIEW' ? '&review=1' : '';
    router.push(`/activity?activity=${recommendation.startActivityIndex}${reviewParam}`);
  };

  if (!identityLoading && !childId) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.identityCard}>
          <Text style={styles.identityTitle}>Parent setup needed</Text>
          <Text style={styles.identityCopy}>A protected child profile is required before Budly can save learning progress.</Text>
          <Pressable onPress={() => router.push('/parent-auth')} style={styles.identityButton}>
            <Text style={styles.identityButtonText}>Parent setup</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.world}>
        <Pressable accessibilityLabel="Back to Seed World" accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>←</Text></Pressable>
        <Text style={styles.cloudLeft}>☁️</Text>
        <Text style={styles.cloudRight}>☁️</Text>
        <View style={styles.sun}><Text style={styles.sunText}>☀️</Text></View>
        <View style={styles.treeCanopy}><Text style={styles.treeEmoji}>🌳</Text><Text style={styles.appleCluster}>🍎   🍎{`\n`}   🍎   🍎</Text></View>
        <View style={styles.characterSpot}><DefaultChildCharacter size={150} pose="point" expression="curious" accessibilityLabel="Budly child pointing toward the Learning Tree" /></View>
        <Pressable accessibilityLabel="Hear Learning Tree introduction again" accessibilityRole="button" onPress={() => speakChildPrompt(`Welcome to the Learning Tree. ${guideCopy}`)} style={styles.speech}><Text style={styles.speechText}>🔊 {guideCopy}</Text></Pressable>
        <Pressable accessibilityLabel={recommendation.kind === 'REVIEW' ? 'Start counting review' : 'Start adaptive counting adventure'} accessibilityRole="button" onPress={startCounting} style={({ pressed }) => [styles.start, pressed && styles.startPressed]}>
          <Text style={styles.startIcon}>{recommendation.kind === 'REVIEW' ? '🔁' : '🍎'}</Text>
          <Text style={styles.startText}>{recommendation.kind === 'REVIEW' ? 'Remember?' : 'Let’s Count!'}</Text>
        </Pressable>
        <View style={styles.ground} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#DDF4FF' }, world: { flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#DDF4FF' },
  back: { position: 'absolute', zIndex: 20, left: 18, top: 12, width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFFFFFE8', alignItems: 'center', justifyContent: 'center' }, backText: { fontSize: 31, fontWeight: '900', color: '#29404F' },
  cloudLeft: { position: 'absolute', left: 12, top: 92, fontSize: 62, opacity: 0.9 }, cloudRight: { position: 'absolute', right: 20, top: 132, fontSize: 58, opacity: 0.9 },
  sun: { position: 'absolute', right: 28, top: 28, width: 78, height: 78, borderRadius: 39, backgroundColor: '#FFF3B1', alignItems: 'center', justifyContent: 'center' }, sunText: { fontSize: 43 },
  treeCanopy: { position: 'absolute', left: 18, right: 18, top: 112, alignItems: 'center', justifyContent: 'center' }, treeEmoji: { fontSize: 225 }, appleCluster: { position: 'absolute', top: 46, fontSize: 34, lineHeight: 46, textAlign: 'center' },
  characterSpot: { position: 'absolute', left: 28, bottom: 72, zIndex: 10 }, speech: { position: 'absolute', right: 18, bottom: 226, maxWidth: 250, backgroundColor: '#FFFFFFF2', borderRadius: 26, paddingHorizontal: 18, paddingVertical: 14, borderWidth: 3, borderColor: '#FFF' }, speechText: { fontSize: 19, lineHeight: 25, fontWeight: '900', color: '#29404F', textAlign: 'center' },
  start: { position: 'absolute', right: 24, bottom: 82, minWidth: 180, minHeight: 92, borderRadius: 46, backgroundColor: '#67BE55', borderWidth: 5, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, flexDirection: 'row', gap: 10, zIndex: 12 }, startPressed: { transform: [{ scale: 0.96 }], opacity: 0.92 }, startIcon: { fontSize: 34 }, startText: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  ground: { position: 'absolute', left: -40, right: -40, bottom: -80, height: 220, borderTopLeftRadius: 220, borderTopRightRadius: 220, backgroundColor: '#78C96A' },
  identityCard: { margin: 24, marginTop: 120, backgroundColor: '#FFF', borderRadius: 28, padding: 24, gap: 14 }, identityTitle: { fontSize: 26, fontWeight: '900', color: '#29404F' }, identityCopy: { fontSize: 16, lineHeight: 23, color: '#667085' }, identityButton: { minHeight: 58, borderRadius: 29, backgroundColor: '#6550A8', alignItems: 'center', justifyContent: 'center' }, identityButtonText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
});
