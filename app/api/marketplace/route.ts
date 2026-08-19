import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!(await verifySupabaseUser(token))) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const items = await userRest(token, 'products?select=*&status=eq.active&order=created_at.desc&limit=100');
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const body = await request.json();
  if (!body.name || typeof body.price !== 'number' || body.price < 0) return NextResponse.json({ error: 'invalid_product' }, { status: 400 });
  const items = await userRest(token, 'products', {
    method: 'POST', prefer: 'return=representation', body: {
      creator_id: user.id,
      name: body.name,
      description: body.description ?? null,
      price: body.price,
      category: body.category ?? 'creator',
      inventory: Number.isInteger(body.inventory) ? body.inventory : 0,
      image_url: body.imageUrl ?? null,
      currency: body.currency ?? 'USD',
      status: 'active',
    },
  });
  return NextResponse.json({ items }, { status: 201 });
}
