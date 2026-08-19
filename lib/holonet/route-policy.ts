export interface HoloRoutePolicyInput {
  prefix: string;
  asn?: number;
  prefixOwnershipVerified: boolean;
  asnOwnershipVerified: boolean;
  upstreamAgreementVerified: boolean;
  rpkiValidated: boolean;
  operatorApproved: boolean;
}

export interface HoloRoutePolicyDecision {
  allowed: boolean;
  reasons: string[];
}

export function authorizeExternalRoute(input: HoloRoutePolicyInput): HoloRoutePolicyDecision {
  const reasons: string[] = [];
  if (!input.prefixOwnershipVerified) reasons.push("IP prefix ownership/authorization is not verified");
  if (!input.asn || !input.asnOwnershipVerified) reasons.push("ASN ownership/authorization is not verified");
  if (!input.upstreamAgreementVerified) reasons.push("upstream/peering agreement is not verified");
  if (!input.rpkiValidated) reasons.push("RPKI/route-origin validation has not passed");
  if (!input.operatorApproved) reasons.push("network operator approval is required");
  return { allowed: reasons.length === 0, reasons };
}
