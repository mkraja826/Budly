import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ChildSkillState, SkillId } from '../src/domain/learning/mastery';
import { getChildSkillState } from '../src/features/learningEvidence/childSkillStateStore';
import { getReviewPlan } from '../src/features/learningEvidence/reviewScheduleStore';

const LOCAL_CHILD_ID = 'local-child-v1';
const COUNTING_SKILL_ID = 'MATH.NUMBERS.COUNTING.01' as SkillId;

const FALLBACK_STATE: ChildSkillState = {
  skillId: COUNTING_SKILL_ID,
  mastery: 'NOT_INTRODUCED',
  confidence: 0,
  evidenceCount: 0,
  engineVersion: 'mastery-v1',
};

function parentInsight(state: ChildSkillState) {
  if (state.mastery === 'NOT_INTRODUCED') return 'Budly has not gathered enough counting evidence yet.';
  if (state.mastery === 'INTRODUCED' || state.mastery === 'LEARNING') return 'Counting is being introduced. Budly will keep practice short and simple while confidence grows.';
  if (state.mastery === 'DEVELOPING') return 'Counting is developing well. Budly will keep practicing and check retention again soon.';
  if (state.mastery === 'PROFICIENT') return 'Counting is progressing strongly. Budly will use slightly harder activities and spaced review.';
  if (state.mastery === 'MASTERED') return 'Counting appears well learned. Budly will now focus mainly on retention checks and transfer activities.';
  return 'A counting review is due so Budly can confirm the skill is still retained.';
}

export default function ParentProgressScreen() {
  const [state, setState] = useState(FALLBACK_STATE);
  const [reviewDueAt, setReviewDueAt] = useState<string | null>(null);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([
      getChildSkillState(LOCAL_CHILD_ID, COUNTING_SKILL_ID),
      getReviewPlan(LOCAL_CHILD_ID, COUNTING_SKILL_ID),
    ]).then(([skillState, review]) => {
      if (!active) return;
      setState(skillState);
      setReviewDueAt(review?.due_at ?? null);
      setReviewCount(review?.completed_reviews ?? 0);
    });
    return () => { active = false; };
  }, []);

  const confidencePercent = Math.round(state.confidence * 100);
  const reviewText = useMemo(() => {
    if (!reviewDueAt) return 'Not scheduled yet';
    const due = new Date(reviewDueAt);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / 86_400_000);
    if (diffDays <= 0) return 'Due now';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  }, [reviewDueAt]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>Learning Progress</Text>
          <Text style={styles.subtitle}>Parent view</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.domain}>Early Mathematics</Text>
          <Text style={styles.skill}>Counting objects</Text>
          <Text style={styles.insight}>{parentInsight(state)}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Current stage</Text>
            <Text style={styles.metricValue}>{state.mastery.replaceAll('_', ' ')}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Confidence</Text>
            <Text style={styles.metricValue}>{confidencePercent}%</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Evidence gathered</Text>
          <Text style={styles.bigNumber}>{state.evidenceCount}</Text>
          <Text style={styles.explain}>Budly changes the learning path only after multiple observations, not from a single activity.</Text>
        </View>

        <View style={styles.reviewCard}>
          <Text style={styles.sectionTitle}>Next retention check</Text>
          <Text style={styles.reviewValue}>{reviewText}</Text>
          <Text style={styles.explain}>{reviewCount} retention {reviewCount === 1 ? 'check' : 'checks'} completed so far.</Text>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.sectionTitle}>What Budly will do next</Text>
          <Text style={styles.actionText}>{state.confidence < 0.25 ? 'Use smaller counts and gather more independent evidence.' : state.confidence >= 0.55 ? 'Mix normal counting with slightly harder activities and scheduled reviews.' : 'Continue age-appropriate counting practice while confidence develops.'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, paddingBottom: 8 },
  back: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 28, fontWeight: '900', color: '#334155' },
  title: { fontSize: 27, fontWeight: '900', color: '#263244' },
  subtitle: { marginTop: 2, fontSize: 14, fontWeight: '700', color: '#788498' },
  content: { padding: 18, gap: 14, paddingBottom: 40 },
  heroCard: { backgroundColor: '#EAF4FF', borderRadius: 28, padding: 22 },
  domain: { fontSize: 14, fontWeight: '800', color: '#62738B' },
  skill: { marginTop: 4, fontSize: 25, fontWeight: '900', color: '#263244' },
  insight: { marginTop: 12, fontSize: 17, lineHeight: 25, fontWeight: '600', color: '#4C5D73' },
  row: { flexDirection: 'row', gap: 12 },
  metricCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 24, padding: 18 },
  metricLabel: { fontSize: 13, fontWeight: '800', color: '#7B8798' },
  metricValue: { marginTop: 8, fontSize: 20, lineHeight: 25, fontWeight: '900', color: '#2E3A4D' },
  progressCard: { backgroundColor: '#FFF8E7', borderRadius: 24, padding: 20 },
  reviewCard: { backgroundColor: '#EEF9EA', borderRadius: 24, padding: 20 },
  actionCard: { backgroundColor: '#F3EEFF', borderRadius: 24, padding: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '900', color: '#506075' },
  bigNumber: { marginTop: 6, fontSize: 38, fontWeight: '900', color: '#263244' },
  reviewValue: { marginTop: 8, fontSize: 25, fontWeight: '900', color: '#31663A' },
  explain: { marginTop: 8, fontSize: 15, lineHeight: 22, color: '#627086' },
  actionText: { marginTop: 8, fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#564A73' },
});
