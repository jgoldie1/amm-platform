import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const rows = await userRest(token, `holo_notifications?select=*&user_id=eq.${encodeURIComponent(user.id)}&order=created_at.desc&limit=100`);
  return NextResponse.json({ notifications: rows });
}

export async function PATCH(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });
  const rows = await userRest(token, `holo_notifications?id=eq.${encodeURIComponent(body.id)}&user_id=eq.${encodeURIComponent(user.id)}`, {
    method: 'PATCH', prefer: 'return=representation', body: { read_at: body.read ? new Date().toISOString() : null }
  });
  return NextResponse.json({ notifications: rows });
}
