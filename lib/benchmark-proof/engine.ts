export interface BenchmarkSample {
  label: string;
  latencyMs: number;
  memoryRetrievalMs?: number;
  tokensIn?: number;
  tokensOut?: number;
  estimatedCostUsd?: number;
  cacheHit?: boolean;
  success: boolean;
  safetyGatePreserved: boolean;
  timestamp: string;
}

export interface BenchmarkSummary {
  runId: string;
  mode: "baseline" | "optimized";
  sampleCount: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  avgMemoryRetrievalMs: number;
  avgTokensPerRequest: number;
  totalEstimatedCostUsd: number;
  successRate: number;
  cacheHitRate: number;
  safetyGatePreservationRate: number;
  requestsPerSecond?: number;
}

export interface BeforeAfterProof {
  baseline: BenchmarkSummary;
  optimized: BenchmarkSummary;
  delta: {
    p95LatencyPct: number;
    memoryRetrievalPct: number;
    tokensPerRequestPct: number;
    estimatedCostPct: number;
    successRatePoints: number;
    cacheHitRatePoints: number;
    safetyGatePreservationPoints: number;
  };
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[Math.max(0, index)];
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function rate(matches: number, total: number): number {
  return total === 0 ? 0 : matches / total;
}

export function summarizeBenchmark(
  runId: string,
  mode: BenchmarkSummary["mode"],
  samples: BenchmarkSample[],
  elapsedSeconds?: number,
): BenchmarkSummary {
  const latencies = samples.map((sample) => sample.latencyMs);
  const memory = samples
    .map((sample) => sample.memoryRetrievalMs)
    .filter((value): value is number => typeof value === "number");
  const tokens = samples.map((sample) => (sample.tokensIn ?? 0) + (sample.tokensOut ?? 0));
  const totalCost = samples.reduce((sum, sample) => sum + (sample.estimatedCostUsd ?? 0), 0);

  return {
    runId,
    mode,
    sampleCount: samples.length,
    p50LatencyMs: percentile(latencies, 50),
    p95LatencyMs: percentile(latencies, 95),
    p99LatencyMs: percentile(latencies, 99),
    avgMemoryRetrievalMs: average(memory),
    avgTokensPerRequest: average(tokens),
    totalEstimatedCostUsd: totalCost,
    successRate: rate(samples.filter((sample) => sample.success).length, samples.length),
    cacheHitRate: rate(samples.filter((sample) => sample.cacheHit).length, samples.length),
    safetyGatePreservationRate: rate(
      samples.filter((sample) => sample.safetyGatePreserved).length,
      samples.length,
    ),
    requestsPerSecond:
      elapsedSeconds && elapsedSeconds > 0 ? samples.length / elapsedSeconds : undefined,
  };
}

function percentChange(before: number, after: number): number {
  if (before === 0) return 0;
  return ((after - before) / before) * 100;
}

export function compareBenchmarks(
  baseline: BenchmarkSummary,
  optimized: BenchmarkSummary,
): BeforeAfterProof {
  return {
    baseline,
    optimized,
    delta: {
      p95LatencyPct: percentChange(baseline.p95LatencyMs, optimized.p95LatencyMs),
      memoryRetrievalPct: percentChange(
        baseline.avgMemoryRetrievalMs,
        optimized.avgMemoryRetrievalMs,
      ),
      tokensPerRequestPct: percentChange(
        baseline.avgTokensPerRequest,
        optimized.avgTokensPerRequest,
      ),
      estimatedCostPct: percentChange(
        baseline.totalEstimatedCostUsd,
        optimized.totalEstimatedCostUsd,
      ),
      successRatePoints: (optimized.successRate - baseline.successRate) * 100,
      cacheHitRatePoints: (optimized.cacheHitRate - baseline.cacheHitRate) * 100,
      safetyGatePreservationPoints:
        (optimized.safetyGatePreservationRate - baseline.safetyGatePreservationRate) * 100,
    },
  };
}
