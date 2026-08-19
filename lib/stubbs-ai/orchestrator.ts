import { retrieveGoogolplexMemory } from "@/lib/googolplex-memory";
import { buildQuantumSchedule } from "@/lib/quantum-speed/scheduler";
import { evaluateGuardian } from "./guardian";
import type { StubbsAIRequest, StubbsAIResponse } from "./types";

const domainRoutes: Record<StubbsAIRequest["domain"], string> = {
  core: "stubbs-ai-core",
  compliance: "complianceos",
  money: "money-engine",
  call_center: "middleverse-call-center",
  marketplace: "tryamm-marketplace",
  property: "propertyverse",
  logistics: "dispatch-logistics",
  worlds: "living-worlds",
  spaceos: "spaceos",
  starverse: "starverse",
  music: "holomusic",
  security: "security-guardian",
  accessibility: "accessibility-engine",
};

export async function orchestrateStubbsAI(
  request: StubbsAIRequest,
): Promise<StubbsAIResponse> {
  const schedule = buildQuantumSchedule(request);
  const guardian = evaluateGuardian(request);
  const memory = await retrieveGoogolplexMemory(request, schedule.memoryLimit);

  const nextActions = [
    ...schedule.actions,
    guardian.mode === "review"
      ? `execute ${domainRoutes[request.domain]} only through its deterministic verifier`
      : `route to ${domainRoutes[request.domain]}`,
    "record verified state changes back into Googolplex Memory after successful execution",
  ];

  return {
    requestId: request.requestId,
    domain: request.domain,
    route: domainRoutes[request.domain],
    memory,
    guardian,
    lagMode: schedule.lagMode,
    nextActions,
  };
}
