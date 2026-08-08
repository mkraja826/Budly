export const DEVELOPMENTAL_STAGES = [
  'SEED',
  'SPROUT',
  'EXPLORER',
  'CREATOR',
] as const;

export type DevelopmentalStage = (typeof DEVELOPMENTAL_STAGES)[number];

export type AgeYears = number;

export function developmentalStageForAge(ageYears: AgeYears): DevelopmentalStage {
  if (!Number.isFinite(ageYears)) {
    throw new Error('Age must be a finite number.');
  }

  if (ageYears >= 3 && ageYears < 5) return 'SEED';
  if (ageYears >= 5 && ageYears < 7) return 'SPROUT';
  if (ageYears >= 7 && ageYears < 9) return 'EXPLORER';
  if (ageYears >= 9 && ageYears <= 10) return 'CREATOR';

  throw new RangeError('Budly currently supports children aged 3 through 10.');
}

export type DevelopmentalExperienceProfile = Readonly<{
  stage: DevelopmentalStage;
  voiceFirst: boolean;
  pictureFirst: boolean;
  readingDemand: 'MINIMAL' | 'LOW' | 'MODERATE' | 'HIGHER';
  navigationComplexity: 'VERY_LOW' | 'LOW' | 'MODERATE';
  typicalActivityMinutes: Readonly<{ min: number; max: number }>;
}>;

export const DEVELOPMENTAL_EXPERIENCE_PROFILES: Readonly<
  Record<DevelopmentalStage, DevelopmentalExperienceProfile>
> = {
  SEED: {
    stage: 'SEED',
    voiceFirst: true,
    pictureFirst: true,
    readingDemand: 'MINIMAL',
    navigationComplexity: 'VERY_LOW',
    typicalActivityMinutes: { min: 2, max: 5 },
  },
  SPROUT: {
    stage: 'SPROUT',
    voiceFirst: true,
    pictureFirst: true,
    readingDemand: 'LOW',
    navigationComplexity: 'LOW',
    typicalActivityMinutes: { min: 3, max: 7 },
  },
  EXPLORER: {
    stage: 'EXPLORER',
    voiceFirst: false,
    pictureFirst: false,
    readingDemand: 'MODERATE',
    navigationComplexity: 'MODERATE',
    typicalActivityMinutes: { min: 5, max: 10 },
  },
  CREATOR: {
    stage: 'CREATOR',
    voiceFirst: false,
    pictureFirst: false,
    readingDemand: 'HIGHER',
    navigationComplexity: 'MODERATE',
    typicalActivityMinutes: { min: 7, max: 15 },
  },
};
