import type { LagSample } from "@/lib/quantum-speed/lag-buster";

export type TryammDomain =
  | "core"
  | "compliance"
  | "money"
  | "call_center"
  | "marketplace"
  | "property"
  | "logistics"
  | "worlds"
  | "spaceos"
  | "starverse"
  | "music"
  | "security"
  | "accessibility";

export type RiskClass = "low" | "medium" | "high" | "regulated";

export interface StubbsAIRequest {
  requestId: string;
  domain: TryammDomain;
  action: string;
  actorId?: string;
  sessionId?: string;
  riskClass?: RiskClass;
  memoryQuery?: string;
  payload?: Record<string, unknown>;
  lagSamples?: LagSample[];
}

export interface MemoryContextItem {
  id: string;
  namespace: string;
  kind: string;
  summary: string;
  importance: number;
  source?: string;
  createdAt?: string;
}

export interface GuardianDecision {
  allowed: boolean;
  mode: "allow" | "review" | "block";
  reasons: string[];
}

export interface StubbsAIResponse {
  requestId: string;
  domain: TryammDomain;
  route: string;
  memory: MemoryContextItem[];
  guardian: GuardianDecision;
  lagMode: "normal" | "degraded" | "protected";
  nextActions: string[];
}
