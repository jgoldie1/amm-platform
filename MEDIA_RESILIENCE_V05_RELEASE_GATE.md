# TRYAMM Media v0.5 resilience review gate

**Status:** standalone zip package, 14 local tests passed. Not deployed, no production schema changes.

Changes in source archive:
- PostgreSQL worker uses unique lease tokens, periodic heartbeat, and token-fenced completion; malware scan required.
- Encrypted backup scheduler validates decryption and SHA-256 prior to attempted S3 upload. Separate encrypted storage, IAM credentials, lifecycle retention and live scheduler are NOT configured.
- Persistent-disk alert outbox retries failures with exponential delays; a real delivery provider is NOT connected.
- Restore drill decrypts into isolated temporary directory and verifies SHA-256; no production deployment rollback performed.

Staging checklist:
1. Apply reviewed `sql/transactional_queue.sql` then `sql/lease_upgrade.sql` on a separate staging Postgres project; do not use alternative `media_private.jobs` schema with this worker.
2. Install and pin node-postgres, FFmpeg, FFprobe, ClamAV; scan on a worker with strict resource limits.
3. Wire authenticated upload API to PostgreSQL jobs and private cloud object storage. Legacy `server.mjs` still uses a local JSON queue.
4. Configure encrypted offsite bucket and lifecycle policy, backup scheduler, alert delivery and persistent outbox; test key rotation and actual restore.
5. Test customer upload → scan → transcode → owner-only download, crash/lease expiry, duplicate deliveries, and recovery from last-known-good deployment.
6. Keep uploads and commerce disabled until this passes; never restore database over newer customer transactions.

Source archive: `tryamm-media-pipeline-v05-recovery.zip` shared in ChatGPT, not uploaded to GitHub repository.
