import type {
  ComplianceDecision,
  ComplianceRequest,
  FeeRuleCode,
  RegulatedVertical,
} from "./types";

const providerOfRecordRequired = new Set<RegulatedVertical>([
  "legal",
  "medical",
  "insurance",
  "real_estate",
  "tax",
  "medicaid",
  "staffing",
  "security",
  "financial_services",
]);

const professionalFeeSharingRestricted = new Set<RegulatedVertical>([
  "legal",
  "medical",
  "insurance",
  "real_estate",
  "medicaid",
  "financial_services",
]);

function baseRules(vertical: RegulatedVertical): FeeRuleCode[] {
  const rules: FeeRuleCode[] = [
    "PLATFORM_SUBSCRIPTION_ALLOWED",
    "SAAS_FEE_ALLOWED",
    "ADVERTISING_FEE_ALLOWED",
  ];

  if (providerOfRecordRequired.has(vertical)) {
    rules.push("PROVIDER_OF_RECORD_REQUIRED");
  }

  if (professionalFeeSharingRestricted.has(vertical)) {
    rules.push("PROFESSIONAL_FEE_SHARING_PROHIBITED");
  }

  return rules;
}

export function evaluateCompliance(
  request: ComplianceRequest,
): ComplianceDecision {
  const feeRules = baseRules(request.vertical);
  const reasons: string[] = [];
  const requiredActions: string[] = [];

  if (!Number.isInteger(request.requestedAmountCents) || request.requestedAmountCents < 0) {
    return {
      allowed: false,
      status: "blocked",
      code: "INVALID_AMOUNT",
      reasons: ["Requested amount must be a non-negative integer number of cents."],
      requiredActions: ["Correct the transaction amount before retrying."],
      feeRules,
    };
  }

  if (!request.jurisdiction.trim()) {
    return {
      allowed: false,
      status: "blocked",
      code: "JURISDICTION_REQUIRED",
      reasons: ["A jurisdiction is required for a regulated-service decision."],
      requiredActions: ["Collect the service jurisdiction before checkout."],
      feeRules,
    };
  }

  if (providerOfRecordRequired.has(request.vertical)) {
    if (!request.credential) {
      return {
        allowed: false,
        status: "blocked",
        code: "PROVIDER_CREDENTIAL_REQUIRED",
        reasons: ["This service requires a verified provider credential."],
        requiredActions: ["Onboard and verify the provider before accepting the transaction."],
        feeRules,
      };
    }

    if (request.credential.providerId !== request.providerId) {
      return {
        allowed: false,
        status: "blocked",
        code: "PROVIDER_CREDENTIAL_MISMATCH",
        reasons: ["The credential does not belong to the selected provider."],
        requiredActions: ["Select the provider credential associated with this provider."],
        feeRules,
      };
    }

    if (request.credential.vertical !== request.vertical) {
      return {
        allowed: false,
        status: "blocked",
        code: "SERVICE_SCOPE_MISMATCH",
        reasons: ["The provider credential does not authorize this service category."],
        requiredActions: ["Verify a credential that covers the requested service."],
        feeRules,
      };
    }

    if (request.credential.jurisdiction.toLowerCase() !== request.jurisdiction.toLowerCase()) {
      return {
        allowed: false,
        status: "blocked",
        code: "JURISDICTION_MISMATCH",
        reasons: ["The provider credential is not verified for the requested jurisdiction."],
        requiredActions: ["Verify provider authorization in the service jurisdiction."],
        feeRules,
      };
    }

    if (request.credential.status !== "verified") {
      return {
        allowed: false,
        status: "blocked",
        code: `PROVIDER_${request.credential.status.toUpperCase()}`,
        reasons: [`Provider credential status is ${request.credential.status}.`],
        requiredActions: ["Complete provider credential verification before checkout."],
        feeRules,
      };
    }

    if (request.credential.expiresAt) {
      const expiry = Date.parse(request.credential.expiresAt);
      if (!Number.isNaN(expiry) && expiry <= Date.now()) {
        return {
          allowed: false,
          status: "blocked",
          code: "PROVIDER_CREDENTIAL_EXPIRED",
          reasons: ["The provider credential has expired."],
          requiredActions: ["Re-verify the renewed credential before checkout."],
          feeRules,
        };
      }
    }
  }

  if (request.requestedFeeType === "professional") {
    reasons.push("Professional-service revenue must remain attributable to the qualified provider of record.");
    requiredActions.push("Route the professional-service amount to the provider-controlled receivable or payout path.");
    return {
      allowed: false,
      status: "manual_review",
      code: "PROFESSIONAL_FEE_PROVIDER_CONTROLLED",
      reasons,
      requiredActions,
      feeRules,
    };
  }

  if (request.requestedFeeType === "referral") {
    feeRules.push("REFERRAL_FEE_REVIEW_REQUIRED");
    return {
      allowed: false,
      status: "manual_review",
      code: "REFERRAL_FEE_REVIEW_REQUIRED",
      reasons: ["Referral compensation can depend on profession and jurisdiction."],
      requiredActions: ["Apply a jurisdiction-specific approved fee rule before charging the fee."],
      feeRules,
    };
  }

  if (request.requestedFeeType === "booking") {
    feeRules.push("BOOKING_FEE_ALLOWED");
  }

  return {
    allowed: true,
    status: "approved",
    code: "PLATFORM_FEE_APPROVED",
    reasons: ["The request passed the current platform-service compliance gates."],
    requiredActions: ["Record consent, fee disclosure, ledger entries, and audit event before payout."],
    feeRules,
  };
}
