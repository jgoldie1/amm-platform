# FaithVerse backup, monitoring, recovery runbook
## Deployment safety
- Existing PR #5 remains draft and unmerged; do not auto-promote.
- Record the last-known-good commit and deployment ID and verify rollback to it in an isolated preview; do NOT change the production alias without explicit review.
- GitHub code commits are not database/media backups.
## Database
- Supabase-managed backups are plan-dependent. Database backups do not include Storage object bytes; separately back up all critical media.
- For an authorized manual backup on a secure workstation, install pg_dump and set FAITHVERSE_BACKUP_DATABASE_URL in the shell (never in Git), then:
  node scripts/recovery/backup-db.mjs /secure/faithverse-YYYYMMDD.dump
- Treat this dump as **sensitive unencrypted data** until encrypted and transferred offsite. Never upload to a public GitHub artifact, commit, or send via email.
- Test restore ONLY in a disposable isolated database, verifying schema, sample queries, and role policies. No automatic destructive restore is wired.
## Media
- To compress up to 25 existing files safely: create a JSON array of local input paths and run:
  node scripts/media/batch-compress.mjs inputs.json /safe/output
- Requires locally installed ffmpeg. Original masters are never intentionally overwritten. Inspect compressed videos manually. No automatic cloud processing queue is yet active.
- Back up private Supabase Storage objects separately, with owner/rights metadata and checksums. Source-code backups do not preserve media.
## Monitoring
- Set GitHub Actions repository variable FAITHVERSE_HEALTH_URL to the final HTTPS health endpoint. Until configured, the scheduled check is inert and makes no availability claim.
- Enable GitHub Actions failure notifications for maintainers. Implement error aggregation and on-call escalation before a public launch.
## Recovery decision
- Code regression: route traffic to previously verified deploy after smoke tests; preserve transactions.
- Database issue: capture current state, consult operator, restore to a *new* instance first; avoid losing recent orders.
- Media issue: restore object version from independent backup; never overwrite originals before verified recovery.
- Continue to keep Stripe, Lulu and customer uploads disabled until security/fulfillment acceptance tests are passed.
