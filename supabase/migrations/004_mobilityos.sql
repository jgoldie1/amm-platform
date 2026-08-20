create table if not exists public.mobility_assets (
  id uuid primary key default gen_random_uuid(),
  external_id text unique not null,
  mobility_class text not null,
  autonomy_mode text not null,
  jurisdiction text not null,
  operator_id uuid,
  battery_percent numeric,
  position jsonb,
  speed_mps numeric,
  payload_kg numeric,
  accessibility_profile_ids jsonb not null default '[]'::jsonb,
  maintenance_state text not null default 'ready',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mobility_missions (
  id uuid primary key default gen_random_uuid(),
  external_id text unique not null,
  asset_id uuid references public.mobility_assets(id) on delete restrict,
  mission_type text not null,
  origin text not null,
  destination text,
  locale text,
  accessible_assistance_requested boolean not null default false,
  status text not null default 'planned',
  safety_envelope jsonb not null default '{}'::jsonb,
  energy_plan jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mobility_mission_legs (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.mobility_missions(id) on delete cascade,
  sequence_no integer not null,
  mobility_class text not null,
  from_location text not null,
  to_location text not null,
  asset_id uuid references public.mobility_assets(id) on delete restrict,
  status text not null default 'planned',
  accessible_handoff_required boolean not null default false,
  created_at timestamptz not null default now(),
  unique(mission_id, sequence_no)
);

create table if not exists public.mobility_telemetry_events (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.mobility_assets(id) on delete cascade,
  mission_id uuid references public.mobility_missions(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now()
);

create table if not exists public.mobility_safety_events (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.mobility_assets(id) on delete set null,
  mission_id uuid references public.mobility_missions(id) on delete set null,
  severity text not null,
  reason_code text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.mobility_assets enable row level security;
alter table public.mobility_missions enable row level security;
alter table public.mobility_mission_legs enable row level security;
alter table public.mobility_telemetry_events enable row level security;
alter table public.mobility_safety_events enable row level security;

-- No permissive public policies. Production access must use least-privilege authenticated policies and server-side operations.
