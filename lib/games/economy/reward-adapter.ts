export type RewardKind = 'xp' | 'cosmetic' | 'creator-revenue-share' | 'tournament-prize' | 'sponsored-challenge';

export interface GameRewardIntent {
  intentId: string;
  userId: string;
  worldId: string;
  missionId?: string;
  kind: RewardKind;
  value: number;
  currency?: string;
  evidenceRef: string;
  occurredAt: string;
}

export interface RewardEligibilityContext {
  authenticated: boolean;
  ageEligible: boolean;
  jurisdictionEligible: boolean;
  sanctionsClear: boolean;
  antiCheatClear: boolean;
  missionVerified: boolean;
  duplicateIntent: boolean;
  panicMode: boolean;
  realMoneyRewardsEnabled: boolean;
}

export interface RewardDecision {
  allowed: boolean;
  destination: 'progression' | 'entitlement' | 'money-engine' | 'blocked';
  reason: string;
  requiresLedger: boolean;
}

/**
 * Get Paid to Play boundary.
 *
 * XP/cosmetics are game state. Real-value rewards are not game state and must
 * enter the Money Engine only after server-side eligibility, anti-cheat,
 * jurisdiction and duplicate checks. The browser can request a reward but can
 * never credit a payable balance directly.
 */
export function evaluateGameReward(
  intent: GameRewardIntent,
  ctx: RewardEligibilityContext,
): RewardDecision {
  if (!intent.intentId || !intent.userId || !intent.worldId || !intent.evidenceRef) {
    return { allowed: false, destination: 'blocked', reason: 'missing-reward-evidence', requiresLedger: false };
  }
  if (!Number.isFinite(intent.value) || intent.value < 0) {
    return { allowed: false, destination: 'blocked', reason: 'invalid-reward-value', requiresLedger: false };
  }
  if (!ctx.authenticated || ctx.panicMode || ctx.duplicateIntent || !ctx.antiCheatClear || !ctx.missionVerified) {
    return { allowed: false, destination: 'blocked', reason: 'security-or-verification-gate-failed', requiresLedger: false };
  }

  if (intent.kind === 'xp') {
    return { allowed: true, destination: 'progression', reason: 'verified-game-progression', requiresLedger: false };
  }

  if (intent.kind === 'cosmetic') {
    return { allowed: true, destination: 'entitlement', reason: 'verified-non-cash-entitlement', requiresLedger: false };
  }

  if (!ctx.realMoneyRewardsEnabled) {
    return { allowed: false, destination: 'blocked', reason: 'real-money-game-rewards-disabled', requiresLedger: false };
  }
  if (!ctx.ageEligible || !ctx.jurisdictionEligible || !ctx.sanctionsClear) {
    return { allowed: false, destination: 'blocked', reason: 'real-value-eligibility-failed', requiresLedger: false };
  }
  if (!intent.currency) {
    return { allowed: false, destination: 'blocked', reason: 'currency-required-for-payable-reward', requiresLedger: false };
  }

  return {
    allowed: true,
    destination: 'money-engine',
    reason: 'eligible-real-value-reward-must-settle-through-money-engine',
    requiresLedger: true,
  };
}

export const GET_PAID_TO_PLAY_INVARIANTS = Object.freeze({
  browserCannotCreditCash: true,
  xpSeparateFromMoney: true,
  cosmeticsSeparateFromMoney: true,
  realValueRequiresServerEvidence: true,
  antiCheatRequired: true,
  duplicateProtectionRequired: true,
  jurisdictionGateRequired: true,
  moneyEngineRequired: true,
  doubleEntryLedgerRequired: true,
  internalBlockchainEvidenceRequired: true,
  panicModeBlocksNewPayableRewards: true,
});
