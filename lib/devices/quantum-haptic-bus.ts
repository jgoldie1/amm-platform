export type HapticDeviceClass =
  | 'mobile'
  | 'gamepad'
  | 'xr-controller'
  | 'wearable'
  | 'lighting'
  | 'bluetooth'
  | 'lovense-compatible';

export type HapticEventKind =
  | 'music-beat'
  | 'live-gift'
  | 'pk-score'
  | 'game-impact'
  | 'xr-spatial-cue'
  | 'accessibility-cue'
  | 'stage-effect'
  | 'private-adult-haptic';

export type HapticCapabilities = {
  vibration: boolean;
  intensityLevels?: number;
  durationMsMax?: number;
  supportsPatterns?: boolean;
  supportsSpatialZones?: boolean;
};

export type HapticSessionPolicy = {
  userId: string;
  sessionId: string;
  deviceClass: HapticDeviceClass;
  explicitOptIn: boolean;
  remoteControlEnabled: boolean;
  adultVerified?: boolean;
  territoryEligible?: boolean;
  maxIntensity01: number;
  maxPulseMs: number;
  expiresAt: string;
};

export type HapticEvent = {
  kind: HapticEventKind;
  intensity01: number;
  durationMs: number;
  pattern?: number[];
  sourceId?: string;
};

export type HapticCommand = {
  intensity01: number;
  durationMs: number;
  pattern?: number[];
  allow: boolean;
  reason?: string;
};

export function authorizeHapticEvent(
  policy: HapticSessionPolicy,
  event: HapticEvent,
  capabilities: HapticCapabilities,
  now = new Date(),
): HapticCommand {
  if (!policy.explicitOptIn) return { intensity01: 0, durationMs: 0, allow: false, reason: 'opt_in_required' };
  if (Date.parse(policy.expiresAt) <= now.getTime()) return { intensity01: 0, durationMs: 0, allow: false, reason: 'session_expired' };

  if (event.kind === 'private-adult-haptic') {
    if (!policy.adultVerified) return { intensity01: 0, durationMs: 0, allow: false, reason: 'adult_verification_required' };
    if (!policy.territoryEligible) return { intensity01: 0, durationMs: 0, allow: false, reason: 'territory_not_eligible' };
    if (!policy.remoteControlEnabled && event.sourceId && event.sourceId !== policy.userId) {
      return { intensity01: 0, durationMs: 0, allow: false, reason: 'remote_control_not_authorized' };
    }
  }

  const maxDeviceDuration = capabilities.durationMsMax ?? policy.maxPulseMs;
  return {
    intensity01: Math.max(0, Math.min(event.intensity01, policy.maxIntensity01, 1)),
    durationMs: Math.max(0, Math.min(event.durationMs, policy.maxPulseMs, maxDeviceDuration)),
    pattern: capabilities.supportsPatterns ? event.pattern?.slice(0, 64) : undefined,
    allow: capabilities.vibration,
    reason: capabilities.vibration ? undefined : 'device_has_no_haptic_capability',
  };
}

export function emergencyStopCommand(): HapticCommand {
  return { intensity01: 0, durationMs: 0, pattern: [], allow: true, reason: 'emergency_stop' };
}

export function quantumBeatEvent(amplitude01: number, beatDurationMs = 80): HapticEvent {
  return {
    kind: 'music-beat',
    intensity01: Math.max(0, Math.min(amplitude01, 1)),
    durationMs: Math.max(20, Math.min(beatDurationMs, 250)),
  };
}
