import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!(await verifySupabaseUser(token))) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const events = await userRest(token, 'wallet_events?select=*&order=created_at.desc&limit=200');
  return NextResponse.json({ events });
}
