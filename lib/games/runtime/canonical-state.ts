export type VerseScope = "metaverse" | "middleverse" | "multiverse" | "omniverse" | "quantum-verse" | "holoverse";

export interface CanonicalPlayerState {
  userId: string;
  avatarId?: string;
  currentWorldId: string;
  currentVerse: VerseScope;
  xp: number;
  level: number;
  reputation: number;
  inventoryAssetIds: string[];
  unlockedWorldIds: string[];
  completedMissionIds: string[];
  discoveredSecretIds: string[];
  activeCheckpointId?: string;
  accessibilityProfileId?: string;
  revision: number;
  updatedAt: string;
}

export interface WorldCheckpoint {
  checkpointId: string;
  userId: string;
  worldId: string;
  verse: VerseScope;
  missionId?: string;
  position?: { x: number; y: number; z: number };
  rotationY?: number;
  durableStateHash: string;
  createdAt: string;
  revision: number;
}

export interface GameRewardIntent {
  rewardId: string;
  userId: string;
  source: "mission" | "tournament" | "creator-event" | "education" | "achievement";
  xp?: number;
  reputation?: number;
  gamePoints?: number;
  realEarningsMinor?: number;
  currency?: string;
}

export function validateCanonicalPlayerState(state: CanonicalPlayerState): string[] {
  const errors: string[] = [];
  if (!state.userId) errors.push("missing-user-id");
  if (!state.currentWorldId) errors.push("missing-world-id");
  if (!Number.isSafeInteger(state.xp) || state.xp < 0) errors.push("invalid-xp");
  if (!Number.isSafeInteger(state.level) || state.level < 0) errors.push("invalid-level");
  if (!Number.isSafeInteger(state.revision) || state.revision < 0) errors.push("invalid-revision");
  return errors;
}

/**
 * Game progression is allowed to grant XP/reputation/game points. Any real
 * earnings are only a request to the Money Engine and never a client-side
 * balance mutation.
 */
export function classifyReward(intent: GameRewardIntent) {
  if (intent.realEarningsMinor !== undefined) {
    if (!Number.isSafeInteger(intent.realEarningsMinor) || intent.realEarningsMinor < 0) {
      throw new Error("real earnings must use non-negative integer minor units");
    }
    if (!intent.currency) throw new Error("currency required for real earnings intent");
    return {
      kind: "money-engine-review" as const,
      serverAuthoritative: true,
      directWalletMutationAllowed: false,
    };
  }

  return {
    kind: "game-progression" as const,
    serverAuthoritative: true,
    directWalletMutationAllowed: false,
  };
}

export function nextPlayerRevision(state: CanonicalPlayerState, patch: Partial<CanonicalPlayerState>): CanonicalPlayerState {
  const next: CanonicalPlayerState = {
    ...state,
    ...patch,
    userId: state.userId,
    revision: state.revision + 1,
    updatedAt: new Date().toISOString(),
  };
  const errors = validateCanonicalPlayerState(next);
  if (errors.length) throw new Error(`invalid canonical player state: ${errors.join(",")}`);
  return next;
}
