import { requireCapability } from '@/lib/runtime/env';

export interface LiveRoomTokenRequest {
  roomName: string;
  participantIdentity: string;
  participantName?: string;
  canPublish?: boolean;
  canSubscribe?: boolean;
}

export interface LiveRoomTokenResult {
  provider: 'livekit';
  roomName: string;
  participantIdentity: string;
  token: string;
  url: string;
}

/**
 * Token minting intentionally remains behind a provider adapter. The app must not
 * expose LIVEKIT_API_SECRET to clients. Replace the placeholder signer with the
 * official server-side LiveKit SDK once dependencies are installed and tested.
 */
export async function createLiveRoomToken(request: LiveRoomTokenRequest): Promise<LiveRoomTokenResult> {
  requireCapability('livekit');
  const url = process.env.LIVEKIT_URL!;
  const signer = process.env.LIVEKIT_TOKEN_SIGNER_URL;
  if (!signer) {
    throw new Error('LiveKit token signer is not configured. Refusing to mint an unsigned token.');
  }

  const response = await fetch(signer, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-internal-secret': process.env.LIVEKIT_TOKEN_SIGNER_SECRET ?? '' },
    body: JSON.stringify(request),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`LiveKit token signer failed with ${response.status}`);
  const body = (await response.json()) as { token?: string };
  if (!body.token) throw new Error('LiveKit token signer returned no token');
  return { provider: 'livekit', roomName: request.roomName, participantIdentity: request.participantIdentity, token: body.token, url };
}
