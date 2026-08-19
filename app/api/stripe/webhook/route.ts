import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { patchRows } from '@/lib/supabase/server-rest';

export const runtime='nodejs';

function verifySignature(raw:string,header:string,secret:string){
  const parts=header.split(',').map(p=>p.split('=',2));
  const timestamp=parts.find(([k])=>k==='t')?.[1];
  const signatures=parts.filter(([k])=>k==='v1').map(([,v])=>v);
  if(!timestamp||!signatures.length) return false;
  const age=Math.abs(Date.now()/1000-Number(timestamp));
  if(!Number.isFinite(age)||age>300) return false;
  const expected=createHmac('sha256',secret).update(`${timestamp}.${raw}`,'utf8').digest('hex');
  return signatures.some(sig=>{
    try{const a=Buffer.from(expected,'hex'),b=Buffer.from(sig,'hex');return a.length===b.length&&timingSafeEqual(a,b);}catch{return false;}
  });
}

export async function POST(request:Request){
  const secret=process.env.STRIPE_WEBHOOK_SECRET;
  if(!secret) return NextResponse.json({error:'webhook_not_configured'},{status:503});
  const signature=request.headers.get('stripe-signature');
  const raw=await request.text();
  if(!signature||!verifySignature(raw,signature,secret)) return NextResponse.json({error:'invalid_signature'},{status:400});
  let event:any;
  try{event=JSON.parse(raw);}catch{return NextResponse.json({error:'invalid_json'},{status:400});}
  const session=event?.data?.object;
  if(event?.type==='checkout.session.completed' && session?.id){
    await patchRows('orders',`stripe_checkout_session_id=eq.${encodeURIComponent(session.id)}`,{status:'paid',stripe_pi:session.payment_intent??null});
  } else if(event?.type==='checkout.session.expired' && session?.id){
    await patchRows('orders',`stripe_checkout_session_id=eq.${encodeURIComponent(session.id)}`,{status:'expired'});
  }
  return NextResponse.json({received:true});
}
