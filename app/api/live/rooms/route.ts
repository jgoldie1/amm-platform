import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { bearerToken, verifySupabaseUser } from '@/lib/supabase/user-rest';
import { insertRow } from '@/lib/supabase/server-rest';

const validModes = new Set(['music','news','debate','faith','shopping','game','tv','starverse','general']);

export async function POST(request: Request) {
  const accessToken = bearerToken(request);
  if (!accessToken) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(accessToken);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const mode = validModes.has(body.mode) ? body.mode : 'general';
  const roomName = `live_${randomUUID()}`;

  await insertRow('stream_room_members', {
    room_name: roomName,
    user_id: user.id,
    member_role: 'host',
  });

  return NextResponse.json({ roomName, role: 'host', mode }, { status: 201 });
}
