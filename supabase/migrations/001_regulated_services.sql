create extension if not exists pgcrypto;

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  display_name text not null,
  provider_type text not null,
  verification_status text not null default 'pending' check (verification_status in ('unverified','pending','verified','expired','suspended','rejected')),
  can_accept_transactions boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.provider_credentials (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  vertical text not null,
  jurisdiction text not null,
  credential_type text not null,
  license_number text,
  issuing_authority text,
  verification_status text not null default 'pending' check (verification_status in ('unverified','pending','verified','expired','suspended','rejected')),
  verified_at timestamptz,
  expires_at timestamptz,
  verification_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider_id, vertical, jurisdiction, credential_type, license_number)
);

create table if not exists public.fee_rules (
  id uuid primary key default gen_random_uuid(),
  vertical text not null,
  jurisdiction text not null,
  fee_type text not null,
  rule_code text not null,
  status text not null default 'manual_review' check (status in ('allowed','blocked','manual_review')),
  notes text,
  effective_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique(vertical, jurisdiction, fee_type, rule_code, effective_at)
);

create table if not exists public.compliance_checks (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references public.providers(id) on delete set null,
  vertical text not null,
  jurisdiction text not null,
  fee_type text not null,
  amount_cents bigint not null check (amount_cents >= 0),
  decision text not null check (decision in ('approved','blocked','manual_review')),
  decision_code text not null,
  reasons jsonb not null default '[]'::jsonb,
  required_actions jsonb not null default '[]'::jsonb,
  request_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  provider_id uuid references public.providers(id) on delete set null,
  consent_type text not null,
  disclosure_version text not null,
  consented_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.regulated_transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid,
  provider_id uuid references public.providers(id) on delete restrict,
  compliance_check_id uuid not null references public.compliance_checks(id) on delete restrict,
  vertical text not null,
  jurisdiction text not null,
  currency text not null default 'usd',
  provider_service_amount_cents bigint not null default 0 check (provider_service_amount_cents >= 0),
  tryamm_platform_fee_cents bigint not null default 0 check (tryamm_platform_fee_cents >= 0),
  booking_fee_cents bigint not null default 0 check (booking_fee_cents >= 0),
  processor_fee_cents bigint not null default 0 check (processor_fee_cents >= 0),
  tax_cents bigint not null default 0 check (tax_cents >= 0),
  refund_reserve_cents bigint not null default 0 check (refund_reserve_cents >= 0),
  provider_payable_cents bigint not null default 0 check (provider_payable_cents >= 0),
  status text not null default 'pending' check (status in ('pending','authorized','paid','held','refunded','reversed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.regulated_transactions(id) on delete restrict,
  account_code text not null,
  entry_type text not null check (entry_type in ('debit','credit')),
  amount_cents bigint not null check (amount_cents >= 0),
  currency text not null default 'usd',
  memo text,
  created_at timestamptz not null default now()
);

create table if not exists public.payout_holds (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete restrict,
  transaction_id uuid references public.regulated_transactions(id) on delete restrict,
  reason_code text not null,
  status text not null default 'active' check (status in ('active','released','cancelled')),
  placed_at timestamptz not null default now(),
  released_at timestamptz,
  notes text
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_type text not null,
  event_type text not null,
  resource_type text not null,
  resource_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists provider_credentials_lookup_idx
  on public.provider_credentials(provider_id, vertical, jurisdiction, verification_status);
create index if not exists compliance_checks_provider_idx
  on public.compliance_checks(provider_id, created_at desc);
create index if not exists regulated_transactions_provider_idx
  on public.regulated_transactions(provider_id, created_at desc);
create index if not exists audit_events_resource_idx
  on public.audit_events(resource_type, resource_id, created_at desc);

alter table public.providers enable row level security;
alter table public.provider_credentials enable row level security;
alter table public.fee_rules enable row level security;
alter table public.compliance_checks enable row level security;
alter table public.customer_consents enable row level security;
alter table public.regulated_transactions enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.payout_holds enable row level security;
alter table public.audit_events enable row level security;

-- Intentionally no permissive public policies are created here.
-- Production access must use authenticated, least-privilege policies and server-side service-role operations.
