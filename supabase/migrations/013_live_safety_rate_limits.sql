-- LIVE safety, creator blocks/reports, and distributed rate limiting.
create table if not exists public.creator_blocks (
  blocker_id uuid not null,
  blocked_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
alter table public.creator_blocks enable row level security;
drop policy if exists creator_blocks_own_read on public.creator_blocks;
create policy creator_blocks_own_read on public.creator_blocks for select to authenticated using (blocker_id=(select auth.uid()));
drop policy if exists creator_blocks_own_write on public.creator_blocks;
create policy creator_blocks_own_write on public.creator_blocks for insert to authenticated with check (blocker_id=(select auth.uid()));
drop policy if exists creator_blocks_own_delete on public.creator_blocks;
create policy creator_blocks_own_delete on public.creator_blocks for delete to authenticated using (blocker_id=(select auth.uid()));

create table if not exists public.creator_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null,
  reported_user_id uuid not null,
  room_name text,
  category text not null check (category in ('spam','harassment','hate','sexual','violence','fraud','impersonation','copyright','other')),
  details text,
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now(),
  check (reporter_id <> reported_user_id)
);
alter table public.creator_reports enable row level security;
drop policy if exists creator_reports_own_read on public.creator_reports;
create policy creator_reports_own_read on public.creator_reports for select to authenticated using (reporter_id=(select auth.uid()));
drop policy if exists creator_reports_own_insert on public.creator_reports;
create policy creator_reports_own_insert on public.creator_reports for insert to authenticated with check (reporter_id=(select auth.uid()));

create table if not exists public.live_rate_limits (
  user_id uuid not null,
  action text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  primary key (user_id, action, window_start)
);
alter table public.live_rate_limits enable row level security;
-- No browser policies: only SECURITY DEFINER function below may mutate/read counters.

create or replace function public.consume_live_rate_limit(p_action text,p_limit integer,p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path=public
as $$
declare
  v_user uuid := auth.uid();
  v_window timestamptz;
  v_count integer;
begin
  if v_user is null then return false; end if;
  if p_limit < 1 or p_window_seconds < 1 then return false; end if;
  v_window := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  insert into public.live_rate_limits(user_id,action,window_start,count)
  values(v_user,p_action,v_window,1)
  on conflict(user_id,action,window_start)
  do update set count=public.live_rate_limits.count+1
  returning count into v_count;
  return v_count <= p_limit;
end;
$$;
revoke all on function public.consume_live_rate_limit(text,integer,integer) from public;
grant execute on function public.consume_live_rate_limit(text,integer,integer) to authenticated;

create index if not exists creator_reports_reported_created_idx on public.creator_reports(reported_user_id,created_at desc);
create index if not exists creator_reports_status_created_idx on public.creator_reports(status,created_at desc);
