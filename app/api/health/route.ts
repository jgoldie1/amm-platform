import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'tryamm-omni-core',
    at: new Date().toISOString()
  });
}
