export type CharacterPose =
  | 'idle'
  | 'wave'
  | 'point'
  | 'listen'
  | 'think'
  | 'celebrate'
  | 'tryAgain';

export type CharacterExpression =
  | 'neutral'
  | 'happy'
  | 'excited'
  | 'curious'
  | 'thinking'
  | 'proud'
  | 'encouraging';

export type CharacterAssetStatus = 'reference-only' | 'optimized-static' | 'rigged-animated';

export interface CharacterManifest {
  id: string;
  displayName: string;
  sourceFileName: string;
  sourceFormat: 'glb';
  sourceBytes: number;
  assetStatus: CharacterAssetStatus;
  hasRig: boolean;
  animationCount: number;
  notes: string[];
}

export const DEFAULT_CHILD_CHARACTER: CharacterManifest = {
  id: 'character.default-child.v1',
  displayName: 'Budly Default Child',
  sourceFileName: 'wings_of_freedom-child-3741.glb',
  sourceFormat: 'glb',
  sourceBytes: 28_631_364,
  assetStatus: 'reference-only',
  hasRig: false,
  animationCount: 0,
  notes: [
    'Approved as the visual reference for the initial Budly child avatar.',
    'Source GLB is intentionally not bundled until it is optimized for mobile.',
    'Current source has no skin/rig and no embedded animations.',
    'Screens consume the character through a reusable renderer boundary so the optimized GLB can replace the fallback without changing learning logic.',
  ],
};
