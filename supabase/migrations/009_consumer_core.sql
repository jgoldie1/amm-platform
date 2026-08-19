create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique,
  display_name text,
  bio text,
  avatar_url text,
  roles text[] not null default array['customer']::text[],
  locale text not null default 'en',
  accessibility jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('video','image','text','live_replay','game_clip','omni_box_clip','marketplace')),
  caption text,
  media_url text,
  thumbnail_url text,
  locale text not null default 'en',
  alt_text text,
  captions_url text,
  visibility text not null default 'public' check (visibility in ('public','followers','private')),
  created_at timestamptz not null default now()
);

create table if not exists public.post_reactions (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction text not null default 'like',
  created_at timestamptz not null default now(),
  primary key (post_id,user_id,reaction)
);

create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id,following_id),
  check (follower_id <> following_id)
);

create table if not exists public.live_rooms (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  livekit_room text unique,
  status text not null default 'scheduled' check (status in ('scheduled','live','ended','blocked')),
  room_type text not null default 'solo' check (room_type in ('solo','panel','pk','game','omni_box')),
  captions_enabled boolean not null default true,
  translation_enabled boolean not null default true,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.pk_battles (
  id uuid primary key default gen_random_uuid(),
  live_room_id uuid not null references public.live_rooms(id) on delete cascade,
  challenger_id uuid not null references public.profiles(id),
  opponent_id uuid not null references public.profiles(id),
  challenger_score bigint not null default 0,
  opponent_score bigint not null default 0,
  status text not null default 'pending' check (status in ('pending','live','complete','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null check (item_type in ('product','service','media_unlock','forge_asset','game_asset','ticket')),
  title text not null,
  description text,
  price_cents bigint not null check (price_cents >= 0),
  currency text not null default 'usd',
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id),
  seller_id uuid not null references public.profiles(id),
  catalog_item_id uuid references public.catalog_items(id),
  status text not null default 'pending' check (status in ('pending','authorized','paid','fulfilled','refunded','cancelled','held')),
  subtotal_cents bigint not null default 0,
  platform_fee_cents bigint not null default 0,
  provider_amount_cents bigint not null default 0,
  currency text not null default 'usd',
  regulated boolean not null default false,
  compliance_check_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.wallet_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (event_type in ('purchase','earning','gift_sent','gift_received','payout','refund','media_unlock','hold','release')),
  amount_cents bigint not null,
  currency text not null default 'usd',
  reference_type text,
  reference_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_reactions enable row level security;
alter table public.follows enable row level security;
alter table public.live_rooms enable row level security;
alter table public.pk_battles enable row level security;
alter table public.catalog_items enable row level security;
alter table public.orders enable row level security;
alter table public.notifications enable row level security;
alter table public.wallet_events enable row level security;

create policy "profiles public read" on public.profiles for select using (true);
create policy "profiles owner update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "posts public read" on public.posts for select using (visibility = 'public' or creator_id = auth.uid());
create policy "posts owner write" on public.posts for all using (creator_id = auth.uid()) with check (creator_id = auth.uid());
create policy "reactions public read" on public.post_reactions for select using (true);
create policy "reactions owner write" on public.post_reactions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "follows public read" on public.follows for select using (true);
create policy "follows owner write" on public.follows for all using (follower_id = auth.uid()) with check (follower_id = auth.uid());
create policy "live public read" on public.live_rooms for select using (status in ('scheduled','live','ended') or host_id = auth.uid());
create policy "live host write" on public.live_rooms for all using (host_id = auth.uid()) with check (host_id = auth.uid());
create policy "pk public read" on public.pk_battles for select using (true);
create policy "catalog public read" on public.catalog_items for select using (active or seller_id = auth.uid());
create policy "catalog owner write" on public.catalog_items for all using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "orders participant read" on public.orders for select using (buyer_id = auth.uid() or seller_id = auth.uid());
create policy "orders buyer create" on public.orders for insert with check (buyer_id = auth.uid());
create policy "notifications owner" on public.notifications for select using (user_id = auth.uid());
create policy "notifications owner update" on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "wallet owner read" on public.wallet_events for select using (user_id = auth.uid());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1))) on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
