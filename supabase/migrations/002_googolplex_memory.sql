create table if not exists public.googolplex_memory (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid,
  namespace text not null,
  kind text not null,
  summary text not null,
  importance numeric(4,3) not null default 0.500 check (importance >= 0 and importance <= 1),
  source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists googolplex_memory_namespace_idx
  on public.googolplex_memory(namespace, importance desc, created_at desc);

create index if not exists googolplex_memory_owner_idx
  on public.googolplex_memory(owner_id, created_at desc);

alter table public.googolplex_memory enable row level security;

-- No public policies by default. Reads and writes must be authorized by
-- application identity/RLS or server-side service-role operations.
