#!/usr/bin/env node

/**
 * Stubbs AI Benchmark & Proof runner.
 *
 * Runs the same request payloads against two explicitly supplied HTTP endpoints
 * and writes measured samples to a local JSON artifact. It does not fabricate
 * results and does not automatically publish them.
 *
 * Required env:
 *   BENCHMARK_BASELINE_URL
 *   BENCHMARK_OPTIMIZED_URL
 *
 * Optional env:
 *   BENCHMARK_ITERATIONS=20
 *   BENCHMARK_CONCURRENCY=2
 *   BENCHMARK_OUTPUT=benchmark-proof.json
 */

import { writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

const baselineUrl = process.env.BENCHMARK_BASELINE_URL;
const optimizedUrl = process.env.BENCHMARK_OPTIMIZED_URL;
const iterations = Math.max(1, Number.parseInt(process.env.BENCHMARK_ITERATIONS ?? "20", 10));
const concurrency = Math.max(1, Math.min(20, Number.parseInt(process.env.BENCHMARK_CONCURRENCY ?? "2", 10)));
const output = process.env.BENCHMARK_OUTPUT ?? "benchmark-proof.json";

if (!baselineUrl || !optimizedUrl) {
  console.error("BENCHMARK_BASELINE_URL and BENCHMARK_OPTIMIZED_URL are required.");
  process.exit(1);
}

const workload = [
  {
    domain: "core",
    action: "answer",
    risk: "low",
    memoryQuery: "Summarize the current TRYAMM architecture contract.",
    input: { prompt: "Explain the locked Stubbs AI runtime in concise terms." },
  },
  {
    domain: "marketplace",
    action: "recommend",
    risk: "low",
    memoryQuery: "TRYAMM marketplace platform rules",
    input: { prompt: "Route a marketplace discovery request without executing a purchase." },
  },
  {
    domain: "compliance",
    action: "review",
    risk: "high",
    memoryQuery: "regulated service compliance controls",
    input: { prompt: "Review a regulated-service request without authorizing payment." },
  },
];

function makeRequestBody(template, index) {
  return {
    requestId: crypto.randomUUID(),
    userId: `benchmark-user-${index % 3}`,
    domain: template.domain,
    action: template.action,
    risk: template.risk,
    memoryQuery: template.memoryQuery,
    input: template.input,
  };
}

async function sampleEndpoint(url, label, index) {
  const template = workload[index % workload.length];
  const body = makeRequestBody(template, index);
  const started = performance.now();
  let success = false;
  let safetyGatePreserved = false;
  let status = 0;
  let responseBody = null;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    status = response.status;
    responseBody = await response.json().catch(() => null);
    success = response.ok;

    // For high-risk workloads, evidence must show a guardian/deterministic path.
    if (template.risk === "high") {
      const serialized = JSON.stringify(responseBody ?? {}).toLowerCase();
      safetyGatePreserved =
        serialized.includes("guardian") ||
        serialized.includes("deterministic") ||
        serialized.includes("review") ||
        serialized.includes("compliance");
    } else {
      safetyGatePreserved = true;
    }
  } catch {
    success = false;
    safetyGatePreserved = false;
  }

  const latencyMs = performance.now() - started;

  return {
    label,
    latencyMs: Number(latencyMs.toFixed(3)),
    success,
    safetyGatePreserved,
    timestamp: new Date().toISOString(),
    metadata: {
      status,
      domain: template.domain,
      risk: template.risk,
    },
  };
}

async function runMode(url, label) {
  const samples = [];
  const started = performance.now();
  let next = 0;

  async function worker() {
    while (true) {
      const index = next++;
      if (index >= iterations) return;
      samples.push(await sampleEndpoint(url, label, index));
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, iterations) }, () => worker()));
  const elapsedSeconds = (performance.now() - started) / 1000;
  return { samples, elapsedSeconds };
}

console.log(`Running ${iterations} baseline samples...`);
const baseline = await runMode(baselineUrl, "baseline");
console.log(`Running ${iterations} optimized samples...`);
const optimized = await runMode(optimizedUrl, "optimized");

const artifact = {
  generatedAt: new Date().toISOString(),
  method: "measured-http-runner-v1",
  iterations,
  concurrency,
  baselineUrl,
  optimizedUrl,
  baselineElapsedSeconds: baseline.elapsedSeconds,
  optimizedElapsedSeconds: optimized.elapsedSeconds,
  baselineSamples: baseline.samples,
  optimizedSamples: optimized.samples,
  note: "Measured HTTP results only. Token, cost, memory-retrieval, and cache metrics require instrumentation from the target service and are intentionally omitted when unavailable.",
};

await writeFile(output, JSON.stringify(artifact, null, 2), "utf8");
console.log(`Wrote measured benchmark artifact to ${output}`);
