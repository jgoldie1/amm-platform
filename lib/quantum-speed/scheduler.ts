import { QuantumLagBuster } from "./lag-buster";
import type { StubbsAIRequest } from "@/lib/stubbs-ai/types";

export interface QuantumSchedule {
  concurrency: number;
  memoryLimit: number;
  lagMode: "normal" | "degraded" | "protected";
  actions: string[];
}

export function buildQuantumSchedule(request: StubbsAIRequest): QuantumSchedule {
  const lagBuster = new QuantumLagBuster();
  const decisions = lagBuster.inspect(request.lagSamples ?? []);
  const protectedPath = lagBuster.shouldProtectCriticalPath(decisions);
  const severe = decisions.some((decision) => decision.mode === "reroute" || decision.mode === "shed");

  if (severe) {
    return {
      concurrency: 2,
      memoryLimit: 6,
      lagMode: "protected",
      actions: decisions.flatMap((decision) => decision.actions),
    };
  }

  if (protectedPath) {
    return {
      concurrency: 4,
      memoryLimit: 8,
      lagMode: "degraded",
      actions: decisions.flatMap((decision) => decision.actions),
    };
  }

  return {
    concurrency: 8,
    memoryLimit: 12,
    lagMode: "normal",
    actions: ["parallelize independent retrieval and tool work", "preserve deterministic safety gates"],
  };
}
