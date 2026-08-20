import { NextResponse } from 'next/server';
import { EncodedFileOutput, LiveKitAPI, S3Upload } from 'livekit-server-sdk';
import { bearerToken, verifySupabaseUser } from '@/lib/supabase/user-rest';
import { selectRows } from '@/lib/supabase/server-rest';

type RoomMember = { room_name: string; user_id: string; member_role: string };

function liveKitApi() {
  const host = process.env.LIVEKIT_URL?.replace(/^wss:/, 'https:');
  const apiKey = process.env.LIVEKIT_API_KEY;
  const secret = process.env.LIVEKIT_API_SECRET;
  if (!host || !apiKey || !secret) throw new Error('LIVEKIT_RECORDING_NOT_CONFIGURED');
  return new LiveKitAPI({ host, apiKey, secret });
}

function recordingOutput(roomName: string) {
  const accessKey = process.env.LIVEKIT_RECORDING_S3_ACCESS_KEY;
  const secret = process.env.LIVEKIT_RECORDING_S3_SECRET;
  const bucket = process.env.LIVEKIT_RECORDING_S3_BUCKET;
  const region = process.env.LIVEKIT_RECORDING_S3_REGION ?? 'auto';
  const endpoint = process.env.LIVEKIT_RECORDING_S3_ENDPOINT;
  if (!accessKey || !secret || !bucket) throw new Error('RECORDING_STORAGE_NOT_CONFIGURED');
  return new EncodedFileOutput({
    filepath: `tryamm-live/${roomName}/{time}.mp4`,
    output: { case: 's3', value: new S3Upload({ accessKey, secret, bucket, region, endpoint: endpoint || undefined, forcePathStyle: Boolean(endpoint) }) },
  });
}

async function authorize(request: Request, roomName: string, requireHost = false) {
  const accessToken = bearerToken(request);
  if (!accessToken) return { error: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  const user = await verifySupabaseUser(accessToken);
  if (!user) return { error: NextResponse.json({ error: 'invalid_session' }, { status: 401 }) };
  if (!/^live_[a-f0-9-]{36}$/i.test(roomName)) return { error: NextResponse.json({ error: 'invalid_room_name' }, { status: 400 }) };
  const members = await selectRows<RoomMember>('stream_room_members', `select=room_name,user_id,member_role&room_name=eq.${encodeURIComponent(roomName)}`);
  const host = members.find(member => member.member_role === 'host');
  if (!host) return { error: NextResponse.json({ error: 'room_not_found' }, { status: 404 }) };
  if (requireHost && host.user_id !== user.id) return { error: NextResponse.json({ error: 'host_permission_denied' }, { status: 403 }) };
  return { user, host };
}

function jsonTime(value: unknown) {
  if (value === null || value === undefined) return null;
  return typeof value === 'bigint' ? value.toString() : String(value);
}

export async function GET(request: Request) {
  const roomName = new URL(request.url).searchParams.get('room') ?? '';
  const auth = await authorize(request, roomName, false);
  if ('error' in auth) return auth.error;
  try {
    const items = await liveKitApi().egress.listEgress({ roomName });
    const recordings = items.map(item => ({ egressId: item.egressId, status: Number(item.status), startedAt: jsonTime(item.startedAt), endedAt: jsonTime(item.endedAt) }));
    return NextResponse.json({ roomName, recordings, recording: recordings.some(item => !item.endedAt) });
  } catch {
    return NextResponse.json({ roomName, recordings: [], recording: false, configured: false });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const roomName = String(body.roomName ?? '');
  const auth = await authorize(request, roomName, true);
  if ('error' in auth) return auth.error;
  if (body.consent !== true) return NextResponse.json({ error: 'recording_consent_required' }, { status: 400 });
  try {
    const info = await liveKitApi().egress.startRoomCompositeEgress(roomName, { file: recordingOutput(roomName) }, { layout: 'grid' });
    return NextResponse.json({ recording: true, egressId: info.egressId, status: Number(info.status) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'recording_unavailable';
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => ({}));
  const roomName = String(body.roomName ?? '');
  const egressId = String(body.egressId ?? '');
  const auth = await authorize(request, roomName, true);
  if ('error' in auth) return auth.error;
  if (!egressId) return NextResponse.json({ error: 'missing_egress_id' }, { status: 400 });
  try {
    const info = await liveKitApi().egress.stopEgress(egressId);
    return NextResponse.json({ recording: false, egressId: info.egressId, status: Number(info.status) });
  } catch {
    return NextResponse.json({ error: 'recording_stop_failed' }, { status: 503 });
  }
}
