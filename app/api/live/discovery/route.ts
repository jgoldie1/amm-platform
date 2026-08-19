import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';
import { selectRows } from '@/lib/supabase/server-rest';

function publicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

type Presence = {
  user_id: string;
  display_name: string;
  avatar_url?: string | null;
  country_code?: string | null;
  language_code?: string | null;
  is_online: boolean;
  is_live: boolean;
  accepts_pk: boolean;
  mode: string;
  headline?: string | null;
  viewer_count: number;
  last_seen_at?: string | null;
};
type HostRoom = { room_name: string; user_id: string; member_role: string; created_at?: string };

export async function GET(request: Request) {
  const config = publicConfig();
  if (!config) return NextResponse.json({ error: 'supabase_not_configured' }, { status: 503 });
  const url = new URL(request.url);
  const country = url.searchParams.get('country');
  const language = url.searchParams.get('language');
  const mode = url.searchParams.get('mode');
  const filters = [
    'select=user_id,display_name,avatar_url,country_code,language_code,is_online,is_live,accepts_pk,mode,headline,viewer_count,last_seen_at',
    'or=(is_live.eq.true,is_online.eq.true)',
    'order=is_live.desc,viewer_count.desc,last_seen_at.desc',
    'limit=100',
  ];
  if (country) filters.push(`country_code=eq.${encodeURIComponent(country)}`);
  if (language) filters.push(`language_code=eq.${encodeURIComponent(language)}`);
  if (mode) filters.push(`mode=eq.${encodeURIComponent(mode)}`);
  const response = await fetch(`${config.url}/rest/v1/creator_live_presence?${filters.join('&')}`, {
    headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
    cache: 'no-store',
  });
  if (!response.ok) return NextResponse.json({ error: 'presence_unavailable' }, { status: 503 });
  const creators = await response.json() as Presence[];

  let hostRooms: HostRoom[] = [];
  try {
    hostRooms = await selectRows<HostRoom>('stream_room_members', 'select=room_name,user_id,member_role,created_at&member_role=eq.host&order=created_at.desc&limit=500');
  } catch {
    // Discovery still works if private room registry is temporarily unavailable.
  }
  const roomByHost = new Map<string, string>();
  for (const room of hostRooms) if (!roomByHost.has(room.user_id)) roomByHost.set(room.user_id, room.room_name);
  return NextResponse.json({ creators: creators.map(creator => ({ ...creator, room_name: creator.is_live ? roomByHost.get(creator.user_id) ?? null : null })) });
}

export async function PATCH(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const body = await request.json();
  const allowedModes = new Set(['creator','live','pk','shopping','game','music','starverse','showcase','talent','karaoke','mic','vocal-box','movie','tv','news','debate','faith']);
  const mode = allowedModes.has(body.mode) ? body.mode : 'creator';
  const rows = await userRest(token, 'creator_live_presence?on_conflict=user_id', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: {
      user_id: user.id,
      display_name: body.displayName || user.email?.split('@')[0] || 'Creator',
      avatar_url: body.avatarUrl ?? null,
      country_code: body.countryCode ?? null,
      language_code: body.languageCode ?? 'en',
      is_online: body.isOnline !== false,
      is_live: body.isLive === true,
      accepts_pk: body.acceptsPk === true,
      mode,
      live_session_id: body.liveSessionId ?? null,
      headline: body.headline ?? null,
      last_seen_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });
  return NextResponse.json({ presence: Array.isArray(rows) ? rows[0] : rows });
}
