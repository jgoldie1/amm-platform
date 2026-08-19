import { requireCapability } from '@/lib/runtime/env';

export interface AIProviderRequest {
  model?: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
}

export interface AIProviderResult {
  provider: string;
  model: string;
  text: string;
  usage?: { inputTokens?: number; outputTokens?: number };
}

export async function runAIProvider(request: AIProviderRequest): Promise<AIProviderResult> {
  requireCapability('ai');
  const endpoint = process.env.AI_PROVIDER_ENDPOINT;
  if (!endpoint) throw new Error('AI provider endpoint is not configured.');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.AI_API_KEY}` },
    body: JSON.stringify(request),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`AI provider failed with ${response.status}`);
  const body = (await response.json()) as { text?: string; model?: string; usage?: AIProviderResult['usage'] };
  if (!body.text) throw new Error('AI provider returned no text');
  return { provider: process.env.AI_PROVIDER!, model: body.model ?? request.model ?? 'default', text: body.text, usage: body.usage };
}
