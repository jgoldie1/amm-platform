import { NextResponse } from 'next/server';
import { bearerToken, verifySupabaseUser } from '@/lib/supabase/user-rest';
import { selectRows } from '@/lib/supabase/server-rest';
import { ensureLiveKitRoom, mintLiveKitToken } from '@/lib/livekit/server';

const validModes = new Set(['music','news','debate','faith','shopping','game','tv','starverse','showcase','talent','karaoke','mic','general']);

type RoomMember = { room_name: string; user_id: string; member_role: string };

export async function POST(request: Request) {
  const accessToken = bearerToken(request);
  if (!accessToken) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(accessToken);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const roomName = String(body.roomName ?? '').trim();
  const requestedRole = body.role === 'host' ? 'host' : 'viewer';
  const mode = validModes.has(body.mode) ? body.mode : 'general';
  if (!/^live_[a-f0-9-]{36}$/i.test(roomName)) {
    return NextResponse.json({ error: 'invalid_room_name' }, { status: 400 });
  }

  const members = await selectRows<RoomMember>(
    'stream_room_members',
    `select=room_name,user_id,member_role&room_name=eq.${encodeURIComponent(roomName)}`,
  );
  const host = members.find((member) => member.member_role === 'host');
  if (!host) return NextResponse.json({ error: 'room_not_registered' }, { status: 404 });

  if (requestedRole === 'host' && host.user_id !== user.id) {
    return NextResponse.json({ error: 'host_permission_denied' }, { status: 403 });
  }

  const participantLimit = mode === 'debate' || mode === 'showcase' || mode === 'talent' || mode === 'karaoke' ? 20 : 12;
  if (requestedRole === 'host') await ensureLiveKitRoom(roomName, participantLimit);
  const grant = await mintLiveKitToken({
    roomName,
    identity: user.id,
    displayName: user.email ?? user.id,
    canPublish: requestedRole === 'host',
    canSubscribe: true,
  });

  return NextResponse.json({ ...grant, role: requestedRole, mode });
}
