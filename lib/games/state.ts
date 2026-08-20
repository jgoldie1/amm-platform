export type VerseId =
  | 'streetverse'
  | 'my-world'
  | 'we-are-the-world'
  | 'kingdom'
  | 'starverse'
  | 'holoverse'
  | 'middleverse'
  | 'living-space'
  | string;

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface AccessibilityProfile {
  captions: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  oneHandMode: boolean;
  voiceNavigation: boolean;
  hapticsEnabled: boolean;
  preferredLanguage?: string;
}

export interface WorldCheckpoint {
  checkpointId: string;
  worldId: string;
  verseId: VerseId;
  position?: Vec3;
  rotationY?: number;
  missionId?: string;
  missionStage?: string;
  crewId?: string;
  stateHash?: string;
  savedAt: string;
  revision: number;
}

export interface CanonicalPlayerState {
  userId: string;
  playerId: string;
  avatarId: string;
  worldId: string;
  verseId: VerseId;
  position?: Vec3;
  rotationY?: number;
  xp: number;
  level: number;
  reputation: number;
  inventory: string[];
  assetEntitlements: string[];
  unlockedWorlds: string[];
  completedMissions: string[];
  discoveredSecrets: string[];
  activeCheckpoint?: WorldCheckpoint;
  accessibility: AccessibilityProfile;
  revision: number;
  updatedAt: string;
}

export interface GameEvent {
  id: string;
  worldId: string;
  verseId?: VerseId;
  actorId: string;
  type: string;
  payload: Record<string, unknown>;
  expectedRevision?: number;
  clientTimestamp?: string;
}

export interface ServerGameDecision {
  accepted: boolean;
  reasons: string[];
  nextRevision?: number;
}

/**
 * Client events are requests, never authority. A server/world worker validates
 * movement, mission state, inventory, XP, entitlements, economy, permissions,
 * replay/idempotency and anti-cheat rules before committing canonical state.
 */
export function validateGameEvent(event: GameEvent): ServerGameDecision {
  const reasons: string[] = [];
  if (!event.id || !event.worldId || !event.actorId || !event.type) reasons.push('missing-required-event-identity');
  if (JSON.stringify(event.payload).length > 32_000) reasons.push('event-payload-too-large');
  if (event.expectedRevision !== undefined && (!Number.isSafeInteger(event.expectedRevision) || event.expectedRevision < 0)) {
    reasons.push('invalid-expected-revision');
  }
  return { accepted: reasons.length === 0, reasons };
}

export function canApplyStateRevision(current: CanonicalPlayerState, expectedRevision: number): boolean {
  return current.revision === expectedRevision;
}

export function nextCheckpoint(
  current: CanonicalPlayerState,
  input: Omit<WorldCheckpoint, 'revision' | 'savedAt'> & { savedAt?: string },
): CanonicalPlayerState {
  const nextRevision = current.revision + 1;
  return {
    ...current,
    worldId: input.worldId,
    verseId: input.verseId,
    position: input.position ?? current.position,
    rotationY: input.rotationY ?? current.rotationY,
    activeCheckpoint: {
      ...input,
      savedAt: input.savedAt ?? new Date().toISOString(),
      revision: nextRevision,
    },
    revision: nextRevision,
    updatedAt: new Date().toISOString(),
  };
}

export const CANONICAL_PLAYER_INVARIANTS = Object.freeze({
  oneUser: true,
  oneAvatarIdentity: true,
  oneProgressionRecord: true,
  oneInventory: true,
  oneCheckpointContract: true,
  manyWorlds: true,
  serverAuthoritative: true,
  optimisticRevisionChecks: true,
  clientCannotMintMoney: true,
  clientCannotGrantAssets: true,
});
