-- Release-critical private creator media + transactional holographic gifts.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('creator-media-private','creator-media-private',false,1073741824,array['video/mp4','video/webm','audio/mpeg','audio/mp4','audio/wav','image/jpeg','image/png','image/webp','application/octet-stream'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists creator_media_own_read on storage.objects;
create policy creator_media_own_read on storage.objects for select to authenticated
using (bucket_id='creator-media-private' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists creator_media_own_insert on storage.objects;
create policy creator_media_own_insert on storage.objects for insert to authenticated
with check (bucket_id='creator-media-private' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists creator_media_own_update on storage.objects;
create policy creator_media_own_update on storage.objects for update to authenticated
using (bucket_id='creator-media-private' and (storage.foldername(name))[1]=(select auth.uid())::text)
with check (bucket_id='creator-media-private' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists creator_media_own_delete on storage.objects;
create policy creator_media_own_delete on storage.objects for delete to authenticated
using (bucket_id='creator-media-private' and (storage.foldername(name))[1]=(select auth.uid())::text);

create table if not exists public.holo_gift_catalog (
  gift_type text primary key,
  display_name text not null,
  token_amount integer not null check (token_amount>0),
  usd_value numeric(12,2) not null default 0 check (usd_value>=0),
  animation_key text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.holo_gift_catalog enable row level security;
drop policy if exists holo_gift_catalog_read on public.holo_gift_catalog;
create policy holo_gift_catalog_read on public.holo_gift_catalog for select to anon,authenticated using (active=true);
insert into public.holo_gift_catalog(gift_type,display_name,token_amount,usd_value,animation_key)
values ('heart','Holo Heart',10,0.10,'gift/heart-holo-v2'),('star','Holo Star',50,0.50,'gift/star-holo-v2'),('judah-crown','Judah Crown',250,2.50,'gift/judah-crown-holo-v2')
on conflict (gift_type) do update set display_name=excluded.display_name,token_amount=excluded.token_amount,usd_value=excluded.usd_value,animation_key=excluded.animation_key,active=true;

-- Client inserts are forbidden; all value movement goes through the transaction function below.
drop policy if exists gifts_sender_insert on public.gifts;

create or replace function public.send_holo_gift(p_receiver_id uuid,p_gift_type text,p_session_id text default null)
returns uuid
language plpgsql
security definer
set search_path=public
as $$
declare
  v_sender uuid := auth.uid();
  v_catalog public.holo_gift_catalog%rowtype;
  v_sender_wallet public.wallets%rowtype;
  v_receiver_wallet public.wallets%rowtype;
  v_gift_id uuid := gen_random_uuid();
  v_ref text := 'gift:'||v_gift_id::text;
begin
  if v_sender is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_receiver_id is null or p_receiver_id=v_sender then raise exception 'INVALID_RECEIVER'; end if;
  select * into v_catalog from public.holo_gift_catalog where gift_type=p_gift_type and active=true;
  if not found then raise exception 'GIFT_NOT_AVAILABLE'; end if;

  select * into v_sender_wallet from public.wallets
   where user_id=v_sender::text and upper(currency) in ('COIN','COINS','TOKEN','TOKENS')
   order by case upper(currency) when 'COIN' then 0 when 'COINS' then 1 else 2 end
   limit 1 for update;
  if not found then raise exception 'SENDER_COIN_WALLET_NOT_FOUND'; end if;
  if v_sender_wallet.available_minor < v_catalog.token_amount then raise exception 'INSUFFICIENT_BALANCE'; end if;

  select * into v_receiver_wallet from public.wallets
   where user_id=p_receiver_id::text and currency=v_sender_wallet.currency
   limit 1 for update;
  if not found then
    insert into public.wallets(id,user_id,currency,available_minor,pending_minor,reserve_minor,lifetime_earned_minor)
    values(gen_random_uuid()::text,p_receiver_id::text,v_sender_wallet.currency,0,0,0,0)
    returning * into v_receiver_wallet;
  end if;

  update public.wallets set available_minor=available_minor-v_catalog.token_amount,updated_at=now() where id=v_sender_wallet.id;
  update public.wallets set available_minor=available_minor+v_catalog.token_amount,lifetime_earned_minor=lifetime_earned_minor+v_catalog.token_amount,updated_at=now() where id=v_receiver_wallet.id;

  insert into public.wallet_transactions(id,wallet_id,user_id,currency,amount_minor,kind,reference,status,metadata)
  values(gen_random_uuid()::text,v_sender_wallet.id,v_sender::text,v_sender_wallet.currency,-v_catalog.token_amount,'gift_sent',v_ref,'posted',jsonb_build_object('gift_type',p_gift_type,'receiver_id',p_receiver_id,'session_id',p_session_id));
  insert into public.wallet_transactions(id,wallet_id,user_id,currency,amount_minor,kind,reference,status,metadata)
  values(gen_random_uuid()::text,v_receiver_wallet.id,p_receiver_id::text,v_receiver_wallet.currency,v_catalog.token_amount,'gift_received',v_ref,'posted',jsonb_build_object('gift_type',p_gift_type,'sender_id',v_sender,'session_id',p_session_id));

  insert into public.gifts(id,sender_id,receiver_id,gift_type,token_amount,usd_value,session_id)
  values(v_gift_id,v_sender,p_receiver_id,p_gift_type,v_catalog.token_amount,v_catalog.usd_value,p_session_id);
  return v_gift_id;
end;
$$;
revoke all on function public.send_holo_gift(uuid,text,text) from public;
grant execute on function public.send_holo_gift(uuid,text,text) to authenticated;

create index if not exists gifts_sender_created_idx on public.gifts(sender_id,created_at desc);
create index if not exists gifts_receiver_created_idx on public.gifts(receiver_id,created_at desc);
create index if not exists live_chat_room_created_idx on public.live_chat_messages(room_name,created_at);
create index if not exists live_pk_room_created_idx on public.live_pk_battles(room_name,created_at desc);
create index if not exists creator_presence_live_session_idx on public.creator_live_presence(live_session_id);
create index if not exists media_jobs_recording_idx on public.media_processing_jobs(recording_id);
