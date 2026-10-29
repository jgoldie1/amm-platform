# TRYAMM Media Resilience v0.4 — staging gate

Source bundle delivered separately: `tryamm-media-pipeline-v04-resilience.zip` (not auto-deployed).

## Implemented in standalone package
- Unique UUID fencing token per job claim; DB heartbeat extends valid leases; stale worker cannot commit its result.
- AES-256-GCM local file encryption and authenticated restore, with tamper rejection. **Not** automatic backups or an offsite retention policy.
- HTTPS HMAC-signed alert helper with deliberately limited event fields. Requires actual webhook URL, secret and delivery retries.
- Rollback readiness checker refusing unverified restore drills or missing approval. Does **not** roll back Vercel or restore a database.
- SQL upgrade for the `media_internal.jobs` private schema.

## Mandatory production gates
1. Peer-review migration and deploy only to isolated staging database.
2. Replace original queue and worker paths with token-based claims/heartbeats/completion; test lease expiry and worker restart.
3. Configure private managed storage and offsite encrypted backup, retained copies, secret rotation, automated restore drill.
4. Connect alert provider and verify alert delivery + retry/dead-letter behavior.
5. Confirm a last-known-good deployment, database restore, media restore, and traffic rollback with evidence.
6. Test actual signed-in uploads, antivirus scan, compression, private download, user isolation and quotas.
7. Keep public uploads, live payments and print orders disabled until all gates pass.

No production change is authorized by this file; no DB migration was applied.
