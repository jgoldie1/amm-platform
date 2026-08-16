import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

const Body = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('create'),
    worldSlug: z.string().min(2).max(64).default('planetary-omniverse'),
    displayName: z.string().min(1).max(40)
  }),
  z.object({
    action: z.literal('join'),
    joinCode: z.string().min(4).max(12),
    displayName: z.string().min(1).max(40)
  })
]);

const makeCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const db = supabaseAdmin();

  if (parsed.data.action === 'create') {
    const { data: world, error: worldError } = await db
      .from('worlds')
      .select('id')
      .eq('slug', parsed.data.worldSlug)
      .single();

    if (worldError || !world) {
      return NextResponse.json({ error: 'World not found' }, { status: 404 });
    }

    const { data: instance, error: instanceError } = await db
      .from('world_instances')
      .insert({
        world_id: world.id,
        owner_id: user.id,
        join_code: makeCode(),
        status: 'active'
      })
      .select('id,join_code,world_id,max_players')
      .single();

    if (instanceError || !instance) {
      return NextResponse.json({ error: instanceError?.message ?? 'Could not create room' }, { status: 500 });
    }

    const { error: memberError } = await db.from('world_members').insert({
      instance_id: instance.id,
      user_id: user.id,
      display_name: parsed.data.displayName,
      role: 'owner'
    });

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    return NextResponse.json(instance, { status: 201 });
  }

  const code = parsed.data.joinCode.toUpperCase();
  const { data: instance, error: instanceError } = await db
    .from('world_instances')
    .select('id,join_code,world_id,max_players,status')
    .eq('join_code', code)
    .eq('status', 'active')
    .single();

  if (instanceError || !instance) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  const { count } = await db
    .from('world_members')
    .select('*', { count: 'exact', head: true })
    .eq('instance_id', instance.id);

  if ((count ?? 0) >= instance.max_players) {
    return NextResponse.json({ error: 'Room full' }, { status: 409 });
  }

  const { error: memberError } = await db.from('world_members').upsert({
    instance_id: instance.id,
    user_id: user.id,
    display_name: parsed.data.displayName,
    last_seen_at: new Date().toISOString()
  }, { onConflict: 'instance_id,user_id' });

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json(instance);
}
