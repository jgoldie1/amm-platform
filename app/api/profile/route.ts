import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const rows = await userRest(token, `users?select=id,name,email,avatar_url,subscription_tier,subscription_active,amm_tokens,is_creator&id=eq.${encodeURIComponent(user.id)}&limit=1`);
  return NextResponse.json({ profile: Array.isArray(rows) ? rows[0] ?? null : rows });
}

export async function PATCH(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const body = await request.json();
  const patch: Record<string, unknown> = {};
  if (typeof body.name === 'string') patch.name = body.name.trim().slice(0, 100);
  if (typeof body.avatarUrl === 'string') patch.avatar_url = body.avatarUrl.trim().slice(0, 1000);
  if (typeof body.isCreator === 'boolean') patch.is_creator = body.isCreator;
  if (!Object.keys(patch).length) return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 });
  const rows = await userRest(token, `users?id=eq.${encodeURIComponent(user.id)}`, { method: 'PATCH', prefer: 'return=representation', body: patch });
  return NextResponse.json({ profile: Array.isArray(rows) ? rows[0] ?? null : rows });
}
