# TRYAMM Self-Healing + Repair Runtime

## Goal
Add safe resilience and repair behavior to the release spine without allowing uncontrolled self-modifying production code.

Core loop:
DETECT → CLASSIFY → CONTAIN → RECOVER → VERIFY → OBSERVE → ESCALATE.

## What self-healing means
Self-healing is operational recovery, not autonomous production code mutation. The runtime may restart failed workers, fail over providers, reopen safe connections, restore known-good checkpoints, requeue idempotent jobs, downgrade quality, isolate unhealthy regions/services and switch to verified backups.

Any code repair must go through branch/PR → typecheck → tests → security checks → build → preview → explicit deployment authorization. Production never edits its own source code directly.

## Health domains
Monitor:
- Auth/session health
- Supabase connectivity and RLS-dependent operations
- LiveKit room/token/media health
- realtime chat/presence
- Money Engine ledger/webhooks/reconciliation
- HoloGPT/HoloForge provider health
- recording/transcoding/storage
- Discord/Zapier/integration delivery
- Mars/world checkpoint persistence
- CDN/edge/network quality
- HoloHost show runtime
- haptic/device-control adapters
- notification providers
- CI/deployment health

## Failure classes
1. Transient: timeout, temporary provider outage, packet loss, reconnect.
2. Degraded: high latency, thermal throttling, elevated frame drops, provider partial outage.
3. Data-risk: duplicate webhook, ledger mismatch, failed checkpoint write, stale room authorization.
4. Security: suspicious login, token abuse, malformed webhook, privilege anomaly, malware signal.
5. Catastrophic: database unavailable, corrupted deployment, broad credential compromise, region outage.

## Recovery policies
### Auth/session
- refresh normal expired sessions through supported auth flow
- revoke compromised/stale sessions
- step-up for sensitive actions
- never fabricate a session or bypass Supabase verification

### LIVE/LiveKit
- reconnect participants with bounded exponential backoff
- re-request a fresh scoped token when allowed
- clear stale presence on host end/timeout
- close abandoned rooms after defined timeout
- fail over only to a preconfigured verified LiveKit endpoint
- preserve recording consent and room authorization state

### Chat/presence
- reconnect realtime channel
- deduplicate messages by event/idempotency ID
- rebuild presence from authoritative room membership when safe
- rate-limit reconnect storms

### Money Engine
- never retry a debit/payout blindly
- idempotency key required for every external payment mutation
- duplicate webhook becomes no-op after first authoritative event
- provider/ledger mismatch freezes affected payout and opens reconciliation state
- corrections use reversal/compensating entries; historical ledger records are immutable

### HoloGPT/HoloForge
- provider timeout → bounded retry → alternate approved provider if policy allows
- generation job remains in explicit pending/failed/succeeded state
- reserve/debit HoloGPT Credits idempotently
- failed job releases/refunds reserved eligible usage according to policy

### Recording/media
- multipart/resumable upload
- checksum verification
- failed transcode retries from immutable source
- quarantine malformed/malware-flagged content
- never publish a partially processed artifact

### Global/Africa/Haiti constrained networks
- reduce bitrate
- lower holographic level
- switch to low-poly GLB
- audio-only LIVE fallback
- captions/text fallback
- resumable upload and durable drafts
- reconnect to closest verified edge/CDN route

### Persistent worlds/Mars
- checkpoint uses version/revision and idempotency key
- failed checkpoint does not overwrite last known-good revision
- restore last verified checkpoint on reconnect
- conflicting writes create conflict/reconciliation state rather than silent overwrite

### HoloHost
- if voice/animation provider fails, degrade to audio + captions or static avatar
- preserve show state/run-of-show
- labeled ad/commerce actions fail closed when commerce provider is unhealthy
- Panic Mode stops autonomous host actions immediately

## Circuit breakers
Each external provider has CLOSED / OPEN / HALF_OPEN state.
- CLOSED: normal traffic.
- OPEN: stop sending requests after threshold failures; use approved fallback or degrade.
- HALF_OPEN: allow small probe traffic before recovery.

Circuit state must not bypass payments, rights, age/territory, moderation or security gates.

## Backoff
Use bounded exponential backoff with jitter for safe/idempotent reads and reconnects. Do not retry unsafe money/device mutations unless the operation has a provider-supported idempotency key and authoritative status check.

## Bulkheads
Keep failures isolated:
- LIVE failure must not take down wallet
- HoloForge failure must not break Auth
- Discord/Zapier outage must not block Money Engine settlement
- Mars/world outage must not expose service-role credentials
- HoloHost failure must not grant access to private memory

## Known-good recovery
Maintain:
- versioned migrations
- immutable release commit SHA
- deployment manifest
- environment/config version
- schema version
- asset/checkpoint revisions
- last known-good provider configuration

Rollback means restoring a verified release/configuration, not silently reverting ledger history or deleting evidence.

## Panic Mode integration
ANOMALY → freeze privileged operations → revoke affected sessions/tokens → stop payouts/gifts/new top-ups where configured → stop external haptics/device commands → isolate affected service → quarantine new uploads → preserve immutable evidence → keep known-good world/media/ledger state → operator review → step-up → controlled recovery.

Self-healing never automatically disables Panic Mode or weakens a security control to restore service.

## Self-repair assistant
Stubbs AI/HoloGPT may:
- inspect safe health telemetry
- correlate errors
- propose a patch
- create a branch/PR
- generate tests
- explain blast radius
- recommend rollback/failover

It may not:
- push unreviewed code directly to production
- expose or rotate secrets without authorized workflow
- alter ledger history
- weaken RLS/CSP/auth/security gates to make tests pass
- automatically approve its own production patch

## SLO/health signals
Track at minimum:
- availability
- error rate
- P50/P95/P99 latency
- LiveKit reconnect rate
- dropped frames
- chat delivery latency
- recording failure rate
- upload resume success
- webhook duplicate/replay count
- ledger reconciliation mismatches
- HoloGPT generation failure rate
- world checkpoint save/restore success
- Panic Mode activation/recovery events
- regional network fallback rates

## Release proof
Self-healing is YELLOW until tests prove:
1. LiveKit disconnect/reconnect restores viewer safely;
2. stale ended-room link cannot mint/join;
3. duplicate payment webhook cannot double-credit;
4. failed generation returns/resolves reserved credits correctly;
5. interrupted upload resumes and checksum matches;
6. failed Mars checkpoint preserves last known-good revision;
7. provider circuit breaker opens and fallback/degradation works;
8. HoloHost degrades to safe fallback when a provider fails;
9. Panic Mode overrides self-healing and stays authoritative;
10. proposed code repair goes through CI and preview instead of production self-edit.

Only after these pass can the self-healing layer be marked GREEN.