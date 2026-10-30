-- REVIEW ONLY: requires additive lease columns and verified restore before running.
-- Functions deliberately omit grants to browser roles. Install within a restricted worker schema.
create schema if not exists media_worker;
revoke all on schema media_worker from public, anon, authenticated;
create or replace function media_worker.claim_job(p_worker_token uuid, p_lease_seconds integer default 120)
returns table(job_id uuid, owner_id uuid, source_path text, lease_token uuid)
language sql security invoker set search_path = ''
as $$
 with chosen as (
   select j.id from public.media_processing_jobs j
   where (j.status = 'queued' or (j.status = 'processing' and j.lease_expires_at < now()))
     and j.attempts < 3
   order by j.created_at, j.id
   for update skip locked limit 1
 ), changed as (
   update public.media_processing_jobs j
   set status='processing', lease_token=p_worker_token, lease_expires_at=now()+make_interval(secs=>p_lease_seconds),
       last_heartbeat_at=now(), attempts=j.attempts+1
   from chosen where j.id=chosen.id
   returning j.id,j.owner_id,j.source_path,j.lease_token
 )
 select id,owner_id,source_path,lease_token from changed;
$$;
create or replace function media_worker.renew_job(p_id uuid,p_token uuid,p_seconds integer default 120)
returns boolean language plpgsql security invoker set search_path = ''
as $$
begin
 if p_seconds < 15 or p_seconds > 600 then return false; end if;
 update public.media_processing_jobs set lease_expires_at=now()+make_interval(secs=>p_seconds),
 last_heartbeat_at=now() where id=p_id and lease_token=p_token and status='processing' and lease_expires_at>now();
 return found;
end $$;
create or replace function media_worker.complete_job(p_id uuid,p_token uuid,p_manifest jsonb)
returns boolean language plpgsql security invoker set search_path = ''
as $$
begin
 update public.media_processing_jobs set status='completed', output_manifest=p_manifest, completed_at=now(),
 lease_token=null,lease_expires_at=null
 where id=p_id and lease_token=p_token and status='processing' and lease_expires_at>now();
 return found;
end $$;
revoke all on all functions in schema media_worker from public, anon, authenticated;
-- IMPORTANT: These functions need trusted worker database privileges; do not expose to PostgREST.
-- Validate actual allowed status values and applicable RLS grants before applying.
