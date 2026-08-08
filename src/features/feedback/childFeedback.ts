import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';

export type ChildFeedbackOptions = {
  locale?: string;
  rate?: number;
  pitch?: number;
};

export async function speakChildPrompt(
  text: string,
  { locale = 'en-US', rate = 0.86, pitch = 1.03 }: ChildFeedbackOptions = {},
) {
  await Speech.stop();
  Speech.speak(text, {
    language: locale,
    rate,
    pitch,
    volume: 1,
  });
}

export async function stopChildSpeech() {
  await Speech.stop();
}

export async function childSelectionFeedback() {
  try {
    await Haptics.selectionAsync();
  } catch {
    // Haptics are optional feedback. Learning interactions must never depend on them.
  }
}

export async function childSuccessFeedback() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Success remains fully visible/audible even when haptics are unavailable.
  }
}
