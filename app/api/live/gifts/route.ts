import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';
import { requireCapability, requireUserSecurity } from '@/lib/security/control-plane';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const gifts = await userRest(token, 'holo_gift_catalog?select=gift_type,display_name,token_amount,usd_value,animation_key&active=eq.true&order=token_amount.asc');
  return NextResponse.json({ gifts });
}

export async function POST(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });

  try { await requireCapability('gifts'); await requireUserSecurity(user.id,{stepUpAction:'gift'}); }
  catch(error) { const code=error instanceof Error?error.message:'security_freeze'; return NextResponse.json({ error: code, message: 'Gift transaction is blocked until the security requirement is cleared.' }, { status: 423 }); }

  const body = await request.json().catch(() => ({}));
  const receiverId = String(body.receiverId ?? '').trim();
  const giftType = String(body.giftType ?? '').trim();
  const sessionId = body.sessionId ? String(body.sessionId).slice(0, 160) : null;
  if (!/^[0-9a-f-]{36}$/i.test(receiverId) || !/^[a-z0-9-]{2,64}$/i.test(giftType)) {
    return NextResponse.json({ error: 'invalid_gift_request' }, { status: 400 });
  }

  try {
    const result = await userRest<string | string[]>(token, 'rpc/send_holo_gift', {
      method: 'POST',
      body: { p_receiver_id: receiverId, p_gift_type: giftType, p_session_id: sessionId },
    });
    const giftId = Array.isArray(result) ? result[0] : result;
    return NextResponse.json({ giftId }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'gift_transaction_failed' }, { status: 409 });
  }
}
