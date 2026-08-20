const groups = {
  core: ['NEXT_PUBLIC_SITE_URL','NEXT_PUBLIC_SUPABASE_URL'],
  auth: ['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','SUPABASE_SERVICE_ROLE_KEY'],
  security: ['SECURITY_RISK_HMAC_KEY'],
  live: ['LIVEKIT_URL','LIVEKIT_API_KEY','LIVEKIT_API_SECRET'],
  ai: ['AI_PROVIDER','AI_API_KEY'],
  money: ['STRIPE_WEBHOOK_SECRET'],
};

const oneOf = {
  authPublicKey: ['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  stripeServerKey: ['STRIPE_RESTRICTED_KEY','STRIPE_SECRET_KEY'],
};

const optional = {
  recording: ['LIVEKIT_RECORDING_S3_ACCESS_KEY','LIVEKIT_RECORDING_S3_SECRET','LIVEKIT_RECORDING_S3_BUCKET','LIVEKIT_RECORDING_S3_REGION'],
  telephony: ['TELEPHONY_PROVIDER','TELEPHONY_ACCOUNT_ID','TELEPHONY_AUTH_TOKEN','TELEPHONY_FROM_NUMBER'],
  storage: ['STORAGE_SIGNER_URL','STORAGE_SIGNER_SECRET'],
  moderation: ['MODERATION_PROVIDER_ENDPOINT','MODERATION_PROVIDER_KEY'],
  malware: ['MALWARE_SCANNER_ENDPOINT','MALWARE_SCANNER_KEY'],
  notifications: ['PUSH_PROVIDER','PUSH_PROVIDER_KEY'],
};

function has(name) { return Boolean(process.env[name]?.trim()); }
const missing = [];
for (const [group, vars] of Object.entries(groups)) {
  for (const name of vars) if (!has(name)) missing.push(`${group}:${name}`);
}
for (const [group, vars] of Object.entries(oneOf)) {
  if (!vars.some(has)) missing.push(`${group}:one-of(${vars.join('|')})`);
}

const optionalStatus = Object.fromEntries(Object.entries(optional).map(([group, vars]) => [
  group,
  vars.every(has) ? 'configured' : vars.some(has) ? 'partial' : 'not-configured',
]));

const result = {
  ok: missing.length === 0,
  missing,
  optional: optionalStatus,
  panicMode: process.env.TRYAMM_PANIC_MODE === 'true',
};

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
