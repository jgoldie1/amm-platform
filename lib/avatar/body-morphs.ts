export type BodyMorphPreset = 'natural'|'athletic'|'curvy'|'heroic'|'stylized'|'custom';

export type BodyMorphState = {
  preset: BodyMorphPreset;
  height: number;
  shoulderWidth: number;
  chest: number;
  waist: number;
  hips: number;
  glutes: number;
  thighs: number;
  arms: number;
  muscle: number;
  bodyMass: number;
  legLength: number;
  torsoLength: number;
};

const clamp = (value:number,min=0,max=100)=>Math.max(min,Math.min(max,value));

export function normalizeBodyMorphs(input: Partial<BodyMorphState>): BodyMorphState {
  return {
    preset: input.preset ?? 'custom',
    height: clamp(input.height ?? 50),
    shoulderWidth: clamp(input.shoulderWidth ?? 50),
    chest: clamp(input.chest ?? 50),
    waist: clamp(input.waist ?? 50),
    hips: clamp(input.hips ?? 50),
    glutes: clamp(input.glutes ?? 50),
    thighs: clamp(input.thighs ?? 50),
    arms: clamp(input.arms ?? 50),
    muscle: clamp(input.muscle ?? 50),
    bodyMass: clamp(input.bodyMass ?? 50),
    legLength: clamp(input.legLength ?? 50),
    torsoLength: clamp(input.torsoLength ?? 50),
  };
}

export const bodyMorphRules = [
  'Avatar morph controls are cosmetic/game-character customization, not medical advice or surgical outcome simulation.',
  'Do not infer health, sex, gender identity, age, fertility, race, or other sensitive traits from avatar body settings.',
  'Never use body geometry for identity matching or biometric authentication.',
  'Preserve rig compatibility, collision bounds, clothing fit, animation retargeting and XR comfort across morph levels.',
  'Allow reset-to-neutral, saved presets and per-world costume overrides without changing the user account identity.',
] as const;

export const bodyMorphTargets = {
  chest: ['chest_scale','upper_torso_volume'],
  hips: ['hip_width','pelvis_volume'],
  glutes: ['glute_projection','glute_volume'],
  waist: ['waist_width','abdomen_volume'],
  shoulders: ['shoulder_width'],
  muscle: ['muscle_definition'],
  bodyMass: ['global_soft_tissue_volume'],
} as const;
