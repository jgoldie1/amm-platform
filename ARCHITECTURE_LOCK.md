# TRYAMM Architecture Lock

This file is the development contract for TRYAMM application modules.

## Mandatory intelligence path

All non-static product modules must integrate through the shared Stubbs AI runtime contract:

1. Stubbs AI Gateway
2. Hierarchy AGI routing
3. Advanced model/router layer
4. Googolplex Memory retrieval
5. Five-Senses perception fusion when real/supported inputs exist
6. Stubbs AI self-model / runtime introspection
7. Quantum Speed scheduling
8. Quantum Lag Buster latency protection
9. Guardian risk gate
10. Domain-specific deterministic service
11. Accessibility + multilingual acceptance gate
12. Evidence/audit verification
13. Googolplex Memory state update

Static assets, build tooling, and public health checks are exempt from the runtime path.

## Hierarchy AGI rule

The executive layer may plan and route; critic and guardian layers may challenge and constrain; specialists may reason within domains; deterministic workers/services own real side effects. Hierarchy agents do not gain permission merely by being higher in the hierarchy.

## Self-model rule

Stubbs AI may maintain a machine-readable model of its configured identity, capabilities, limits, goals, health, and active domains. This is introspection for reliable orchestration and is not evidence of consciousness, sentience, biological self-awareness, or subjective experience.

## Five-Senses rule

Vision, hearing, touch, smell, and taste are treated as perception channels only when supported by actual media, device, sensor, or explicitly simulated inputs. Simulated channels must be labeled and may not be represented as physical measurements.

## Accessibility and multilingual rule

Accessibility is a platform-wide acceptance requirement, not an optional feature. Product flows must provide an accessible path appropriate to the interaction, including keyboard/switch/voice access, screen-reader semantics, visible focus, text alternatives, captions/transcription for media where applicable, reduced-motion alternatives, scalable text/targets, non-color-only status/error communication, and one-hand/low-dexterity interaction support where applicable. Disability support must include visual, hearing, speech, mobility/dexterity, cognitive/learning, seizure/motion-sensitivity, and temporary/situational impairment use cases.

Multilingual support is part of the same acceptance gate. User-facing modules must carry locale/language metadata, support translation/localization workflows, preserve meaning for safety/compliance/payment disclosures, and provide fallback language behavior rather than silently failing. AI translation is assistive; legally or clinically consequential language may require verified human or approved-domain translation workflows.

New modules may not be marked complete solely because the default mouse/touch English path works.

## Private Founder Archive / HoloGPT rule

The Founder Archive is a private owner-scoped history store for project conversations, code, designs, business notes, white papers, media references, CAD/manufacturing artifacts and other founder-approved records. It is not a public knowledge base.

Every Founder Archive record and chunk must carry an owner_id and be protected by database row-level security requiring auth.uid() = owner_id. Application-layer access guards must enforce the same condition. HoloGPT/Stubbs AI may retrieve founder archive context only for the authenticated matching owner and only for the active request. Retrieval does not grant permission to share, export, delete, transfer ownership, or change access controls.

Founder Archive ingestion must preserve provenance where available, including source type, source reference, original creation date, checksum/content hash, capture time, tags, related Legacy Design Vault IDs, and searchable chunks. Source material must not be rewritten and presented as original evidence; summaries and derived memories remain distinguishable from source records.

HoloGPT founder context assembly must combine three separately governed sources: Googolplex working memory, Founder Archive history, and Legacy Design Recovery Vault provenance. Every returned context item must keep its source label and confidence/provenance status so HoloGPT can distinguish working memory, reconstructed history, verified source material, and partial/reference-only legacy records. The combined bundle is retrieval-only by default.

Exports, deletions, sharing, ownership changes, or permission changes require an explicit authenticated owner action and must be auditable. Service-role ingestion may be used only by trusted server-side jobs and may not create a public access path.

The application must never claim the complete historical ChatGPT archive has been ingested unless an actual export/source set has been processed and reconciled. Missing conversations remain missing until a source is supplied or recovered.

## Legacy Design Recovery Vault rule

The Legacy Design Recovery Vault is the durable registry for recovered TRYAMM inventions that originated in prior conversations, files, prototypes, diagrams, code, CAD, white papers, or other project artifacts. Recovered concepts must not be silently re-created with guessed specifications when an authoritative legacy source has not been found.

Each invention record must preserve the invention name and aliases, domain, recovered facts, unresolved specifications, dependencies, safety requirements, implementation status, source artifacts, revisions/checksums where available, recovery confidence, and recovery stage. Supported source artifacts include conversations, code, diagrams, images, CAD, STL, STEP, BOMs, tests, white papers, and other verifiable project evidence.

The required recovery lifecycle is: Recovered -> Source Verified -> Specification Reconstructed -> Digital Twin -> Simulation Tested -> Prototype -> Independently Verified -> Production Candidate. Progression is evidence-gated and sequential. A design may be demoted at any time when new evidence invalidates an earlier assumption.

