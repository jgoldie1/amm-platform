import type { MobilityClass } from "./types";

export interface MissionLeg {
  id: string;
  class: MobilityClass;
  from: string;
  to: string;
  assetId?: string;
  status: "planned" | "ready" | "in_progress" | "complete" | "blocked";
  accessibleHandoffRequired?: boolean;
}

export interface MissionHandoffPlan {
  missionId: string;
  legs: MissionLeg[];
  currentLegIndex: number;
  handoffTokenRequired: boolean;
}

export function canAdvanceHandoff(plan: MissionHandoffPlan): boolean {
  const current = plan.legs[plan.currentLegIndex];
  const next = plan.legs[plan.currentLegIndex + 1];
  if (!current || !next) return false;
  return current.status === "complete" && next.status === "ready";
}

export function nextHandoff(plan: MissionHandoffPlan): MissionLeg | null {
  return canAdvanceHandoff(plan) ? plan.legs[plan.currentLegIndex + 1] ?? null : null;
}
