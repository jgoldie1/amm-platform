import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
 const ready=process.env.TRYAMM_LIVE_ENABLED==='true' &&
   Boolean(process.env.LIVEKIT_URL?.startsWith('wss://')) &&
   Boolean(process.env.LIVEKIT_API_KEY) &&
   Boolean(process.env.LIVEKIT_API_SECRET);
 return NextResponse.json({
   broadcasting:ready?'configured':'disabled',
   canJoin:ready,
   recording:'requires-separate-egress-setup',
   message:ready?'LiveKit server configuration is present; token and media tests still required.':'Live broadcasting is disabled until secure LiveKit configuration and tests pass.'
 },{headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
