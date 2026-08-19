export type ModerationDecision = 'allow' | 'review' | 'block';

export interface ModerationRequest {
  actorId: string;
  contentType: 'text' | 'image' | 'video' | 'audio' | 'live' | 'game_asset';
  text?: string;
  assetUrl?: string;
  locale?: string;
}

export interface ModerationResult {
  decision: ModerationDecision;
  reasons: string[];
  provider?: string;
}

export async function moderateContent(input: ModerationRequest): Promise<ModerationResult> {
  const endpoint = process.env.MODERATION_PROVIDER_ENDPOINT;
  const token = process.env.MODERATION_PROVIDER_KEY;
  if (!endpoint || !token) {
    return { decision: 'review', reasons: ['moderation provider unavailable; manual review required'] };
  }
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
    cache: 'no-store',
  });
  if (!response.ok) return { decision: 'review', reasons: [`moderation provider error ${response.status}`] };
  const body = (await response.json()) as { decision?: ModerationDecision; reasons?: string[]; provider?: string };
  return {
    decision: body.decision ?? 'review',
    reasons: body.reasons ?? ['provider returned no explicit reasons'],
    provider: body.provider,
  };
}
