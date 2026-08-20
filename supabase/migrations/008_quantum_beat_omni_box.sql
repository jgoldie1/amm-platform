create table if not exists public.quantum_beat_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  source_device_id text not null,
  target text not null,
  transport text not null,
  role text not null,
  latency_budget_ms integer not null,
  locale text,
  accessibility jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.omni_box_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  kind text not null,
  locale text not null default 'en',
  languages text[] not null default array['en']::text[],
  episode_count integer,
  immersive_modes text[] not null default array['2d']::text[],
  monetization text[] not null default array['free_ad_supported']::text[],
  accessibility jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.omni_box_revenue_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.omni_box_projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  gross_cents bigint not null default 0,
  creator_cents bigint not null default 0,
  tryamm_cents bigint not null default 0,
  partner_cents bigint not null default 0,
  processor_cents bigint not null default 0,
  tax_cents bigint not null default 0,
  ledger_reference text,
  created_at timestamptz not null default now()
);

alter table public.quantum_beat_sessions enable row level security;
alter table public.omni_box_projects enable row level security;
alter table public.omni_box_revenue_events enable row level security;

create policy "quantum beat owner access" on public.quantum_beat_sessions for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "omni box project owner access" on public.omni_box_projects for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "omni box revenue owner access" on public.omni_box_revenue_events for select using (auth.uid() = owner_id);
