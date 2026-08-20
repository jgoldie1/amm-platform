-- Launch RLS policies for user-facing tables.
-- Sensitive security/audit/internal tables intentionally remain without direct client policies.

drop policy if exists subscriptions_owner_read on public.subscriptions;
create policy subscriptions_owner_read on public.subscriptions
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists moderation_appeals_owner_read on public.moderation_appeals;
create policy moderation_appeals_owner_read on public.moderation_appeals
for select to authenticated
using ((select auth.uid()) = appellant_user_id);

drop policy if exists moderation_appeals_owner_insert on public.moderation_appeals;
create policy moderation_appeals_owner_insert on public.moderation_appeals
for insert to authenticated
with check ((select auth.uid()) = appellant_user_id and status = 'pending');

drop policy if exists moderation_staff_self_read on public.moderation_staff;
create policy moderation_staff_self_read on public.moderation_staff
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists payout_jobs_owner_read on public.payout_jobs;
create policy payout_jobs_owner_read on public.payout_jobs
for select to authenticated
using (user_id = ((select auth.uid()))::text);

-- Security MFA/passkey/challenge/audit and self-healing/system telemetry tables remain
-- server-only because their rows contain secret material or privileged runtime state.
