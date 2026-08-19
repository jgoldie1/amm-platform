create extension if not exists pgcrypto;

create table if not exists public.security_control_state (
  id text primary key default 'global' check (id='global'),
  mode text not null default 'normal' check (mode in ('normal','elevated','panic','recovery')),
  freeze_payments boolean not null default false,
  freeze_payouts boolean not null default false,
  freeze_gifts boolean not null default false,
  freeze_device_control boolean not null default false,
  freeze_publishing boolean not null default false,
  freeze_uploads boolean not null default false,
  freeze_live boolean not null default false,
  reason text,
  incident_id uuid,
  updated_by uuid,
  updated_at timestamptz not null default now()
);
insert into public.security_control_state(id) values('global') on conflict(id) do nothing;
alter table public.security_control_state enable row level security;
revoke all on public.security_control_state from anon, authenticated;

create table if not exists public.security_events_append_only (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  actor_id uuid,
  event_type text not null,
  severity text not null check (severity in ('info','low','medium','high','critical')),
  payload jsonb not null default '{}'::jsonb,
  previous_hash text,
  event_hash text not null default ''
);
alter table public.security_events_append_only enable row level security;
revoke all on public.security_events_append_only from anon, authenticated;

create or replace function public.security_event_hash() returns trigger language plpgsql security definer set search_path=public as $$
declare prev text;
begin
  select event_hash into prev from public.security_events_append_only order by occurred_at desc,id desc limit 1;
  new.previous_hash := prev;
  new.event_hash := encode(digest(coalesce(prev,'GENESIS') || new.id::text || new.occurred_at::text || new.event_type || new.severity || new.payload::text,'sha256'),'hex');
  return new;
end $$;
drop trigger if exists security_event_hash_before_insert on public.security_events_append_only;
create trigger security_event_hash_before_insert before insert on public.security_events_append_only for each row execute function public.security_event_hash();
create or replace function public.prevent_security_event_mutation() returns trigger language plpgsql as $$ begin raise exception 'IMMUTABLE_SECURITY_LOG'; end $$;
drop trigger if exists security_events_no_update on public.security_events_append_only;
create trigger security_events_no_update before update or delete on public.security_events_append_only for each row execute function public.prevent_security_event_mutation();

create table if not exists public.security_step_up_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  action text not null,
  method text not null check (method in ('webauthn','passkey','mfa')),
  credential_id text,
  verified_at timestamptz not null default now(),
  expires_at timestamptz not null default (now()+interval '5 minutes'),
  metadata jsonb not null default '{}'::jsonb
);
alter table public.security_step_up_events enable row level security;
revoke all on public.security_step_up_events from anon, authenticated;
create index if not exists security_step_up_user_action_idx on public.security_step_up_events(user_id,action,verified_at desc);

create table if not exists public.security_incidents (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'open' check (status in ('open','contained','recovery','closed')),
  severity text not null check (severity in ('medium','high','critical')),
  summary text not null,
  affected_services text[] not null default '{}',
  opened_by uuid,
  opened_at timestamptz not null default now(),
  contained_at timestamptz,
  recovered_at timestamptz,
  closed_at timestamptz,
  evidence jsonb not null default '{}'::jsonb
);
alter table public.security_incidents enable row level security;
revoke all on public.security_incidents from anon, authenticated;

-- Quarantine is the only user-write upload origin. A privileged scanner/processor must move approved files onward.
insert into storage.buckets(id,name,public,file_size_limit)
values('creator-media-quarantine','creator-media-quarantine',false,1073741824)
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit;
drop policy if exists quarantine_owner_insert on storage.objects;
create policy quarantine_owner_insert on storage.objects for insert to authenticated
with check(bucket_id='creator-media-quarantine' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists quarantine_owner_read on storage.objects;
create policy quarantine_owner_read on storage.objects for select to authenticated
using(bucket_id='creator-media-quarantine' and (storage.foldername(name))[1]=(select auth.uid())::text);

-- Service-role isolation: browser roles cannot directly alter incident/control/step-up evidence.
revoke insert,update,delete on public.security_control_state from anon,authenticated;
revoke insert,update,delete on public.security_incidents from anon,authenticated;
revoke insert,update,delete on public.security_step_up_events from anon,authenticated;
revoke insert,update,delete on public.security_events_append_only from anon,authenticated;
