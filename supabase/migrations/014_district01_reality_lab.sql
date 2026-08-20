begin;

create table if not exists public.reality_lab_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_room text not null default 'welcome-hall',
  completed_rooms text[] not null default '{}',
  xp integer not null default 0 check (xp >= 0),
  accessibility jsonb not null default '{}'::jsonb,
  checkpoint_revision bigint not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.reality_lab_progress enable row level security;

revoke all on table public.reality_lab_progress from anon;
revoke all on table public.reality_lab_progress from authenticated;
grant select, insert, update on table public.reality_lab_progress to authenticated;

create policy "reality_lab_progress_select_own"
on public.reality_lab_progress
for select
to authenticated
using (auth.uid() = user_id);

create policy "reality_lab_progress_insert_own"
on public.reality_lab_progress
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "reality_lab_progress_update_own"
on public.reality_lab_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create table if not exists public.reality_lab_proof_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  instance_id uuid null references public.world_instances(id) on delete cascade,
  room_id text not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  server_verified boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reality_lab_proof_events enable row level security;

revoke all on table public.reality_lab_proof_events from anon;
revoke all on table public.reality_lab_proof_events from authenticated;
grant select on table public.reality_lab_proof_events to authenticated;

create policy "reality_lab_events_select_own"
on public.reality_lab_proof_events
for select
to authenticated
using (auth.uid() = user_id);

create index if not exists reality_lab_events_user_created_idx
  on public.reality_lab_proof_events(user_id, created_at desc);
create index if not exists reality_lab_events_instance_created_idx
  on public.reality_lab_proof_events(instance_id, created_at desc);

commit;
