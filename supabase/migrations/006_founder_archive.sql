create table if not exists public.founder_archive_records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  source text not null,
  kind text not null,
  title text not null,
  summary text not null,
  source_ref text,
  checksum text,
  original_created_at timestamptz,
  captured_at timestamptz not null default now(),
  searchable boolean not null default true,
  tags text[] not null default '{}',
  legacy_design_ids text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.founder_archive_chunks (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.founder_archive_records(id) on delete cascade,
  owner_id uuid not null,
  chunk_index integer not null,
  content text not null,
  content_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(record_id, chunk_index)
);

alter table public.founder_archive_records enable row level security;
alter table public.founder_archive_chunks enable row level security;

create policy founder_archive_owner_select on public.founder_archive_records
for select using (auth.uid() = owner_id);
create policy founder_archive_owner_insert on public.founder_archive_records
for insert with check (auth.uid() = owner_id);
create policy founder_archive_owner_update on public.founder_archive_records
for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy founder_archive_owner_delete on public.founder_archive_records
for delete using (auth.uid() = owner_id);

create policy founder_archive_chunk_owner_select on public.founder_archive_chunks
for select using (auth.uid() = owner_id);
create policy founder_archive_chunk_owner_insert on public.founder_archive_chunks
for insert with check (auth.uid() = owner_id);
create policy founder_archive_chunk_owner_update on public.founder_archive_chunks
for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy founder_archive_chunk_owner_delete on public.founder_archive_chunks
for delete using (auth.uid() = owner_id);

create index if not exists founder_archive_records_owner_idx on public.founder_archive_records(owner_id, captured_at desc);
create index if not exists founder_archive_records_tags_idx on public.founder_archive_records using gin(tags);
create index if not exists founder_archive_chunks_record_idx on public.founder_archive_chunks(record_id, chunk_index);
