# TRYAMM Architecture Lock

This file is the development contract for TRYAMM application modules.

## Mandatory intelligence path

All non-static product modules must integrate through the shared Stubbs AI runtime contract:

1. Stubbs AI Gateway
2. Advanced model/router layer
3. Googolplex Memory retrieval
4. Quantum Speed scheduling
5. Quantum Lag Buster latency protection
6. Guardian risk gate
7. Domain-specific deterministic service
8. Evidence/audit verification
9. Googolplex Memory state update

Static assets, build tooling, and public health checks are exempt from the runtime path.

## Non-bypassable controls

No model, cache, latency optimizer, memory component, or agent may bypass:

- authentication or authorization
- Supabase RLS
- regulated-service credential verification
- ComplianceOS decisions
- payment and payout controls
- audit persistence
- explicit safety gates

When a required control is unavailable, high-impact and regulated actions fail closed.

## Memory rule

Googolplex Memory is the shared application memory architecture. New modules must not invent isolated persistence for conversational/project memory when the information belongs in the shared memory layer. Domain databases remain the source of truth for financial, compliance, credential, inventory, booking, and other transactional state; memory stores context and verified summaries, not a replacement ledger.

## Speed rule

Quantum Speed Engine and Quantum Lag Buster optimize routing, retrieval, concurrency, batching, caching, and context size. Performance optimization must degrade optional work before it degrades safety-critical work.

## Domain routing

New domains must register with Stubbs AI rather than creating unrelated AI entry points. Existing deterministic services remain authoritative for side effects.

## Completion gate

A module is not production-ready until it has authentication, authorization/RLS, persistence, tests, observability, secrets/configuration, failure handling, and deployed-environment verification appropriate to that module.
