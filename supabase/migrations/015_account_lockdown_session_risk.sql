create table if not exists public.user_security_state (
  user_id uuid primary key,
  status text not null default 'normal' check(status in ('normal','step_up_required','locked')),
  reason text,
  risk_score integer not null default 0 check(risk_score between 0 and 100),
  locked_at timestamptz,
  locked_by uuid,
  updated_at timestamptz not null default now()
);
alter table public.user_security_state enable row level security;
revoke all on public.user_security_state from anon,authenticated;

create table if not exists public.security_session_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  event_type text not null check(event_type in ('signin','refresh','step_up','signout','risk_change')),
  device_hash text,
  network_hash text,
  country_code text,
  user_agent_hash text,
  risk_score integer not null default 0 check(risk_score between 0 and 100),
  reasons text[] not null default '{}',
  occurred_at timestamptz not null default now()
);
alter table public.security_session_events enable row level security;
revoke all on public.security_session_events from anon,authenticated;
create index if not exists security_session_user_time_idx on public.security_session_events(user_id,occurred_at desc);

create table if not exists public.security_rate_limits (
  key text primary key,
  window_started_at timestamptz not null,
  request_count integer not null default 0,
  blocked_until timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.security_rate_limits enable row level security;
revoke all on public.security_rate_limits from anon,authenticated;
