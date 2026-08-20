import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { bearerToken, verifySupabaseUser } from '@/lib/supabase/user-rest';
import { deleteRows, insertRow, patchRows, selectRows } from '@/lib/supabase/server-rest';
import { closeLiveKitRoom } from '@/lib/livekit/server';

const validModes = new Set(['music','news','debate','faith','shopping','game','tv','starverse','showcase','talent','karaoke','mic','vocal-box','general']);
type RoomMember = { room_name: string; user_id: string; member_role: string };

export async function POST(request: Request) {
  const accessToken = bearerToken(request);
  if (!accessToken) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(accessToken);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const mode = validModes.has(body.mode) ? body.mode : 'general';
  const roomName = `live_${randomUUID()}`;

  await insertRow<RoomMember>('stream_room_members', { room_name: roomName, user_id: user.id, member_role: 'host' });

  try {
    const values = {
      is_online: true,
      is_live: true,
      accepts_pk: true,
      mode,
      headline: String(body.headline ?? '').slice(0, 180) || `${mode} LIVE`,
      updated_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
    };
    const existing = await selectRows<{ user_id: string }>('creator_live_presence', `select=user_id&user_id=eq.${user.id}&limit=1`);
    if (existing[0]) await patchRows('creator_live_presence', `user_id=eq.${user.id}`, values);
    else await insertRow('creator_live_presence', { user_id: user.id, display_name: user.email ?? 'Creator', viewer_count: 0, ...values });
  } catch {
    // Presence is discoverability state, not authorization. Fail soft.
  }

  return NextResponse.json({ roomName, role: 'host', mode }, { status: 201 });
}

export async function GET(request: Request) {
  const accessToken = bearerToken(request);
  if (!accessToken) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(accessToken);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const roomName = searchParams.get('room') ?? '';
  if (!/^live_[a-f0-9-]{36}$/i.test(roomName)) return NextResponse.json({ error: 'invalid_room_name' }, { status: 400 });

  const members = await selectRows<RoomMember>('stream_room_members', `select=room_name,user_id,member_role&room_name=eq.${encodeURIComponent(roomName)}`);
  const host = members.find(member => member.member_role === 'host');
  if (!host) return NextResponse.json({ error: 'room_not_found' }, { status: 404 });
  return NextResponse.json({ roomName, hostUserId: host.user_id, isHost: host.user_id === user.id });
}

export async function DELETE(request: Request) {
  const accessToken = bearerToken(request);
  if (!accessToken) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(accessToken);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const roomName = String(body.roomName ?? '');
  if (!/^live_[a-f0-9-]{36}$/i.test(roomName)) return NextResponse.json({ error: 'invalid_room_name' }, { status: 400 });

  const members = await selectRows<RoomMember>('stream_room_members', `select=room_name,user_id,member_role&room_name=eq.${encodeURIComponent(roomName)}`);
  const host = members.find(member => member.member_role === 'host');
  if (!host || host.user_id !== user.id) return NextResponse.json({ error: 'host_permission_denied' }, { status: 403 });

  // Close the media room first so connected clients are disconnected by LiveKit.
  await closeLiveKitRoom(roomName);

  // Remove TRYAMM authorization so old room links cannot mint fresh tokens.
  await deleteRows('stream_room_members', `room_name=eq.${encodeURIComponent(roomName)}`);

  await patchRows('creator_live_presence', `user_id=eq.${user.id}`, {
    is_live: false,
    accepts_pk: false,
    viewer_count: 0,
    last_seen_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  return NextResponse.json({ ended: true, roomName, authorizationRevoked: true });
}
