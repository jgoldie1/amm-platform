export type RuntimeCapability =
  | 'supabase'
  | 'stripe'
  | 'livekit'
  | 'telephony'
  | 'ai'
  | 'storage'
  | 'push';

function hasSupabasePublicConfig(){
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
}
function hasStripeConfig(){
  return Boolean((process.env.STRIPE_RESTRICTED_KEY || process.env.STRIPE_SECRET_KEY) && process.env.STRIPE_WEBHOOK_SECRET);
}

const requiredByCapability: Record<Exclude<RuntimeCapability,'supabase'|'storage'|'stripe'>, string[]> = {
  livekit: ['LIVEKIT_URL', 'LIVEKIT_API_KEY', 'LIVEKIT_API_SECRET'],
  telephony: ['TELEPHONY_PROVIDER', 'TELEPHONY_ACCOUNT_ID', 'TELEPHONY_AUTH_TOKEN', 'TELEPHONY_FROM_NUMBER'],
  ai: ['AI_PROVIDER', 'AI_API_KEY'],
  push: ['PUSH_PROVIDER'],
};

export function capabilityStatus(capability: RuntimeCapability) {
  if (capability==='supabase' || capability==='storage') {
    const configured=hasSupabasePublicConfig();
    return { configured, missing: configured ? [] : ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY|NEXT_PUBLIC_SUPABASE_ANON_KEY'] };
  }
  if(capability==='stripe'){
    const configured=hasStripeConfig();
    return {configured,missing:configured?[]:['STRIPE_RESTRICTED_KEY|STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET']};
  }
  const missing = requiredByCapability[capability].filter((name) => !process.env[name]);
  return { configured: missing.length === 0, missing };
}

export function requireCapability(capability: RuntimeCapability) {
  const status = capabilityStatus(capability);
  if (!status.configured) throw new Error(`${capability} is not configured; missing: ${status.missing.join(', ')}`);
}

export function integrationReadiness() {
  const capabilities: RuntimeCapability[]=['supabase','stripe','livekit','telephony','ai','storage','push'];
  return Object.fromEntries(capabilities.map((key) => [key, capabilityStatus(key)])) as Record<RuntimeCapability, ReturnType<typeof capabilityStatus>>;
}
