import { requireCapability } from '@/lib/runtime/env';

export interface OutboundCallRequest {
  to: string;
  from?: string;
  webhookUrl: string;
  locale?: string;
  metadata?: Record<string, string>;
}

export async function startOutboundCall(request: OutboundCallRequest) {
  requireCapability('telephony');
  const endpoint = process.env.TELEPHONY_ADAPTER_URL;
  if (!endpoint) throw new Error('Telephony adapter is not configured.');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.TELEPHONY_AUTH_TOKEN}`,
    },
    body: JSON.stringify({ ...request, from: request.from ?? process.env.TELEPHONY_FROM_NUMBER }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Telephony adapter failed with ${response.status}`);
  return response.json();
}
