-- REVIEW ONLY. Do not apply until backup/restore and RLS audit completed.
BEGIN;
ALTER TABLE public.media_processing_jobs
 ADD COLUMN IF NOT EXISTS lease_token uuid,
 ADD COLUMN IF NOT EXISTS lease_expires_at timestamptz,
 ADD COLUMN IF NOT EXISTS last_heartbeat_at timestamptz,
 ADD COLUMN IF NOT EXISTS attempts integer NOT NULL DEFAULT 0;
ALTER TABLE public.media_processing_jobs
 ADD CONSTRAINT media_processing_attempts_nonnegative CHECK (attempts >= 0) NOT VALID;
COMMIT;
-- Reversal after confirming no worker depends on these fields:
-- ALTER TABLE public.media_processing_jobs DROP CONSTRAINT IF EXISTS media_processing_attempts_nonnegative;
-- ALTER TABLE public.media_processing_jobs DROP COLUMN IF EXISTS lease_token,
-- DROP COLUMN IF EXISTS lease_expires_at, DROP COLUMN IF EXISTS last_heartbeat_at,
-- DROP COLUMN IF EXISTS attempts;
