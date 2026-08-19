export type RuntimeCapability =
  | 'supabase'
  | 'stripe'
  | 'livekit'
  | 'telephony'
  | 'ai'
  | 'storage'
  | 'push';

const requiredByCapability: Record<RuntimeCapability, string[]> = {
  supabase: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  stripe: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
  livekit: ['LIVEKIT_URL', 'LIVEKIT_API_KEY', 'LIVEKIT_API_SECRET'],
  telephony: ['TELEPHONY_PROVIDER', 'TELEPHONY_ACCOUNT_ID', 'TELEPHONY_AUTH_TOKEN', 'TELEPHONY_FROM_NUMBER'],
  ai: ['AI_PROVIDER', 'AI_API_KEY'],
  storage: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  push: ['PUSH_PROVIDER'],
};

export function capabilityStatus(capability: RuntimeCapability) {
  const missing = requiredByCapability[capability].filter((name) => !process.env[name]);
  return { configured: missing.length === 0, missing };
}

export function requireCapability(capability: RuntimeCapability) {
  const status = capabilityStatus(capability);
  if (!status.configured) {
    throw new Error(`${capability} is not configured; missing: ${status.missing.join(', ')}`);
  }
}

export function integrationReadiness() {
  return Object.fromEntries(
    (Object.keys(requiredByCapability) as RuntimeCapability[]).map((key) => [key, capabilityStatus(key)]),
  );
}
