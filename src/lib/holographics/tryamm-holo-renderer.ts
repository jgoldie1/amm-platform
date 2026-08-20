export type HoloQuality = 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20;

export type HoloCapabilities = {
  webgl2: boolean;
  webgpu?: boolean;
  xr?: boolean;
  multiview?: boolean;
  lightField?: boolean;
  calibratedHolo5DX?: boolean;
  maxTextureSize?: number;
  prefersReducedMotion?: boolean;
};

export type HoloProfile = {
  level: HoloQuality;
  bloom: number;
  fresnel: number;
  scanlines: number;
  volumetricDensity: number;
  beamStrength: number;
  particles: number;
  chromaticSplit: number;
  glitch: number;
  motionParallax: boolean;
  multiviewCount: number;
  temporalAA: boolean;
  spatialAudio: boolean;
  haptics: boolean;
};

const clamp01 = (v:number) => Math.max(0, Math.min(1, v));

export function resolveHoloProfile(requested:HoloQuality, caps:HoloCapabilities):HoloProfile {
  let level = requested;
  if (caps.prefersReducedMotion && level > 10) level = 10;
  if (!caps.webgl2 && level > 3) level = 3;
  if (!caps.xr && level > 11) level = 11;
  if (level >= 19 && !caps.calibratedHolo5DX) level = 18;

  const t = level / 20;
  const multiviewCount = level >= 19 && caps.calibratedHolo5DX ? 8 : level >= 18 && caps.multiview ? 4 : 1;

  return {
    level,
    bloom: clamp01(0.15 + t * 0.65),
    fresnel: clamp01(0.25 + t * 0.7),
    scanlines: level >= 2 ? clamp01(0.15 + t * 0.35) : 0,
    volumetricDensity: level >= 7 ? clamp01((level - 6) / 18) : 0,
    beamStrength: level >= 4 ? clamp01((level - 3) / 17) : 0,
    particles: level >= 2 ? Math.round(150 + t * 4850) : 0,
    chromaticSplit: level >= 8 ? clamp01((level - 7) / 40) : 0,
    glitch: level >= 2 ? clamp01(0.02 + t * 0.12) : 0,
    motionParallax: level >= 8,
    multiviewCount,
    temporalAA: level >= 12,
    spatialAudio: level >= 6,
    haptics: level >= 16,
  };
}

export type HoloCursorState = {
  active:boolean;
  worldPosition:[number,number,number];
  targetId?:string;
  pulse:number;
  mode:'pointer'|'grab'|'build'|'portal'|'inspect';
};

export function createHoloCursor(mode:HoloCursorState['mode']='pointer'):HoloCursorState {
  return { active:true, worldPosition:[0,0,0], pulse:0, mode };
}

export function tickHoloCursor(cursor:HoloCursorState, dt:number) {
  cursor.pulse = (cursor.pulse + dt * 1.75) % 1;
  return cursor;
}

export type BeamDescriptor = {
  origin:[number,number,number];
  target:[number,number,number];
  radius:number;
  intensity:number;
  falloff:number;
  particles:boolean;
  volumetric:boolean;
};

export function createProjectionBeam(profile:HoloProfile, origin:[number,number,number], target:[number,number,number]):BeamDescriptor {
  return {
    origin,
    target,
    radius: 0.05 + profile.beamStrength * 0.35,
    intensity: 0.5 + profile.beamStrength * 2.5,
    falloff: 1.2 + profile.level / 12,
    particles: profile.level >= 5,
    volumetric: profile.level >= 7,
  };
}

export const ORIGINAL_HOLOGRAPHIC_EFFECTS = {
  photonReconstruction: true,
  fresnelEdgeEmission: true,
  animatedScanlines: true,
  volumetricProjectionBeam: true,
  depthSliceShimmer: true,
  particleAssembly: true,
  gridPulse: true,
  lightRibbonTrails: true,
  portalLensDistortion: true,
  motionParallax: true,
  adaptiveFidelity: true,
  reducedMotionFallback: true,
} as const;
