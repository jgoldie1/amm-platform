create table if not exists public.creator_live_presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Creator',
  avatar_url text,
  country_code text,
  language_code text not null default 'en',
  is_online boolean not null default false,
  is_live boolean not null default false,
  accepts_pk boolean not null default false,
  mode text not null default 'creator',
  live_session_id uuid references public.live_stream_sessions(id) on delete set null,
  headline text,
  viewer_count integer not null default 0 check (viewer_count >= 0),
  last_seen_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.creator_live_presence enable row level security;
create policy creator_presence_public_read on public.creator_live_presence for select to anon, authenticated using (is_online = true or is_live = true or (select auth.uid()) = user_id);
create policy creator_presence_owner_insert on public.creator_live_presence for insert to authenticated with check ((select auth.uid()) = user_id);
create policy creator_presence_owner_update on public.creator_live_presence for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy creator_presence_owner_delete on public.creator_live_presence for delete to authenticated using ((select auth.uid()) = user_id);
create index if not exists creator_live_presence_discovery_idx on public.creator_live_presence (is_live desc, is_online desc, viewer_count desc, last_seen_at desc);
do $$ begin
  alter publication supabase_realtime add table public.creator_live_presence;
exception when duplicate_object then null;
end $$;
