import type { RiskClass, StubbsAIRequest } from "./types";

export type ModelLane = "fast" | "standard" | "deep" | "deterministic_only";

export interface ModelRoute {
  lane: ModelLane;
  reason: string;
  maxContextItems: number;
  allowTools: boolean;
}

const deterministicActions = [
  "authorize_payment",
  "release_payout",
  "verify_credential",
  "execute_transfer",
  "submit_claim",
];

function laneForRisk(risk: RiskClass | undefined): ModelLane {
  if (risk === "regulated") return "deep";
  if (risk === "high") return "deep";
  if (risk === "medium") return "standard";
  return "fast";
}

export function routeAdvancedLLM(request: StubbsAIRequest): ModelRoute {
  const normalized = request.action.toLowerCase();

  if (deterministicActions.some((action) => normalized.includes(action))) {
    return {
      lane: "deterministic_only",
      reason: "This action changes regulated or financial state and must be executed by a deterministic domain service.",
      maxContextItems: 6,
      allowTools: false,
    };
  }

  const lane = laneForRisk(request.riskClass);
  return {
    lane,
    reason: `Selected ${lane} reasoning lane for ${request.riskClass ?? "low"} risk work.`,
    maxContextItems: lane === "deep" ? 16 : lane === "standard" ? 12 : 8,
    allowTools: true,
  };
}
