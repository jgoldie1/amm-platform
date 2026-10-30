# FaithVerse Recovery and Media Safety
## Crash and regression response
1. Do not merge or redeploy automatically on a failing check.
2. Keep last known good production commit/deployment identifier and configuration in a secure operations log (not in Git).
3. Promote new code only after Quantum Sandbox build, mobile smoke test, and accessible 2D fallback test.
4. On regression, roll back traffic/deployment to the last known good version. Roll back database schema only using separately tested migrations; never overwrite newer customer data with an old snapshot.
5. Before database migrations take an encrypted Supabase/Postgres snapshot and verify a restore in a *separate* test database. Version media in private storage; retain at least one independent encrypted backup with tested restore.
6. Recheck auth, RLS, file access, checkout-disabled states, and book order state after rollback.
7. GitHub workflow stores **source manifest only**: it is NOT a DB backup or media backup.
## Video and audio compression
Install FFmpeg locally and run:
`node scripts/media/compress.mjs original.mov compressed.mp4`
Preserves original; refuses overwriting existing output. Creates H.264/AAC 720p MP4 suitable for broad sharing; does not create adaptive bitrate variants, captions or an upload pipeline. Inspect quality and audio sync. For source masters keep originals in separately backed-up storage.
For photos use reviewed WebP/AVIF conversion in an isolated asset pipeline; for audio consider AAC/Opus depending on playback needs. Do not compress manuscripts so aggressively that text is unreadable.
## Shipping gates
Require working HTTPS media delivery, uploads and storage quotas, RLS, monitoring alerts, real-device playback, accessibility, and disabled payments until Stripe/Lulu full sandbox tests pass. The status of Vercel and Supabase billing may block deployment.
