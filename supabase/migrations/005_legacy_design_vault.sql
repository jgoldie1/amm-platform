create table if not exists public.legacy_designs (
  id text primary key,
  name text not null,
  domain text not null,
  aliases jsonb not null default '[]'::jsonb,
  summary text not null,
  recovered_facts jsonb not null default '[]'::jsonb,
  unresolved_specs jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  safety_requirements jsonb not null default '[]'::jsonb,
  recovery_confidence text not null check (recovery_confidence in ('verified','partial','reference_only')),
  implementation_status text not null,
  recovery_stage text not null default 'recovered',
  authoritative_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.legacy_design_artifacts (
  id text primary key,
  design_id text not null references public.legacy_designs(id) on delete cascade,
  kind text not null,
  source text not null,
  checksum text,
  revision text,
  verified boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.legacy_design_stage_events (
  id uuid primary key default gen_random_uuid(),
  design_id text not null references public.legacy_designs(id) on delete cascade,
  from_stage text,
  to_stage text not null,
  actor_id uuid,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.legacy_designs enable row level security;
alter table public.legacy_design_artifacts enable row level security;
alter table public.legacy_design_stage_events enable row level security;

create index if not exists legacy_designs_domain_idx on public.legacy_designs(domain);
create index if not exists legacy_designs_stage_idx on public.legacy_designs(recovery_stage);
create index if not exists legacy_design_artifacts_design_idx on public.legacy_design_artifacts(design_id);
create index if not exists legacy_design_stage_events_design_idx on public.legacy_design_stage_events(design_id, created_at desc);

comment on table public.legacy_designs is 'Evidence-backed TRYAMM invention recovery registry. RLS policies must be added explicitly before client access.';
