export type RegulatedVertical =
  | "legal"
  | "medical"
  | "insurance"
  | "real_estate"
  | "tax"
  | "medicaid"
  | "staffing"
  | "security"
  | "vehicle_sharing"
  | "dispatch"
  | "financial_services"
  | "home_services";

export type CredentialStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "expired"
  | "suspended"
  | "rejected";

export type FeeRuleCode =
  | "PLATFORM_SUBSCRIPTION_ALLOWED"
  | "SAAS_FEE_ALLOWED"
  | "ADVERTISING_FEE_ALLOWED"
  | "BOOKING_FEE_ALLOWED"
  | "REFERRAL_FEE_REVIEW_REQUIRED"
  | "PROFESSIONAL_FEE_SHARING_PROHIBITED"
  | "PROVIDER_OF_RECORD_REQUIRED";

export interface ProviderCredential {
  providerId: string;
  vertical: RegulatedVertical;
  jurisdiction: string;
  credentialType: string;
  licenseNumber?: string;
  issuingAuthority?: string;
  status: CredentialStatus;
  expiresAt?: string;
  verifiedAt?: string;
}

export interface ComplianceRequest {
  vertical: RegulatedVertical;
  jurisdiction: string;
  providerId: string;
  credential: ProviderCredential | null;
  requestedFeeType:
    | "platform"
    | "saas"
    | "advertising"
    | "booking"
    | "referral"
    | "professional";
  requestedAmountCents: number;
}

export interface ComplianceDecision {
  allowed: boolean;
  status: "approved" | "blocked" | "manual_review";
  code: string;
  reasons: string[];
  requiredActions: string[];
  feeRules: FeeRuleCode[];
}
