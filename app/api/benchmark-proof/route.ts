import { NextResponse } from "next/server";

import {
  compareBenchmarks,
  summarizeBenchmark,
  type BenchmarkSample,
} from "@/lib/benchmark-proof/engine";
import { insertRow, isSupabaseConfigured } from "@/lib/supabase/server-rest";

interface ProofRequest {
  runName?: string;
  baselineSamples: BenchmarkSample[];
  optimizedSamples: BenchmarkSample[];
  baselineElapsedSeconds?: number;
  optimizedElapsedSeconds?: number;
}

function validSamples(value: unknown): value is BenchmarkSample[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (sample) =>
        typeof sample === "object" &&
        sample !== null &&
        typeof (sample as BenchmarkSample).latencyMs === "number" &&
        typeof (sample as BenchmarkSample).success === "boolean" &&
        typeof (sample as BenchmarkSample).safetyGatePreserved === "boolean",
    )
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProofRequest;

    if (!validSamples(body.baselineSamples) || !validSamples(body.optimizedSamples)) {
      return NextResponse.json(
        {
          ok: false,
          error: "BENCHMARK_SAMPLES_REQUIRED",
          message: "Provide non-empty baselineSamples and optimizedSamples with measured latency, success, and safety-gate fields.",
        },
        { status: 400 },
      );
    }

    const proofId = crypto.randomUUID();
    const baseline = summarizeBenchmark(
      `${proofId}:baseline`,
      "baseline",
      body.baselineSamples,
      body.baselineElapsedSeconds,
    );
    const optimized = summarizeBenchmark(
      `${proofId}:optimized`,
      "optimized",
      body.optimizedSamples,
      body.optimizedElapsedSeconds,
    );
    const proof = compareBenchmarks(baseline, optimized);

    let persisted = false;
    if (isSupabaseConfigured()) {
      await insertRow("benchmark_proof_runs", {
        id: proofId,
        run_name: body.runName ?? "Stubbs AI Benchmark",
        baseline_summary: baseline,
        optimized_summary: optimized,
        delta_summary: proof.delta,
        baseline_samples: body.baselineSamples,
        optimized_samples: body.optimizedSamples,
      });
      persisted = true;
    }

    return NextResponse.json({
      ok: true,
      proofId,
      persisted,
      proof,
      note: "Results are only evidence for the supplied measured samples; this endpoint does not invent benchmark numbers.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "BENCHMARK_PROOF_FAILED",
        message: error instanceof Error ? error.message : "Unable to calculate benchmark proof.",
      },
      { status: 500 },
    );
  }
}
