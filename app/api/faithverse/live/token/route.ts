import { NextRequest, NextResponse } from 'next/server';
import { createHmac, randomUUID } from 'node:crypto';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function error(message:string,status:number){return NextResponse.json({error:message},{status,headers:{'Cache-Control':'no-store'}});}
function encode(value:object){return Buffer.from(JSON.stringify(value)).toString('base64url');}
export async function POST(request:NextRequest){
  if(process.env.TRYAMM_LIVE_ENABLED!=='true')return error('Broadcasting disabled',503);
  const liveUrl=process.env.LIVEKIT_URL||'';
  const apiKey=process.env.LIVEKIT_API_KEY||'';
  const secret=process.env.LIVEKIT_API_SECRET||'';
  const supabase=process.env.SUPABASE_URL||'';
  const serverKey=process.env.SUPABASE_SERVICE_ROLE_KEY||'';
  if(!/^wss:\/\//.test(liveUrl)||!apiKey||secret.length<16||!/^https:\/\/[^/]+\.supabase\.co$/.test(supabase)||!serverKey)return error('Broadcast service unavailable',503);
  const auth=request.headers.get('authorization')||'';
  if(!/^Bearer [^\s]+$/.test(auth))return error('Authentication required',401);
  const res=await fetch(supabase+'/auth/v1/user',{headers:{apikey:serverKey,authorization:auth},cache:'no-store'}).catch(()=>null);
  if(!res?.ok)return error('Session not verified',401);
  const user=await res.json().catch(()=>null);
  if(!user?.id||!uuid.test(user.id))return error('Invalid identity',401);
  const body=await request.json().catch(()=>null);
  const room=body?.room;
  if(typeof room!=='string'||!uuid.test(room))return error('Room must be a UUID',400);
  if(body?.role!=='viewer'&&body?.role!=='host')return error('Invalid requested role',400);
  // Hosts must be explicitly provisioned by operators. Never trust client role or user_metadata.
  const allow=new Set((process.env.TRYAMM_LIVE_HOST_USER_IDS||'').split(',').map(s=>s.trim()).filter(s=>uuid.test(s)));
  if(body.role==='host'&&!allow.has(user.id))return error('Host permission denied',403);
  // A viewer may join only designated public/approved rooms. No arbitrary private-room access.
  const approved=new Set((process.env.TRYAMM_LIVE_APPROVED_ROOM_IDS||'').split(',').map(s=>s.trim()).filter(s=>uuid.test(s)));
  if(!approved.has(room))return error('Room not approved for access',403);
  const now=Math.floor(Date.now()/1000);
  const grant={room,roomJoin:true,canPublish:body.role==='host',canSubscribe:true,canPublishData:body.role==='host',canPublishSources:body.role==='host'?['camera','microphone','screen_share','screen_share_audio']:[]};
  const header=encode({alg:'HS256',typ:'JWT'});
  const payload=encode({iss:apiKey,sub:user.id+'-'+randomUUID(),nbf:now-5,iat:now,exp:now+900,video:grant});
  const unsigned=header+'.'+payload;
  const signature=createHmac('sha256',secret).update(unsigned).digest('base64url');
  return NextResponse.json({url:liveUrl,token:unsigned+'.'+signature,role:body.role,expiresIn:900},{headers:{'Cache-Control':'no-store','Pragma':'no-cache'}});
}
