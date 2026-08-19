import { AccessToken, LiveKitAPI } from 'livekit-server-sdk';

function required(name: 'LIVEKIT_URL'|'LIVEKIT_API_KEY'|'LIVEKIT_API_SECRET') {
  const value = process.env[name];
  if (!value) throw new Error(`${name}_MISSING`);
  return value;
}

export async function mintLiveKitToken(input: {
  roomName: string;
  identity: string;
  displayName?: string;
  canPublish: boolean;
  canSubscribe?: boolean;
}) {
  const apiKey = required('LIVEKIT_API_KEY');
  const apiSecret = required('LIVEKIT_API_SECRET');
  const at = new AccessToken(apiKey, apiSecret, {
    identity: input.identity,
    name: input.displayName ?? input.identity,
    ttl: '2h',
  });
  at.addGrant({
    roomJoin: true,
    room: input.roomName,
    canPublish: input.canPublish,
    canSubscribe: input.canSubscribe ?? true,
    canPublishData: true,
  });
  return {
    token: await at.toJwt(),
    url: required('LIVEKIT_URL'),
    roomName: input.roomName,
  };
}

export async function ensureLiveKitRoom(roomName: string, maxParticipants = 20) {
  const api = new LiveKitAPI({
    host: required('LIVEKIT_URL').replace(/^wss:/, 'https:'),
    apiKey: required('LIVEKIT_API_KEY'),
    secret: required('LIVEKIT_API_SECRET'),
  });
  try {
    const existing = await api.room.listRooms({ names: [roomName] });
    if (existing.length) return existing[0];
  } catch {
    // create below; LiveKit also creates rooms lazily on first join.
  }
  return api.room.createRoom({ name: roomName, emptyTimeout: 300, maxParticipants });
}
