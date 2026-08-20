import { AccessToken, LiveKitAPI } from 'livekit-server-sdk';

function required(name: 'LIVEKIT_URL'|'LIVEKIT_API_KEY'|'LIVEKIT_API_SECRET') {
  const value = process.env[name];
  if (!value) throw new Error(`${name}_MISSING`);
  return value;
}

function apiClient() {
  return new LiveKitAPI({
    host: required('LIVEKIT_URL').replace(/^wss:/, 'https:'),
    apiKey: required('LIVEKIT_API_KEY'),
    secret: required('LIVEKIT_API_SECRET'),
  });
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
    ttl: '15m',
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
  const api = apiClient();
  try {
    const existing = await api.room.listRooms({ names: [roomName] });
    if (existing.length) return existing[0];
  } catch {
    // create below; LiveKit also creates rooms lazily on first join.
  }
  return api.room.createRoom({ name: roomName, emptyTimeout: 300, maxParticipants });
}

export async function closeLiveKitRoom(roomName: string) {
  const api = apiClient();
  try {
    await api.room.deleteRoom(roomName);
  } catch (error) {
    // Deleting an already-absent room should not leave stale TRYAMM authorization state.
    const message = error instanceof Error ? error.message : String(error);
    if (!/not.?found|404/i.test(message)) throw error;
  }
}
