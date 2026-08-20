import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const [wallets, transactions] = await Promise.all([
    userRest(token, `wallets?select=*&user_id=eq.${encodeURIComponent(user.id)}`),
    userRest(token, `wallet_transactions?select=*&user_id=eq.${encodeURIComponent(user.id)}&order=created_at.desc&limit=200`),
  ]);
  return NextResponse.json({ wallets, transactions });
}
