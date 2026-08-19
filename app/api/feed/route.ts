import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });

  const posts = await userRest(token, 'posts?select=*&order=created_at.desc&limit=50');
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const body = await request.json();

  const allowedKinds = new Set(['video','image','text','live_replay','game_clip','omni_box_clip','marketplace']);
  if (!allowedKinds.has(body.kind)) return NextResponse.json({ error: 'invalid_kind' }, { status: 400 });

  const rows = await userRest(token, 'posts', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      creator_id: user.id,
      kind: body.kind,
      caption: body.caption ?? null,
      media_url: body.mediaUrl ?? null,
      thumbnail_url: body.thumbnailUrl ?? null,
      locale: body.locale ?? 'en',
      alt_text: body.altText ?? null,
      captions_url: body.captionsUrl ?? null,
      visibility: body.visibility ?? 'public',
    },
  });
  return NextResponse.json({ posts: rows }, { status: 201 });
}
