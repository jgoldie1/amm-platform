import type { GlobalMarketProfile } from "./global";
import type { OmniExchangeOrderRequest } from "@/lib/omni-exchange/policy";

export interface LicensedExecutionRequest {
  userId: string;
  marketId: string;
  symbol: string;
  side: "buy" | "sell";
  quantity: number;
  orderType: "market" | "limit";
  limitPrice?: number;
  clientOrderId: string;
}

export interface LicensedExecutionReceipt {
  providerId: string;
  venueId?: string;
  providerOrderId: string;
  status: "accepted" | "partially_filled" | "filled" | "rejected" | "cancelled";
  executedQuantity?: number;
  averagePrice?: number;
  currency?: string;
  executedAt?: string;
}

export interface LicensedExecutionAdapter {
  readonly providerId: string;
  submit(request: LicensedExecutionRequest): Promise<LicensedExecutionReceipt>;
}

export function assertLicensedMarketBridge(
  market: GlobalMarketProfile,
  policy: OmniExchangeOrderRequest,
): void {
  if (!market.realExecutionEnabled) throw new Error("real execution is disabled for this market");
  if (!market.executionProviderId) throw new Error("execution provider is not configured");
  if (!market.custodyProviderId) throw new Error("custody provider is not configured");
  if (!market.complianceApprovalId) throw new Error("compliance approval is not configured");
  if (!policy.complianceApprovalId || !policy.licensedVenueId) {
    throw new Error("Omni Exchange policy has not approved regulated execution");
  }
}

/**
 * TRYAMM/Middleverse does not self-clear or fabricate regulated executions.
 * The configured licensed adapter must return the authoritative execution
 * receipt, which is then recorded by accounting/audit layers.
 */
export async function routeLicensedExecution(
  market: GlobalMarketProfile,
  policy: OmniExchangeOrderRequest,
  adapter: LicensedExecutionAdapter | null,
  request: LicensedExecutionRequest,
): Promise<LicensedExecutionReceipt> {
  assertLicensedMarketBridge(market, policy);
  if (!adapter) throw new Error("licensed execution adapter is unavailable");
  if (adapter.providerId !== market.executionProviderId) {
    throw new Error("execution adapter does not match approved market configuration");
  }
  const receipt = await adapter.submit(request);
  if (!receipt.providerOrderId || receipt.providerId !== adapter.providerId) {
    throw new Error("licensed execution provider returned an invalid receipt");
  }
  return receipt;
}
