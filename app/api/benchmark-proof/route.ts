import { NextResponse } from "next/server";

import {
  compareBenchmarks,
  summarizeBenchmark,
  type BenchmarkSample,
} from "@/lib/benchmark-proof/engine";
import {
  insertRow,
  isSupabaseConfigured,
  selectRows,
} from "@/lib/supabase/server-rest";

interface ProofRequest {
  runName?: string;
  baselineSamples: BenchmarkSample[];
  optimizedSamples: BenchmarkSample[];
  baselineElapsedSeconds?: number;
  optimizedElapsedSeconds?: number;
}

interface StoredProofRow {
  id: string;
  run_name: string;
  baseline_summary: Record<string, unknown>;
  optimized_summary: Record<string, unknown>;
  delta_summary: Record<string, unknown>;
  created_at: string;
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

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "BENCHMARK_STORAGE_NOT_CONFIGURED",
        message: "Supabase must be configured before the dashboard can load persisted proof.",
      },
      { status: 503 },
    );
  }

  try {
    const rows = await selectRows<StoredProofRow>(
      "benchmark_proof_runs",
      "select=id,run_name,baseline_summary,optimized_summary,delta_summary,created_at&order=created_at.desc&limit=1",
    );

    if (!rows[0]) {
      return NextResponse.json(
        {
          ok: true,
          proof: null,
          message: "No measured benchmark proof has been persisted yet.",
        },
        { status: 200 },
      );
    }

    return NextResponse.json({
      ok: true,
      proofId: rows[0].id,
      runName: rows[0].run_name,
      createdAt: rows[0].created_at,
      proof: {
        baseline: rows[0].baseline_summary,
        optimized: rows[0].optimized_summary,
        delta: rows[0].delta_summary,
      },
      note: "Persisted measured proof only.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "BENCHMARK_PROOF_READ_FAILED",
        message: error instanceof Error ? error.message : "Unable to load benchmark proof.",
      },
      { status: 500 },
    );
  }
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
