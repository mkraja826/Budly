import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { buildCountingEvidence, createLearningEventId } from '../src/domain/learning/events';
import type { SkillId } from '../src/domain/learning/mastery';
import { DefaultChildCharacter } from '../src/features/character/DefaultChildCharacter';
import { childSelectionFeedback, childSuccessFeedback, speakChildPrompt, stopChildSpeech } from '../src/features/feedback/childFeedback';
import { applySkillEvidence } from '../src/features/learningEvidence/childSkillStateStore';
import { appendLearningEvent } from '../src/features/learningEvidence/localEvidenceStore';
import { getCountingActivity } from '../src/features/learningTree/countingActivities';

const LOCAL_CHILD_ID = 'local-child-v1';

export default function ActivityScreen() {
  const params = useLocalSearchParams<{ activity?: string }>();
  const activityIndex = Number.parseInt(params.activity ?? '0', 10) || 0;
  const activity = getCountingActivity(activityIndex);
  const objects = useMemo(() => Array.from({ length: activity.targetCount }, (_, index) => `${activity.id}-${index + 1}`), [activity]);
  const [selected, setSelected] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const celebrated = useRef(false);
  const evidenceRecorded = useRef(false);
  const startedAtMs = useRef(Date.now());
  const complete = selected.length === objects.length;

  const prompt = useMemo(() => {
    if (complete) return `You found ${activity.targetCount} ${activity.objectNamePlural}!`;
    if (selected.length === 0) return `Can you find ${activity.targetCount} ${activity.objectNamePlural}?`;
    return `${selected.length}... keep looking!`;
  }, [activity, complete, selected.length]);

  useEffect(() => {
    setSelected([]);
    setAttempts(0);
    celebrated.current = false;
    evidenceRecorded.current = false;
    startedAtMs.current = Date.now();

    void appendLearningEvent({
      eventId: createLearningEventId('activity_started'),
      eventType: 'ACTIVITY_STARTED',
      occurredAt: new Date().toISOString(),
      childId: LOCAL_CHILD_ID,
      activityId: activity.id,
      activityVersion: 1,
      skillIds: [activity.skillId],
      payload: { targetCount: activity.targetCount, objectType: activity.objectNamePlural },
    });

    void speakChildPrompt(activity.intro);
    return () => {
      void stopChildSpeech();
    };
  }, [activity.id]);

  useEffect(() => {
    if (!complete || celebrated.current) return;
    celebrated.current = true;
    void childSuccessFeedback();
    void speakChildPrompt(activity.success);
  }, [activity.success, complete]);

  useEffect(() => {
    if (!complete || evidenceRecorded.current) return;
    evidenceRecorded.current = true;

    const responseTimeMs = Date.now() - startedAtMs.current;
    const evidence = buildCountingEvidence({
      targetCount: activity.targetCount,
      selectedObjectIds: selected,
      attempts,
      hintsUsed: 0,
      responseTimeMs,
    });
    const completedAt = new Date().toISOString();

    void appendLearningEvent({
      eventId: createLearningEventId('activity_completed'),
      eventType: 'ACTIVITY_COMPLETED',
      occurredAt: completedAt,
      childId: LOCAL_CHILD_ID,
      activityId: activity.id,
      activityVersion: 1,
      skillIds: [activity.skillId],
      payload: {
        targetCount: evidence.targetCount,
        attempts: evidence.attempts,
        responseTimeMs: evidence.responseTimeMs,
        completedIndependently: evidence.completedIndependently,
      },
    });

    void appendLearningEvent({
      eventId: createLearningEventId('skill_evidence'),
      eventType: 'SKILL_EVIDENCE_RECORDED',
      occurredAt: completedAt,
      childId: LOCAL_CHILD_ID,
      activityId: activity.id,
      activityVersion: 1,
      skillIds: [activity.skillId],
      payload: { ...evidence },
    });

    void applySkillEvidence(LOCAL_CHILD_ID, {
      skillId: activity.skillId as SkillId,
      correct: evidence.distinctSelections === evidence.targetCount,
      attempts: Math.max(1, evidence.attempts),
      hintsUsed: evidence.hintsUsed,
      responseTimeMs: evidence.responseTimeMs,
      difficulty: Math.min(1, activity.targetCount / 5),
      independentCompletion: evidence.completedIndependently,
      transferActivity: activityIndex > 0,
      occurredAt: completedAt,
    }).then((update) => {
      if (update.next.mastery !== update.previous.mastery) {
        void appendLearningEvent({
          eventId: createLearningEventId('mastery_changed'),
          eventType: 'SKILL_EVIDENCE_RECORDED',
          occurredAt: completedAt,
          childId: LOCAL_CHILD_ID,
          activityId: activity.id,
          activityVersion: 1,
          skillIds: [activity.skillId],
          payload: {
            kind: 'MASTERY_STATE_CHANGED',
            previousMastery: update.previous.mastery,
            nextMastery: update.next.mastery,
            confidence: update.next.confidence,
            evidenceCount: update.next.evidenceCount,
            engineVersion: update.next.engineVersion,
            reasons: update.reasons,
          },
        });
      }
    });
  }, [activity, activityIndex, attempts, complete, selected]);

  const toggleObject = async (id: string) => {
    if (complete) return;
    setAttempts((current) => current + 1);
    await childSelectionFeedback();

    void appendLearningEvent({
      eventId: createLearningEventId('object_selected'),
      eventType: 'OBJECT_SELECTED',
      occurredAt: new Date().toISOString(),
      childId: LOCAL_CHILD_ID,
      activityId: activity.id,
      activityVersion: 1,
      skillIds: [activity.skillId],
      payload: { objectId: id, alreadySelected: selected.includes(id) },
    });

    setSelected((current) => {
      if (current.includes(id)) return current;
      const next = [...current, id];
      if (next.length < objects.length) void speakChildPrompt(String(next.length));
      return next;
    });
  };

  const continueAfterSuccess = () => {
    const nextIndex = activityIndex + 1;
    if (nextIndex < 3) {
      router.replace(`/activity?activity=${nextIndex}`);
      return;
    }
    router.replace('/garden?earned=seed');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>←</Text>
      </Pressable>

      <View style={styles.content}>
        <DefaultChildCharacter
          size={132}
          pose={complete ? 'celebrate' : 'point'}
          expression={complete ? 'proud' : 'curious'}
          accessibilityLabel={complete ? 'Budly child celebrating' : 'Budly child guiding the counting activity'}
        />

        <Pressable accessibilityLabel="Hear the instruction again" accessibilityRole="button" onPress={() => speakChildPrompt(complete ? activity.success : activity.intro)} style={[styles.speechBubble, complete && styles.speechBubbleComplete]}>
          <Text accessibilityLiveRegion="polite" style={styles.prompt}>{prompt}</Text>
          <Text style={styles.voiceHint}>🔊 Tap to hear again</Text>
        </Pressable>

        <View accessibilityLabel={`${activity.targetCount} ${activity.objectNamePlural} to count`} style={styles.objects}>
          {objects.map((id, index) => {
            const isSelected = selected.includes(id);
            return (
              <Pressable accessibilityLabel={`${activity.objectNameSingular} ${index + 1}${isSelected ? ', counted' : ''}`} accessibilityRole="button" key={id} onPress={() => toggleObject(id)} style={[styles.objectButton, isSelected && styles.objectButtonSelected]}>
                <Text style={styles.objectEmoji}>{activity.emoji}</Text>
                {isSelected ? <Text style={styles.countBadge}>{selected.indexOf(id) + 1}</Text> : null}
              </Pressable>
            );
          })}
        </View>

        <View accessibilityLabel={`${selected.length} of ${activity.targetCount} counted`} style={styles.progressDots}>
          {objects.map((id) => <View key={id} style={[styles.dot, selected.includes(id) && styles.dotDone]} />)}
        </View>

        {complete ? (
          <View style={styles.celebration}>
            <Text accessibilityElementsHidden style={styles.stars}>⭐ ⭐ ⭐</Text>
            <Text style={styles.encouragement}>{activityIndex < 2 ? 'One more adventure!' : 'Great counting!'}</Text>
            <Pressable accessibilityLabel={activityIndex < 2 ? 'Continue to next counting adventure' : 'Collect your seed reward'} accessibilityRole="button" onPress={continueAfterSuccess} style={styles.action}>
              <Text style={styles.actionText}>{activityIndex < 2 ? 'Next adventure →' : 'Collect my seed 🌱'}</Text>
            </Pressable>
          </View>
        ) : <Text style={styles.helper}>Tap each one as you count.</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EAF7FF', padding: 18 },
  back: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 32, fontWeight: '900', color: '#29404F' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 },
  speechBubble: { width: '100%', maxWidth: 440, backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 18, borderRadius: 30, alignItems: 'center', gap: 8 },
  speechBubbleComplete: { backgroundColor: '#FFF9D7' },
  prompt: { fontSize: 28, lineHeight: 34, fontWeight: '900', color: '#29404F', textAlign: 'center' },
  voiceHint: { fontSize: 15, fontWeight: '700', color: '#657985', textAlign: 'center' },
  objects: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 430 },
  objectButton: { width: 86, height: 86, borderRadius: 43, backgroundColor: '#FFF', borderWidth: 4, borderColor: '#D7ECF6', alignItems: 'center', justifyContent: 'center' },
  objectButtonSelected: { borderColor: '#62B84F', transform: [{ scale: 1.06 }], backgroundColor: '#F3FFE9' },
  objectEmoji: { fontSize: 54 },
  countBadge: { position: 'absolute', right: -3, top: -3, minWidth: 32, height: 32, borderRadius: 16, backgroundColor: '#FFD34E', color: '#473D18', textAlign: 'center', lineHeight: 32, fontSize: 18, fontWeight: '900' },
  progressDots: { flexDirection: 'row', gap: 10 },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#C7D7DF' },
  dotDone: { backgroundColor: '#62B84F' },
  helper: { fontSize: 17, fontWeight: '700', color: '#657985' },
  celebration: { alignItems: 'center', gap: 12 },
  stars: { fontSize: 30 },
  encouragement: { fontSize: 22, fontWeight: '900', color: '#3A703A' },
  action: { minWidth: 250, minHeight: 72, borderRadius: 36, backgroundColor: '#62B84F', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 26 },
  actionText: { color: '#FFF', fontSize: 20, fontWeight: '900' },
});
