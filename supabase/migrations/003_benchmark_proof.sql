create table if not exists public.benchmark_proof_runs (
  id uuid primary key default gen_random_uuid(),
  run_name text not null,
  baseline_summary jsonb not null,
  optimized_summary jsonb not null,
  delta_summary jsonb not null,
  baseline_samples jsonb not null,
  optimized_samples jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists benchmark_proof_runs_created_idx
  on public.benchmark_proof_runs(created_at desc);

alter table public.benchmark_proof_runs enable row level security;

-- Intentionally no public policies. Benchmark evidence should be written
-- through authenticated/server-controlled paths and reviewed before publication.
