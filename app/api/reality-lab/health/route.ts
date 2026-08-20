import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const supabaseService = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return NextResponse.json({
    slice: 'streetverse-district-01-reality-lab',
    code: 'implemented-on-proof-branch',
    environment: {
      supabasePublicConfigured: supabaseUrl && supabaseAnon,
      supabaseServerConfigured: supabaseUrl && supabaseService
    },
    gates: {
      build: 'UNPROVEN',
      controller: 'UNPROVEN',
      multiplayer: 'UNPROVEN',
      saveRejoin: 'UNPROVEN',
      panic: 'UNPROVEN',
      accessibility: 'UNPROVEN',
      mobileXR: 'UNPROVEN',
      commerceIsolation: 'UNPROVEN'
    },
    rule: 'No major world or engine expansion until required active-slice evidence is GREEN.'
  });
}
