import type { GuardianDecision, StubbsAIRequest } from "./types";

const regulatedActions = [
  "payment",
  "payout",
  "diagnose",
  "prescribe",
  "legal_advice",
  "insurance_sale",
  "medicaid_billing",
  "brokerage",
  "credential_verify",
];

export function evaluateGuardian(request: StubbsAIRequest): GuardianDecision {
  const action = request.action.toLowerCase();
  const regulated =
    request.riskClass === "regulated" ||
    regulatedActions.some((needle) => action.includes(needle));

  if (regulated) {
    return {
      allowed: true,
      mode: "review",
      reasons: [
        "Regulated or high-impact action must pass its deterministic domain gate before execution.",
        "LLM output is advisory and cannot override identity, compliance, payment, licensing, audit, or authorization controls.",
      ],
    };
  }

  if (request.riskClass === "high") {
    return {
      allowed: true,
      mode: "review",
      reasons: ["High-risk actions require an explicit downstream verifier before side effects."],
    };
  }

  return {
    allowed: true,
    mode: "allow",
    reasons: ["Request may proceed through the standard Stubbs AI orchestration path."],
  };
}
