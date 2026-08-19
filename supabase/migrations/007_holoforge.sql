create table if not exists public.forge_requests (
  id uuid primary key,
  owner_id uuid not null,
  asset_type text not null,
  destinations jsonb not null default '[]'::jsonb,
  prompt text not null,
  source_asset_ids jsonb not null default '[]'::jsonb,
  locale text,
  accessibility jsonb not null default '{}'::jsonb,
  commercial_use_intended boolean not null default false,
  manufacturing_use_intended boolean not null default false,
  status text not null default 'queued',
  reasons jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.forge_assets (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.forge_requests(id) on delete cascade,
  owner_id uuid not null,
  asset_type text not null,
  storage_path text,
  metadata jsonb not null default '{}'::jsonb,
  provenance jsonb not null default '{}'::jsonb,
  moderation_status text not null default 'pending',
  commercial_rights_status text not null default 'unverified',
  created_at timestamptz not null default now()
);

alter table public.forge_requests enable row level security;
alter table public.forge_assets enable row level security;

create policy "forge_requests_owner_only"
  on public.forge_requests for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "forge_assets_owner_only"
  on public.forge_assets for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
