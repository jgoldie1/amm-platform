export type OmniMarketInstrument =
  | "creator_asset"
  | "digital_collectible"
  | "marketplace_inventory"
  | "game_asset"
  | "hologpt_credit"
  | "promotional_point"
  | "simulated_equity"
  | "public_equity"
  | "security"
  | "crypto_asset"
  | "tokenized_security";

export type MarketMode = "sandbox" | "internal" | "regulated-live";

export interface OmniExchangeOrderRequest {
  userId: string;
  instrumentId: string;
  instrumentType: OmniMarketInstrument;
  quantity: number;
  mode: MarketMode;
  jurisdiction?: string;
  complianceApprovalId?: string;
  licensedVenueId?: string;
}

export interface OmniExchangeDecision {
  allowed: boolean;
  execution: "simulate" | "internal-ledger" | "licensed-venue" | "blocked";
  reason: string;
  requiresHumanApproval: boolean;
}

const REGULATED: ReadonlySet<OmniMarketInstrument> = new Set([
  "public_equity",
  "security",
  "crypto_asset",
  "tokenized_security",
]);

/**
 * Omni Exchange / Middleverse Market launch guard.
 * Crypto and securities trading stay OFF until explicit legal/compliance
 * approval and an authorized/licensed execution venue are configured.
 */
export function evaluateOmniExchangeOrder(
  request: OmniExchangeOrderRequest,
): OmniExchangeDecision {
  if (!Number.isFinite(request.quantity) || request.quantity <= 0) {
    return {
      allowed: false,
      execution: "blocked",
      reason: "quantity must be positive",
      requiresHumanApproval: false,
    };
  }

  if (request.mode === "sandbox") {
    return {
      allowed: true,
      execution: "simulate",
      reason: "sandbox uses simulated balances and creates no real investment transaction",
      requiresHumanApproval: false,
    };
  }

  if (REGULATED.has(request.instrumentType)) {
    if (!request.complianceApprovalId || !request.licensedVenueId) {
      return {
        allowed: false,
        execution: "blocked",
        reason: "regulated asset execution is disabled until explicit compliance approval and a licensed venue are configured",
        requiresHumanApproval: true,
      };
    }

    return {
      allowed: true,
      execution: "licensed-venue",
      reason: "route approved regulated execution to the configured licensed venue; TRYAMM does not self-clear the trade",
      requiresHumanApproval: true,
    };
  }

  return {
    allowed: true,
    execution: "internal-ledger",
    reason: "eligible non-investment ecosystem item may use the internal Money Engine subject to product-specific rules",
    requiresHumanApproval: false,
  };
}

export const OMNI_EXCHANGE_RELEASE_GATES = Object.freeze({
  cryptoTrading: false,
  tokenizedSecurities: false,
  publicEquityExecution: false,
  securitiesExecution: false,
  simulatedMiddleverseMarket: true,
  nonInvestmentMarketplaceAssets: true,
});
