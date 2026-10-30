# Media queue production gate
No SQL has been deployed. Existing media_processing_jobs references live_recordings via a foreign key.

Before approval:
- Verify table RLS, all grants/policies, triggers, active jobs and code consumers.
- Take and restore-test a backup in an isolated project.
- Add nullable lease fields; don't drop or rename legacy fields.
- Implement transactional claim/heartbeat/complete with unique token fenced updates, capped retries and job idempotency.
- Reject stale completion and expired token; test two simultaneous workers.
- Ensure per-user ownership and quarantined storage; confirm ClamAV first.
- Keep the original worker disabled until transaction-based worker passes end-to-end.
- Do not treat a source manifest as a database backup.
- GitHub source branch review only; no production promotion without smoke tests.
