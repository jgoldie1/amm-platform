const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function config() {
  if (!supabaseUrl || !publishableKey) {
    throw new Error('Supabase environment variables are not configured.');
  }
  return { supabaseUrl, publishableKey };
}

export type AuthSession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user: { id: string; email?: string };
};

export async function signUp(email: string, password: string) {
  const { supabaseUrl, publishableKey } = config();
  const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: { apikey: publishableKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg || data?.message || 'Sign up failed.');
  return data as Partial<AuthSession> & { user?: AuthSession['user'] };
}

export async function signIn(email: string, password: string) {
  const { supabaseUrl, publishableKey } = config();
  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: publishableKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg || data?.message || 'Sign in failed.');
  return data as AuthSession;
}

function authHeaders(accessToken: string) {
  const { publishableKey } = config();
  return {
    apikey: publishableKey,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

export async function createEarlyAccessProfile(input: {
  accessToken: string;
  userId: string;
  gamerTag: string;
  primaryGame: 'quantum-racer' | 'judah-chainbreakers' | 'tryamm-hoops';
  referralCode: string;
}) {
  const { supabaseUrl } = config();
  const res = await fetch(`${supabaseUrl}/rest/v1/early_access_profiles`, {
    method: 'POST',
    headers: { ...authHeaders(input.accessToken), Prefer: 'return=representation' },
    body: JSON.stringify({
      user_id: input.userId,
      gamer_tag: input.gamerTag,
      primary_game: input.primaryGame,
      referral_code: input.referralCode,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Could not create Founding Player profile.');
  return Array.isArray(data) ? data[0] : data;
}

export async function getEarlyAccessProfile(accessToken: string, userId: string) {
  const { supabaseUrl } = config();
  const res = await fetch(
    `${supabaseUrl}/rest/v1/early_access_profiles?user_id=eq.${encodeURIComponent(userId)}&select=*`,
    { headers: authHeaders(accessToken) }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Could not load Founding Player profile.');
  return Array.isArray(data) ? data[0] || null : null;
}

export async function claimReferral(accessToken: string, referralCode: string) {
  const { supabaseUrl } = config();
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/claim_early_access_referral`, {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify({ p_referral_code: referralCode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Referral claim failed.');
  return data as { claimed: boolean };
}
