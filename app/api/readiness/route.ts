import { NextResponse } from 'next/server';
import { integrationReadiness } from '@/lib/runtime/env';

export async function GET() {
  const integrations = integrationReadiness();
  const requiredForCore = ['supabase', 'ai'] as const;
  const coreReady = requiredForCore.every((key) => integrations[key].configured);

  return NextResponse.json({
    ok: coreReady,
    integrations,
    note: 'A configured integration still requires end-to-end validation before production readiness is claimed.',
  }, { status: coreReady ? 200 : 503 });
}
