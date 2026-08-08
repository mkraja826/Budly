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
  mobileCandidateFileName?: string;
  mobileCandidateBytes?: number;
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
  mobileCandidateFileName: 'budly-default-child-mobile-v1.glb',
  mobileCandidateBytes: 16_136_548,
  assetStatus: 'optimized-static',
  hasRig: false,
  animationCount: 0,
  notes: [
    'Approved as the visual reference for the initial Budly child avatar.',
    'The verified mobile candidate reduces embedded textures from 2048px to 1024px while preserving the original mesh and materials.',
    'The current source and mobile candidate have no skin/rig and no embedded animations.',
    'The mobile candidate is not yet the final production asset; geometry optimization and humanoid rigging are still required.',
    'Screens consume the character through a reusable renderer boundary so the final rigged GLB can replace the current fallback without changing learning logic.',
  ],
};
