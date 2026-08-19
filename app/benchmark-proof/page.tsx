"use client";

import { useMemo, useState } from "react";

type Proof = {
  baseline: Record<string, number | string | undefined>;
  optimized: Record<string, number | string | undefined>;
  delta: Record<string, number>;
};

const metricLabels: Record<string, string> = {
  p95LatencyMs: "P95 latency (ms)",
  avgMemoryRetrievalMs: "Memory retrieval (ms)",
  avgTokensPerRequest: "Tokens / request",
  totalEstimatedCostUsd: "Estimated cost ($)",
  successRate: "Success rate",
  cacheHitRate: "Cache hit rate",
  safetyGatePreservationRate: "Safety gates preserved",
};

export default function BenchmarkProofPage() {
  const [proof, setProof] = useState<Proof | null>(null);
  const [message, setMessage] = useState(
    "No measured benchmark has been loaded yet. Run the Benchmark & Proof API with baseline and optimized samples.",
  );

  const rows = useMemo(() => {
    if (!proof) return [];
    return Object.keys(metricLabels).map((key) => ({
      key,
      label: metricLabels[key],
      before: Number(proof.baseline[key] ?? 0),
      after: Number(proof.optimized[key] ?? 0),
    }));
  }, [proof]);

  async function loadLatestExample() {
    setProof(null);
    setMessage(
      "The dashboard does not fabricate results. POST measured samples to /api/benchmark-proof, then connect the returned proof object here or persist/read it from Supabase.",
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "radial-gradient(circle at top, #10314a 0%, #04050e 45%, #02030a 100%)",
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ letterSpacing: 4, color: "#4FE3FF" }}>STUBBS AI</p>
        <h1 style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", margin: "8px 0" }}>
          Benchmark & Proof Engine
        </h1>
        <p style={{ maxWidth: 760, opacity: 0.82 }}>
          Evidence dashboard for Googolplex Memory, Quantum Speed Engine, Quantum Lag Buster,
          Hierarchy AGI, Five-Senses perception, model routing, and Guardian-preserved execution.
        </p>

        <div
          style={{
            marginTop: 24,
            border: "1px solid rgba(79,227,255,.45)",
            boxShadow: "0 0 35px rgba(79,227,255,.15)",
            borderRadius: 22,
            padding: 24,
            background: "rgba(5,12,24,.72)",
          }}
        >
          <strong style={{ color: "#E8B944" }}>Measurement status</strong>
          <p>{message}</p>
          <button
            onClick={loadLatestExample}
            style={{
              padding: "12px 18px",
              borderRadius: 999,
              border: "1px solid #4FE3FF",
              background: "transparent",
              color: "white",
              cursor: "pointer",
            }}
          >
            Check benchmark instructions
          </button>
        </div>

        <div style={{ display: "grid", gap: 18, marginTop: 28 }}>
          {rows.length === 0 ? (
            <div
              style={{
                minHeight: 280,
                display: "grid",
                placeItems: "center",
                borderRadius: 22,
                border: "1px dashed rgba(232,185,68,.5)",
                color: "rgba(255,255,255,.7)",
              }}
            >
              BEFORE / AFTER HOLOGRAPHIC CHART — awaiting measured run
            </div>
          ) : (
            rows.map((row) => {
              const max = Math.max(row.before, row.after, 1);
              return (
                <div key={row.key} style={{ padding: 18, borderRadius: 18, background: "rgba(255,255,255,.04)" }}>
                  <strong>{row.label}</strong>
                  <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                    <div style={{ width: `${(row.before / max) * 100}%`, minWidth: 8, padding: 8, background: "rgba(255,255,255,.18)", borderRadius: 999 }}>
                      Before: {row.before}
                    </div>
                    <div style={{ width: `${(row.after / max) * 100}%`, minWidth: 8, padding: 8, background: "rgba(79,227,255,.25)", border: "1px solid rgba(79,227,255,.5)", borderRadius: 999 }}>
                      After: {row.after}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
