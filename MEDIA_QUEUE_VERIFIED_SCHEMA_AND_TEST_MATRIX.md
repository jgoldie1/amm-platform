# Media worker lease validation: observed live schema (read only)
Date: 2026-10-29
Project: fxluchtdfpediivhoksl

Verified `public.media_processing_jobs` contains: id, owner_id, recording_id, source_path, job_type, status, output_manifest, error_message, created_at, completed_at.
- status is NOT NULL and defaults to 'queued'.
- existing constraints are primary key(id) and foreign key(recording_id) references live_recordings(id) ON DELETE CASCADE.
- lease fields do not exist on live table.
- there is NO database CHECK restricting job status to a fixed set. This is not proof the app allows other statuses.
- a source code review and row policy/grant review remain required.

## Required tests on an isolated, restorable staging database
1. Apply the additive schema review and worker function migration ONLY to staging.
2. Insert two synthetic queued jobs with non-real user IDs and no recording link, using test identity fixtures.
3. Two workers racing for one queued job: exactly one claim succeeds.
4. Heartbeat with correct token extends lease; wrong token does nothing.
5. Completed job ignores any second completion; old token after reclaimed lease fails.
6. Expired lease is reclaimable only while attempts < 3; exactly three max claims per job.
7. Malformed/oversized lease_seconds must be rejected by claim/renew functions.
8. Worker must quarantine objects until scan success; publication must be a separate verified step.
9. User A cannot read/download user B's objects or queue records.
10. Roll back test **transaction** and verify original table rows are unchanged; separately rehearse database restoration from an actual backup.

## Preconditions to leave review
Do not apply this to the shared project until backup restore evidence, ownership/storage policies, worker runtime, and status compatibility are verified. No customer uploads or production merge.
