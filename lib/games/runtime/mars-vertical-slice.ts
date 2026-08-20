export type MarsSliceStep =
  | 'auth-a'
  | 'auth-b'
  | 'ship-enter-a'
  | 'crew-join-b'
  | 'select-mars'
  | 'pretravel-checkpoint'
  | 'travel-transition'
  | 'mars-arrival'
  | 'canyon-mission-start'
  | 'live-chat'
  | 'mission-checkpoint'
  | 'disconnect-a'
  | 'disconnect-b'
  | 'rejoin-a'
  | 'rejoin-b'
  | 'restore-state'
  | 'panic-mode'
  | 'verified-recovery';

export interface MarsSliceEvidence {
  step: MarsSliceStep;
  passed: boolean;
  evidenceRef: string;
  observedAt: string;
  latencyMs?: number;
  notes?: string;
}

export interface MarsSliceResult {
  green: boolean;
  missing: MarsSliceStep[];
  failed: MarsSliceStep[];
  evidenceCount: number;
}

export const REQUIRED_MARS_SLICE_STEPS: readonly MarsSliceStep[] = [
  'auth-a',
  'auth-b',
  'ship-enter-a',
  'crew-join-b',
  'select-mars',
  'pretravel-checkpoint',
  'travel-transition',
  'mars-arrival',
  'canyon-mission-start',
  'live-chat',
  'mission-checkpoint',
  'disconnect-a',
  'disconnect-b',
  'rejoin-a',
  'rejoin-b',
  'restore-state',
  'panic-mode',
  'verified-recovery',
];

export function evaluateMarsVerticalSlice(evidence: MarsSliceEvidence[]): MarsSliceResult {
  const byStep = new Map(evidence.map((x) => [x.step, x]));
  const missing = REQUIRED_MARS_SLICE_STEPS.filter((step) => !byStep.has(step));
  const failed = REQUIRED_MARS_SLICE_STEPS.filter((step) => byStep.has(step) && !byStep.get(step)!.passed);
  const everyHasEvidence = evidence.every((x) => Boolean(x.evidenceRef));
  return {
    green: missing.length === 0 && failed.length === 0 && everyHasEvidence,
    missing,
    failed,
    evidenceCount: evidence.length,
  };
}

export const MARS_SLICE_INVARIANTS = Object.freeze({
  sameCanonicalPlayerStateBeforeAndAfterReconnect: true,
  serverAuthoritativeCrewMembership: true,
  checkpointBeforeTravel: true,
  checkpointAfterMissionProgress: true,
  liveChatUsesAuthenticatedIdentity: true,
  panicModeDoesNotDeleteCheckpoint: true,
  panicModeBlocksPrivilegedEconomyAndExternalDeviceActions: true,
  recoveryRequiresKnownGoodState: true,
});
