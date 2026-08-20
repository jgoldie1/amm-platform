export type SecurityDomain =
  | "identity"
  | "holonet"
  | "quantum_radio"
  | "quantum_tower"
  | "payments"
  | "stubbs_ai"
  | "media"
  | "mobility"
  | "games"
  | "founder_archive";

export type SecuritySeverity = "info" | "low" | "medium" | "high" | "critical";

export interface QuantumSecurityProfile {
  domain: SecurityDomain;
  requireHardwareBackedIdentity: boolean;
  requireMutualAuthentication: boolean;
  requireSignedArtifacts: boolean;
  requireEncryptedTransport: boolean;
  requirePqcReadyKeyExchange: boolean;
  requirePqcReadySignatures: boolean;
  requireKeyRotation: boolean;
  requireTamperEvidence: boolean;
  requireAuditTrail: boolean;
  requireAnomalyDetection: boolean;
}

export interface QuantumSecuritySignal {
  id: string;
  domain: SecurityDomain;
  subjectId?: string;
  severity: SecuritySeverity;
  type:
    | "auth_failure"
    | "signature_failure"
    | "integrity_failure"
    | "key_age"
    | "unexpected_route"
    | "tamper"
    | "malware_indicator"
    | "rate_anomaly"
    | "privilege_change"
    | "firmware_mismatch"
    | "qrng_health"
    | "other";
  observedAt: string;
  details: Record<string, unknown>;
}

export interface QuantumSecurityDecision {
  allowed: boolean;
  reasons: string[];
  requiredActions: string[];
}

export const defaultQuantumSecurityProfile: QuantumSecurityProfile = {
  domain: "holonet",
  requireHardwareBackedIdentity: true,
  requireMutualAuthentication: true,
  requireSignedArtifacts: true,
  requireEncryptedTransport: true,
  requirePqcReadyKeyExchange: true,
  requirePqcReadySignatures: true,
  requireKeyRotation: true,
  requireTamperEvidence: true,
  requireAuditTrail: true,
  requireAnomalyDetection: true,
};

export function evaluateSecuritySignals(signals: QuantumSecuritySignal[]): QuantumSecurityDecision {
  const reasons: string[] = [];
  const requiredActions: string[] = [];

  for (const signal of signals) {
    if (signal.severity === "critical") reasons.push(`critical security signal: ${signal.type}`);
    if (signal.type === "signature_failure" || signal.type === "integrity_failure" || signal.type === "firmware_mismatch") {
      reasons.push(`integrity trust failed: ${signal.type}`);
    }
    if (signal.type === "tamper") reasons.push("physical/logical tamper condition detected");
    if (signal.type === "qrng_health") requiredActions.push("verify entropy source and fail over to approved system CSPRNG if health is uncertain");
    if (signal.type === "key_age") requiredActions.push("rotate affected credentials/keys");
    if (signal.type === "rate_anomaly" || signal.type === "unexpected_route") requiredActions.push("raise telemetry sampling and apply rate/route containment");
  }

  return { allowed: reasons.length === 0, reasons, requiredActions };
}
