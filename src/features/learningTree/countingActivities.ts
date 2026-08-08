export type CountingActivity = {
  id: string;
  skillId: 'MATH.NUMBERS.COUNTING.01';
  objectNameSingular: string;
  objectNamePlural: string;
  emoji: string;
  targetCount: number;
  intro: string;
  success: string;
};

export const COUNTING_ACTIVITIES: CountingActivity[] = [
  {
    id: 'ACT.COUNTING.OBJECTS.00001',
    skillId: 'MATH.NUMBERS.COUNTING.01',
    objectNameSingular: 'apple',
    objectNamePlural: 'apples',
    emoji: '🍎',
    targetCount: 3,
    intro: 'Can you find three apples? Tap each apple as you count.',
    success: 'Yay! You found three apples! Great counting!',
  },
  {
    id: 'ACT.COUNTING.OBJECTS.00002',
    skillId: 'MATH.NUMBERS.COUNTING.01',
    objectNameSingular: 'duck',
    objectNamePlural: 'ducks',
    emoji: '🦆',
    targetCount: 2,
    intro: 'Can you find two ducks? Tap each duck as you count.',
    success: 'Wonderful! You found two ducks!',
  },
  {
    id: 'ACT.COUNTING.OBJECTS.00003',
    skillId: 'MATH.NUMBERS.COUNTING.01',
    objectNameSingular: 'star',
    objectNamePlural: 'stars',
    emoji: '⭐',
    targetCount: 4,
    intro: 'Can you find four stars? Tap each star as you count.',
    success: 'Amazing! You counted four stars!',
  },
  {
    id: 'ACT.COUNTING.OBJECTS.00004',
    skillId: 'MATH.NUMBERS.COUNTING.01',
    objectNameSingular: 'block',
    objectNamePlural: 'blocks',
    emoji: '🧱',
    targetCount: 3,
    intro: 'Can you find three blocks? Tap each block as you count.',
    success: 'Great job! You counted three blocks!',
  },
  {
    id: 'ACT.COUNTING.OBJECTS.00005',
    skillId: 'MATH.NUMBERS.COUNTING.01',
    objectNameSingular: 'flower',
    objectNamePlural: 'flowers',
    emoji: '🌼',
    targetCount: 5,
    intro: 'Can you find five flowers? Tap each flower as you count.',
    success: 'Beautiful counting! You found five flowers!',
  },
];

export function getCountingActivity(index: number): CountingActivity {
  const safeIndex = ((index % COUNTING_ACTIVITIES.length) + COUNTING_ACTIVITIES.length) % COUNTING_ACTIVITIES.length;
  return COUNTING_ACTIVITIES[safeIndex];
}
