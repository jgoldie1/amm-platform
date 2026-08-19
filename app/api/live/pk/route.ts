import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const room = searchParams.get('room');
  if (!room) return NextResponse.json({ error: 'missing_room' }, { status: 400 });
  const rows = await userRest(token, `live_pk_battles?select=*&room_name=eq.${encodeURIComponent(room)}&order=created_at.desc&limit=20`);
  return NextResponse.json({ battles: rows });
}

export async function POST(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const body = await request.json();
  const roomName = String(body.roomName ?? '').trim();
  const opponentId = String(body.opponentId ?? '').trim();
  if (!roomName || !opponentId) return NextResponse.json({ error: 'missing_room_or_opponent' }, { status: 400 });
  if (opponentId === user.id) return NextResponse.json({ error: 'cannot_pk_self' }, { status: 400 });
  const rows = await userRest(token, 'live_pk_battles', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      room_name: roomName,
      challenger_id: user.id,
      opponent_id: opponentId,
      status: 'pending',
      challenger_score: 0,
      opponent_score: 0,
    },
  });
  return NextResponse.json({ battle: Array.isArray(rows) ? rows[0] : rows }, { status: 201 });
}

export async function PATCH(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const body = await request.json();
  const id = String(body.id ?? '').trim();
  const action = String(body.action ?? '').trim();
  if (!id || !['accept','decline','end'].includes(action)) return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
  const existing = await userRest(token, `live_pk_battles?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
  const battle = Array.isArray(existing) ? existing[0] : null;
  if (!battle) return NextResponse.json({ error: 'battle_not_found' }, { status: 404 });
  if (![battle.challenger_id, battle.opponent_id].includes(user.id)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if ((action === 'accept' || action === 'decline') && battle.opponent_id !== user.id) return NextResponse.json({ error: 'only_opponent_may_respond' }, { status: 403 });
  const patch = action === 'accept' ? { status: 'live', started_at: new Date().toISOString() } : action === 'decline' ? { status: 'declined', ended_at: new Date().toISOString() } : { status: 'ended', ended_at: new Date().toISOString() };
  const rows = await userRest(token, `live_pk_battles?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', prefer: 'return=representation', body: patch });
  return NextResponse.json({ battle: Array.isArray(rows) ? rows[0] : rows });
}
