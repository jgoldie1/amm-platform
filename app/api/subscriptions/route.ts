import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });

  const subscriptions = await userRest(
    token,
    `subscriptions?select=id,tier,status,current_period_start,current_period_end,created_at&user_id=eq.${encodeURIComponent(user.id)}&order=created_at.desc&limit=20`,
  );
  return NextResponse.json({ subscriptions });
}
