export type GameQualityTier = 'safe-lite' | 'standard' | 'high' | 'ultra' | 'xr' | 'holo-multiview';

export interface RuntimeTelemetry {
  fps: number;
  frameTimeMs: number;
  droppedFramePct: number;
  inputLatencyMs?: number;
  rttMs?: number;
  jitterMs?: number;
  packetLossPct?: number;
  thermalThrottling?: boolean;
  xrActive?: boolean;
  gpuMemoryMbEstimate?: number;
}

export interface GameQualityBudget {
  tier: GameQualityTier;
  targetFps: number;
  maxFrameTimeMs: number;
  maxDynamicLights: number;
  maxShadowCasters: number;
  maxVisibleParticles: number;
  textureScale: number;
  maxConcurrentPlayersRendered: number;
  volumetrics: 'off' | 'low' | 'medium' | 'high';
  postFx: 'minimal' | 'balanced' | 'cinematic';
  multiviewCount: number;
}

export const GAME_QUALITY_BUDGETS: readonly GameQualityBudget[] = [
  { tier: 'safe-lite', targetFps: 30, maxFrameTimeMs: 33.3, maxDynamicLights: 2, maxShadowCasters: 1, maxVisibleParticles: 300, textureScale: 0.5, maxConcurrentPlayersRendered: 8, volumetrics: 'off', postFx: 'minimal', multiviewCount: 1 },
  { tier: 'standard', targetFps: 60, maxFrameTimeMs: 16.7, maxDynamicLights: 6, maxShadowCasters: 3, maxVisibleParticles: 1500, textureScale: 0.75, maxConcurrentPlayersRendered: 24, volumetrics: 'low', postFx: 'balanced', multiviewCount: 1 },
  { tier: 'high', targetFps: 60, maxFrameTimeMs: 16.7, maxDynamicLights: 10, maxShadowCasters: 5, maxVisibleParticles: 4000, textureScale: 1, maxConcurrentPlayersRendered: 48, volumetrics: 'medium', postFx: 'balanced', multiviewCount: 1 },
  { tier: 'ultra', targetFps: 60, maxFrameTimeMs: 16.7, maxDynamicLights: 16, maxShadowCasters: 8, maxVisibleParticles: 8000, textureScale: 1, maxConcurrentPlayersRendered: 80, volumetrics: 'high', postFx: 'cinematic', multiviewCount: 1 },
  { tier: 'xr', targetFps: 72, maxFrameTimeMs: 13.9, maxDynamicLights: 6, maxShadowCasters: 3, maxVisibleParticles: 2500, textureScale: 0.85, maxConcurrentPlayersRendered: 24, volumetrics: 'low', postFx: 'balanced', multiviewCount: 2 },
  { tier: 'holo-multiview', targetFps: 60, maxFrameTimeMs: 16.7, maxDynamicLights: 5, maxShadowCasters: 2, maxVisibleParticles: 2200, textureScale: 0.8, maxConcurrentPlayersRendered: 20, volumetrics: 'low', postFx: 'balanced', multiviewCount: 8 },
];

export function recommendedQuality(telemetry: RuntimeTelemetry): GameQualityTier {
  if (telemetry.thermalThrottling || telemetry.fps < 28 || telemetry.frameTimeMs > 36 || telemetry.droppedFramePct > 8) return 'safe-lite';
  if ((telemetry.packetLossPct ?? 0) > 4 || (telemetry.rttMs ?? 0) > 220 || telemetry.fps < 50) return 'standard';
  if (telemetry.xrActive) return 'xr';
  if (telemetry.fps >= 58 && telemetry.frameTimeMs <= 17.5 && !telemetry.thermalThrottling) return 'high';
  return 'standard';
}

export const GAMEPLAY_QUALITY_RULES = Object.freeze({
  measuredNotMarketed: true,
  neverClaim50xWithoutBenchmark: true,
  gameplayAuthorityIndependentOfGraphics: true,
  lowerQualityBeforeDisconnect: true,
  lowPolyFallback: true,
  reducedMotionSupported: true,
  accessibilityPreservedAcrossTiers: true,
});
