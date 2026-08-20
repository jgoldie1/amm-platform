import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!(await verifySupabaseUser(token))) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const posts = await userRest(token, 'feed_posts?select=*&order=created_at.desc&limit=50');
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const body = await request.json();
  const visibility = ['public','followers','private'].includes(body.visibility) ? body.visibility : 'public';
  if (!body.body && !body.mediaUrl) return NextResponse.json({ error: 'post_content_required' }, { status: 400 });
  const posts = await userRest(token, 'feed_posts', {
    method: 'POST', prefer: 'return=representation', body: {
      user_id: user.id,
      body: body.body ?? null,
      media_url: body.mediaUrl ?? null,
      media_type: body.mediaType ?? null,
      locale: body.locale ?? 'en',
      visibility,
    },
  });
  return NextResponse.json({ posts }, { status: 201 });
}
