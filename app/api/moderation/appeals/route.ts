import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });

  const appeals = await userRest(
    token,
    `moderation_appeals?select=id,report_id,statement,evidence,status,created_at,resolved_at&appellant_user_id=eq.${encodeURIComponent(user.id)}&order=created_at.desc&limit=100`,
  );
  return NextResponse.json({ appeals });
}

export async function POST(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const body = await request.json();
  if (!body.reportId || typeof body.statement !== 'string' || body.statement.trim().length < 3) {
    return NextResponse.json({ error: 'invalid_appeal' }, { status: 400 });
  }

  const appeals = await userRest(token, 'moderation_appeals', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      report_id: body.reportId,
      appellant_user_id: user.id,
      statement: body.statement.trim(),
      evidence: body.evidence && typeof body.evidence === 'object' ? body.evidence : {},
      status: 'pending',
    },
  });
  return NextResponse.json({ appeals }, { status: 201 });
}
