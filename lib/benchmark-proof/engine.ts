export interface AccessibilityBenchmarkEvidence {
  interactionMode?:
    | "default"
    | "keyboard_only"
    | "screen_reader"
    | "voice_control"
    | "switch_control"
    | "one_hand"
    | "reduced_motion";
  locale?: string;
  taskCompleted?: boolean;
  accessibleErrorRecovered?: boolean;
  captionsAvailable?: boolean;
  translationSucceeded?: boolean;
  languageSwitchMs?: number;
}

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
  accessibility?: AccessibilityBenchmarkEvidence;
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
  accessibleTaskCompletionRate?: number;
  accessibleErrorRecoveryRate?: number;
  captionCoverageRate?: number;
  translationSuccessRate?: number;
  avgLanguageSwitchMs?: number;
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
    accessibleTaskCompletionPoints?: number;
    accessibleErrorRecoveryPoints?: number;
    captionCoveragePoints?: number;
    translationSuccessPoints?: number;
    languageSwitchLatencyPct?: number;
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

function optionalBooleanRate(
  samples: BenchmarkSample[],
  selector: (sample: BenchmarkSample) => boolean | undefined,
): number | undefined {
  const values = samples.map(selector).filter((value): value is boolean => typeof value === "boolean");
  if (values.length === 0) return undefined;
  return rate(values.filter(Boolean).length, values.length);
}

function optionalAverage(values: Array<number | undefined>): number | undefined {
  const measured = values.filter((value): value is number => typeof value === "number");
  return measured.length ? average(measured) : undefined;
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
    accessibleTaskCompletionRate: optionalBooleanRate(
      samples,
      (sample) => sample.accessibility?.taskCompleted,
    ),
    accessibleErrorRecoveryRate: optionalBooleanRate(
      samples,
      (sample) => sample.accessibility?.accessibleErrorRecovered,
    ),
    captionCoverageRate: optionalBooleanRate(
      samples,
      (sample) => sample.accessibility?.captionsAvailable,
    ),
    translationSuccessRate: optionalBooleanRate(
      samples,
      (sample) => sample.accessibility?.translationSucceeded,
    ),
    avgLanguageSwitchMs: optionalAverage(
      samples.map((sample) => sample.accessibility?.languageSwitchMs),
    ),
    requestsPerSecond:
      elapsedSeconds && elapsedSeconds > 0 ? samples.length / elapsedSeconds : undefined,
  };
}

function percentChange(before: number, after: number): number {
  if (before === 0) return 0;
  return ((after - before) / before) * 100;
}

function optionalPointChange(before?: number, after?: number): number | undefined {
  if (typeof before !== "number" || typeof after !== "number") return undefined;
  return (after - before) * 100;
}

function optionalPercentChange(before?: number, after?: number): number | undefined {
  if (typeof before !== "number" || typeof after !== "number") return undefined;
  return percentChange(before, after);
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
      accessibleTaskCompletionPoints: optionalPointChange(
        baseline.accessibleTaskCompletionRate,
        optimized.accessibleTaskCompletionRate,
      ),
      accessibleErrorRecoveryPoints: optionalPointChange(
        baseline.accessibleErrorRecoveryRate,
        optimized.accessibleErrorRecoveryRate,
      ),
      captionCoveragePoints: optionalPointChange(
        baseline.captionCoverageRate,
        optimized.captionCoverageRate,
      ),
      translationSuccessPoints: optionalPointChange(
        baseline.translationSuccessRate,
        optimized.translationSuccessRate,
      ),
      languageSwitchLatencyPct: optionalPercentChange(
        baseline.avgLanguageSwitchMs,
        optimized.avgLanguageSwitchMs,
      ),
    },
  };
}
