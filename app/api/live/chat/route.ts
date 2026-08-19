import { NextResponse } from 'next/server';
import { bearerToken, userRest, verifySupabaseUser } from '@/lib/supabase/user-rest';

export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const room = searchParams.get('room');
  if (!room) return NextResponse.json({ error: 'missing_room' }, { status: 400 });
  const messages = await userRest(token, `live_chat_messages?select=id,room_name,sender_id,message,language_code,translated_payload,moderation_status,created_at&room_name=eq.${encodeURIComponent(room)}&moderation_status=eq.visible&order=created_at.asc&limit=200`);
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({ error: 'invalid_session' }, { status: 401 });
  const body = await request.json();
  const roomName = String(body.roomName ?? '').trim();
  const message = String(body.message ?? '').trim();
  if (!roomName || !message) return NextResponse.json({ error: 'missing_room_or_message' }, { status: 400 });
  if (message.length > 1000) return NextResponse.json({ error: 'message_too_long' }, { status: 400 });
  const rows = await userRest(token, 'live_chat_messages', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      room_name: roomName,
      sender_id: user.id,
      message,
      language_code: String(body.languageCode ?? 'en').slice(0, 12),
      moderation_status: 'visible',
    },
  });
  return NextResponse.json({ message: Array.isArray(rows) ? rows[0] : rows }, { status: 201 });
}
