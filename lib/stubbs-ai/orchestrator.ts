import { retrieveGoogolplexMemory } from "@/lib/googolplex-memory";
import { buildQuantumSchedule } from "@/lib/quantum-speed/scheduler";
import { evaluateGuardian } from "./guardian";
import { hierarchyPath, registerSpecialist } from "./hierarchy";
import { routeAdvancedLLM } from "./model-router";
import { buildSelfModel } from "./self-model";
import { fuseFiveSenseObservations } from "./senses";
import type { StubbsAIRequest, StubbsAIResponse } from "./types";

const domainRoutes: Record<StubbsAIRequest["domain"], string> = {
  core: "stubbs-ai-core",
  compliance: "complianceos",
  money: "money-engine",
  call_center: "middleverse-call-center",
  marketplace: "tryamm-marketplace",
  property: "propertyverse",
  logistics: "dispatch-logistics",
  mobility: "mobilityos",
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
  const modelRoute = routeAdvancedLLM(request);
  const memoryLimit = Math.min(schedule.memoryLimit, modelRoute.maxContextItems);
  const memory = await retrieveGoogolplexMemory(request, memoryLimit);
  const specialist = registerSpecialist(domainRoutes[request.domain], request.domain);
  const path = hierarchyPath(specialist);
  const perception = fuseFiveSenseObservations(request.senseObservations ?? []);
  const selfModel = buildSelfModel({
    runtimeVersion: "0.3.0",
    activeDomains: Object.keys(domainRoutes),
    capabilities: [
      "advanced model routing",
      "Googolplex Memory retrieval",
      "Quantum Speed scheduling",
      "Quantum Lag Buster protection",
      "Hierarchy AGI routing",
      "multimodal five-senses perception contract",
      "Guardian risk evaluation",
      "MobilityOS mission planning and fleet orchestration",
    ],
    limitations: [
      "Physical senses require actual connected sensors or media sources.",
      "Deterministic services remain authoritative for regulated, financial, and physical vehicle side effects.",
      "Stubbs AI may plan mobility missions but may not directly emit steering, throttle, braking, rotor, or actuator commands.",
    ],
    currentGoals: [
      `route ${request.domain} request safely`,
      "preserve verified context and auditability",
      "degrade optional work before safety-critical work",
    ],
    memoryAvailable: true,
    guardianAvailable: true,
    complianceAvailable: true,
    degraded: schedule.lagMode !== "normal",
  });

  const nextActions = [
    ...schedule.actions,
    `hierarchy path: ${path.join(" -> ")}`,
    `advanced LLM lane: ${modelRoute.lane} — ${modelRoute.reason}`,
    perception.warnings.length > 0
      ? `perception warnings: ${perception.warnings.join("; ")}`
      : `perception channels available: ${perception.availableChannels.join(", ") || "none"}`,
    guardian.mode === "review" || modelRoute.lane === "deterministic_only"
      ? `execute ${domainRoutes[request.domain]} only through its deterministic verifier`
      : `route to ${domainRoutes[request.domain]}`,
    "record verified state changes back into Googolplex Memory after successful execution",
  ];

  return {
    requestId: request.requestId,
    domain: request.domain,
    route: domainRoutes[request.domain],
    hierarchyPath: path,
    memory,
    perception,
    selfModel,
    guardian,
    lagMode: schedule.lagMode,
    nextActions,
  };
}
