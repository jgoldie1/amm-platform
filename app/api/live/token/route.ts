import { NextResponse } from 'next/server';
import { bearerToken, verifySupabaseUser } from '@/lib/supabase/user-rest';
import { ensureLiveKitRoom, mintLiveKitToken } from '@/lib/livekit/server';

const validModes = new Set(['music','news','debate','faith','shopping','game','tv','starverse','general']);

export async function POST(request: Request) {
  const accessToken = bearerToken(request);
  if (!accessToken) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(accessToken);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const roomName = String(body.roomName ?? '').trim();
  const role = body.role === 'viewer' ? 'viewer' : 'host';
  const mode = validModes.has(body.mode) ? body.mode : 'general';
  if (!/^[a-zA-Z0-9_-]{3,96}$/.test(roomName)) {
    return NextResponse.json({ error: 'invalid_room_name' }, { status: 400 });
  }

  if (role === 'host') await ensureLiveKitRoom(roomName, mode === 'debate' ? 20 : 12);
  const grant = await mintLiveKitToken({
    roomName,
    identity: user.id,
    displayName: user.email ?? user.id,
    canPublish: role === 'host',
    canSubscribe: true,
  });

  return NextResponse.json({ ...grant, role, mode });
}
