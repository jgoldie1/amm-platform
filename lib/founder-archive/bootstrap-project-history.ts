import type { FounderArchiveRecord } from "./types";

/**
 * Bootstrap project-history map reconstructed from the current TRYAMM development
 * context. These are summaries for navigation only, not substitutes for original
 * chat exports or source artifacts. Each record must be reconciled with a source
 * before it is treated as complete historical evidence.
 */
export function buildBootstrapProjectHistory(ownerId: string): FounderArchiveRecord[] {
  const capturedAt = new Date().toISOString();
  const make = (
    id: string,
    title: string,
    summary: string,
    tags: string[],
    legacyDesignIds: string[] = [],
  ): FounderArchiveRecord => ({
    id,
    ownerId,
    source: "manual",
    kind: "design",
    title,
    summary,
    capturedAt,
    private: true,
    searchable: true,
    tags: ["bootstrap", "reconstructed-summary", ...tags],
    legacyDesignIds,
  });

  return [
    make(
      "bootstrap-stubbs-ai",
      "Stubbs AI / HoloGPT intelligence architecture",
      "Shared executive intelligence architecture using Hierarchy AGI, Advanced LLM routing, Googolplex Memory, Quantum Speed Engine, Quantum Lag Buster, Guardian controls, five-senses perception adapters, self-model/runtime introspection, accessibility and multilingual acceptance.",
      ["stubbs-ai", "hologpt", "agi", "memory", "quantum-speed", "lag-buster"],
    ),
    make(
      "bootstrap-tryamm-platform",
      "TRYAMM platform ecosystem",
      "Unified platform spanning live/social video, marketplace, creator tools, payments/wallet concepts, call center, advertising, accessibility, multilingual operation, gaming/worlds, music, property, logistics, education and specialized verticals.",
      ["tryamm", "platform", "marketplace", "social", "creator"],
    ),
    make(
      "bootstrap-complianceos",
      "ComplianceOS and regulated-services gateway",
      "Provider credential vault, jurisdiction/service checks, fee rules, regulated transaction gating, provider onboarding, audit records and fail-closed payment authorization boundaries.",
      ["compliance", "regulated-services", "credentials", "payments"],
    ),
    make(
      "bootstrap-middleverse-call-center",
      "Middleverse AI Call Center",
      "AI call-center and telephony architecture with routing, accessibility, multilingual interaction, compliance escalation, provider handoff, Do-Not-Call awareness and production telephony integration gates.",
      ["call-center", "telephony", "middleverse", "accessibility"],
    ),
    make(
      "bootstrap-spaceos",
      "SpaceOS",
      "Persistent digital-twin and manufacturing workflow with room/object modeling, no-go zones, vision analysis, authenticated private storage, safety-gated BUILD jobs and CAD/STL/STEP export architecture.",
      ["spaceos", "digital-twin", "manufacturing", "cad"],
      ["legacy-spacecraft-tryamm-spaceos-001"],
    ),
    make(
      "bootstrap-spacecraft",
      "TRYAMM SpaceOS spacecraft",
      "Recovered spacecraft program covering cockpit controls, animated launches, controllable flight, planetary travel, Mars missions, atmospheric entry/landing, SPICE navigation, multiplayer crews, mission persistence and Stubbs AI guidance. Physical specifications remain unresolved until source artifacts are recovered.",
      ["spacecraft", "spaceos", "spice", "mars"],
      ["legacy-spacecraft-tryamm-spaceos-001"],
    ),
    make(
      "bootstrap-mobilityos",
      "MobilityOS",
      "Unified software architecture for electric cars, drones, eVTOL/flying vehicles, robots, marine vehicles and rovers, including fleet registry, mission handoff, energy management, accessibility-aware dispatch and deterministic physical-control boundaries.",
      ["mobility", "ev", "drone", "evtol", "robotics", "marine"],
    ),
    make(
      "bootstrap-silver-hawk",
      "Silver Hawk flying-car concept",
      "Legacy flying-car concept restored into the invention registry as a historical design record pending recovery of authoritative geometry, propulsion, materials, energy, control and performance specifications.",
      ["silver-hawk", "flying-car", "mobility"],
    ),
    make(
      "bootstrap-aircraft-marine",
      "TRYAMM aircraft and marine concepts",
      "Legacy aircraft and marine/boat concepts restored as invention records with unresolved physical specifications until original source conversations, diagrams, CAD or engineering records are recovered.",
      ["aircraft", "boat", "marine", "mobility"],
    ),
    make(
      "bootstrap-12d-manufacturing",
      "12D manufacturing architecture",
      "Advanced manufacturing concept integrated with digital twins, CAD/STEP/STL/BOM artifacts and a fabrication gate requiring structural, thermal, electrical, materials, process, engineering and regulatory evidence before physical BUILD authorization.",
      ["12d", "manufacturing", "cad", "fabrication"],
    ),
    make(
      "bootstrap-benchmark-proof",
      "Stubbs AI Benchmark & Proof Engine",
      "Evidence system for measured before/after comparisons including P50/P95/P99 latency, memory retrieval, tokens/context, cost, throughput, safety-gate preservation, accessibility completion and multilingual metrics when actually instrumented.",
      ["benchmark", "proof", "performance", "accessibility"],
    ),
    make(
      "bootstrap-legacy-vault",
      "Legacy Design Recovery Vault",
      "Evidence-backed registry for recovered inventions, source artifacts, revisions, unresolved specifications and the lifecycle Recovered -> Source Verified -> Specification Reconstructed -> Digital Twin -> Simulation Tested -> Prototype -> Independently Verified -> Production Candidate.",
      ["legacy-vault", "provenance", "inventions"],
    ),
  ];
}
