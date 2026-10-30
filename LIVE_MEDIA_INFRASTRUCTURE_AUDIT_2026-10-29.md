# Live media infrastructure audit — 2026-10-29
Supabase project ref: fxluchtdfpediivhoksl (active).
Verified: private storage bucket creator-media, existing public.media_processing_jobs and public.media_publish_jobs. Preserve these rather than create duplicate systems.
The existing processing job table has id, owner_id, recording_id, source_path, job_type, status, output_manifest, error_message, created_at, completed_at. No heartbeat token or expiry fields.
No end-to-end authenticated upload was run; no video file was processed; no DB change or storage policy was applied.

## Required non-destructive migration review
1. Back up schema/data and validate restoration, check active processes using existing queue.
2. Add nullable lease_token uuid, lease_expires_at timestamptz, last_heartbeat_at timestamptz, attempts integer default 0, and processed_path text to existing media_processing_jobs; never drop current columns.
3. Add narrowly scoped transactional claim, renew, complete and fail functions. Ensure stale tokens cannot complete or publish. Carefully review existing RLS, grants, triggers, constraints and statuses first.
4. Validate storage.objects policies for creator-media; use path prefixes scoped to owner and keep originals quarantined until ClamAV verifies safety.
5. Test in isolated staging and get security advisor results before production.
6. Connect FFmpeg/ClamAV on a non-Vercel worker with persistent queue and signed download URLs.
7. Configure backup destination, retention, monitoring, deployment rollback and Stripe/Lulu test transactions separately.
Public uploads, payments, and production promotions stay disabled until all gates pass.
