import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!(await verifySupabaseUser(token))) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const items = await userRest(token, 'catalog_items?select=*&active=eq.true&order=created_at.desc&limit=100');
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const body = await request.json();
  const itemTypes = new Set(['product','service','media_unlock','forge_asset','game_asset','ticket']);
  if (!itemTypes.has(body.itemType) || !body.title || !Number.isInteger(body.priceCents) || body.priceCents < 0) {
    return NextResponse.json({ error: 'invalid_item' }, { status: 400 });
  }
  const items = await userRest(token, 'catalog_items', {
    method: 'POST', prefer: 'return=representation', body: {
      seller_id: user.id, item_type: body.itemType, title: body.title,
      description: body.description ?? null, price_cents: body.priceCents,
      currency: body.currency ?? 'usd', metadata: body.metadata ?? {}, active: true,
    }
  });
  return NextResponse.json({ items }, { status: 201 });
}