Legacy records are not proof that a physical product works. Unknown propulsion, materials, performance, safety, manufacturing, or regulatory specifications remain unknown until recovered or independently established. The Vault is a provenance and continuity system, not a substitute for engineering validation, patent analysis, certification, or physical testing.

## MobilityOS and robotics rule

MobilityOS covers electric vehicles, delivery drones, passenger/cargo eVTOL or flying-vehicle concepts, ground and warehouse robots, agricultural robots, marine vehicles, and SpaceOS rovers. Stubbs AI may plan, dispatch, coordinate, translate, remember, and optimize missions, but it may not directly generate or execute steering, throttle, braking, rotor, flight-control, or actuator commands.

Physical motion must remain behind deterministic controllers and a fail-closed safety envelope appropriate to the vehicle class. Required controls may include maintenance readiness, battery/energy reserve, payload/speed/altitude limits, geofences, collision avoidance, communications health, authorized operator state, simulation/digital-twin checks, emergency stop, and human approval. Accessibility requirements such as wheelchair/ramp/lift compatibility, accessible pickup/handoff, one-hand/voice/switch control, captions, haptic/visual alerts, and multilingual assistance are part of mobility dispatch acceptance when applicable.

A mobility mission is not production-ready merely because planning succeeds. Real-world deployment additionally requires the applicable hardware validation, operator procedures, regulatory approvals/certifications, insurance, telemetry, emergency procedures, and jurisdiction-specific operating authorization.

## Non-bypassable controls

No model, cache, latency optimizer, memory component, hierarchy agent, sensory adapter, self-model, translation layer, accessibility adapter, mobility planner, founder-archive retrieval process, founder-context assembler, or legacy-recovery process may bypass:

- authentication or authorization
- Supabase RLS
- owner-only Founder Archive access
- regulated-service credential verification
- ComplianceOS decisions
- payment and payout controls
- audit persistence
- explicit safety gates
- deterministic physical-control boundaries
- evidence requirements for legacy-design stage advancement

When a required control is unavailable, high-impact, regulated, physical-motion, founder-private, and production-candidate actions fail closed.

## Memory rule

Googolplex Memory is the shared application memory architecture. New modules must not invent isolated persistence for conversational/project memory when the information belongs in the shared memory layer. Domain databases remain the source of truth for financial, compliance, credential, inventory, booking, mobility telemetry/mission state, founder archive source records, legacy-design provenance/stage state, and other transactional state; memory stores context and verified summaries, not a replacement ledger, archive, or invention provenance database.

## Speed rule

Quantum Speed Engine and Quantum Lag Buster optimize routing, retrieval, concurrency, batching, caching, and context size. Performance optimization must degrade optional work before it degrades safety-critical, accessibility-critical, physical-control-critical, privacy-critical, or evidence/provenance-critical work.

## Benchmark & Proof rule

Performance claims about Stubbs AI, Googolplex Memory, Quantum Speed Engine, Quantum Lag Buster, Hierarchy AGI, model routing, accessibility, multilingual behavior, MobilityOS, or related runtime improvements must be backed by measured evidence. The controlled benchmark runner must use equivalent workload definitions for baseline and optimized targets.

Persisted proof may include P50/P95/P99 latency, memory retrieval time, tokens/context, cost estimates, success rate, cache hit rate, throughput, and safety-gate preservation when those values are actually instrumented. Accessibility proof should additionally measure applicable task-completion rates for keyboard-only, screen-reader, voice/switch/one-hand interaction, caption/transcription coverage, reduced-motion paths, accessible error recovery, translation success, and language-switch latency. Mobility proof should additionally measure applicable mission completion, dispatch/planning latency, energy use, charging impact, human-intervention rate, accessibility completion, emergency-stop latency, collision/near-miss events, and deterministic safety-gate preservation. Missing measurements stay missing; they must not be filled with invented values. Visual concept art is illustrative and never counts as benchmark evidence.

## Domain routing

New domains must register with Stubbs AI rather than creating unrelated AI entry points. Existing deterministic services remain authoritative for side effects.

## Completion gate

A module is not production-ready until it has authentication, authorization/RLS, persistence, tests, observability, secrets/configuration, failure handling, accessibility and multilingual acceptance appropriate to the module, and deployed-environment verification. Performance-sensitive modules additionally require a measured proof run when optimization claims will be made. Physical mobility/robotics modules additionally require deterministic-controller validation, hardware/sensor validation, emergency-stop validation, and the applicable real-world regulatory/operational approvals before physical deployment. Legacy physical inventions additionally require source verification, reconstructed specifications, digital-twin/simulation evidence, prototype evidence, independent verification, and the applicable production safety/regulatory gates before being represented as production candidates. Founder Archive/HoloGPT integration additionally requires authenticated owner identity, RLS verification, retrieval-isolation tests, audit logging for privileged mutations, and successful ingestion/reconciliation tests before any claim of complete historical coverage.
