export type LagDomain =
  | "llm"
  | "memory"
  | "api"
  | "database"
  | "realtime"
  | "render"
  | "tool"
  | "queue";

export interface LagSample {
  domain: LagDomain;
  latencyMs: number;
  queueDepth?: number;
  errorRate?: number;
  cacheHit?: boolean;
}

export interface LagDecision {
  mode: "normal" | "degraded" | "shed" | "reroute";
  actions: string[];
  reason: string;
}

const thresholds: Record<LagDomain, number> = {
  llm: 2500,
  memory: 600,
  api: 800,
  database: 700,
  realtime: 250,
  render: 120,
  tool: 1500,
  queue: 1000,
};

export function evaluateLag(sample: LagSample): LagDecision {
  const limit = thresholds[sample.domain];
  const severe = sample.latencyMs >= limit * 2;
  const overloaded = (sample.queueDepth ?? 0) > 100;
  const unhealthy = (sample.errorRate ?? 0) >= 0.1;

  if (unhealthy || severe) {
    return {
      mode: "reroute",
      actions: [
        "route to healthy replica or alternate model/provider",
        "serve safe cached state where freshness rules allow",
        "reduce nonessential context and payload size",
        "preserve regulated, payment, identity, and safety checks",
      ],
      reason: `${sample.domain} latency/error level is severe`,
    };
  }

  if (overloaded || sample.latencyMs >= limit) {
    return {
      mode: "degraded",
      actions: [
        "prioritize interactive and safety-critical work",
        "defer background enrichment",
        "compress memory retrieval to highest-relevance items",
        "batch compatible requests",
      ],
      reason: `${sample.domain} is above its latency budget`,
    };
  }

  return {
    mode: "normal",
    actions: ["continue normal scheduling"],
    reason: `${sample.domain} is within its latency budget`,
  };
}

export class QuantumLagBuster {
  inspect(samples: LagSample[]): LagDecision[] {
    return samples.map(evaluateLag);
  }

  shouldProtectCriticalPath(decisions: LagDecision[]): boolean {
    return decisions.some((d) => d.mode === "degraded" || d.mode === "reroute" || d.mode === "shed");
  }
}
