import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { realityLabRooms, type RealityLabRoomId } from '@/lib/reality-lab';

const RoomIds = realityLabRooms.map(room => room.id) as [RealityLabRoomId, ...RealityLabRoomId[]];
const RoomIdSchema = z.enum(RoomIds);
const ProgressBody = z.object({
  currentRoom: RoomIdSchema,
  completed: z.array(RoomIdSchema).max(realityLabRooms.length),
  xp: z.number().int().min(0).max(1000000),
  accessibility: z.object({
    reducedMotion: z.boolean().default(false),
    oneHanded: z.boolean().default(false),
    highContrast: z.boolean().default(false)
  })
});

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = supabaseAdmin();
  const { data, error } = await db
    .from('reality_lab_progress')
    .select('current_room,completed_rooms,xp,accessibility,checkpoint_revision,updated_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ progress: null });

  return NextResponse.json({
    progress: {
      currentRoom: data.current_room,
      completed: data.completed_rooms ?? [],
      xp: data.xp ?? 0,
      accessibility: data.accessibility ?? {},
      checkpointRevision: data.checkpoint_revision,
      updatedAt: data.updated_at
    }
  });
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = ProgressBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const roomXp = new Map<RealityLabRoomId, number>(realityLabRooms.map(room => [room.id, room.xp]));
  const uniqueCompleted = [...new Set<RealityLabRoomId>(parsed.data.completed)];
  const maxEarnedXp = uniqueCompleted.reduce((total, roomId) => total + (roomXp.get(roomId) ?? 0), 0);

  if (parsed.data.xp > maxEarnedXp) {
    return NextResponse.json({ error: 'XP exceeds verified room completion maximum' }, { status: 409 });
  }

  const db = supabaseAdmin();
  const { data: existing } = await db
    .from('reality_lab_progress')
    .select('checkpoint_revision')
    .eq('user_id', user.id)
    .maybeSingle();

  const revision = (existing?.checkpoint_revision ?? 0) + 1;
  const { data, error } = await db
    .from('reality_lab_progress')
    .upsert({
      user_id: user.id,
      current_room: parsed.data.currentRoom,
      completed_rooms: uniqueCompleted,
      xp: parsed.data.xp,
      accessibility: parsed.data.accessibility,
      checkpoint_revision: revision,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    .select('checkpoint_revision,updated_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ saved: true, checkpointRevision: data.checkpoint_revision, updatedAt: data.updated_at });
}
