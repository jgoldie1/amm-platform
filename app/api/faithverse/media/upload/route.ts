import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const MAX_BYTES = 10 * 1024 * 1024;
const VALID_TYPES: Record<string,string> = {'video/mp4':'mp4','video/quicktime':'mov','video/webm':'webm'};
function reply(message:string,status:number){return NextResponse.json({error:message},{status,headers:{'Cache-Control':'no-store'}})}
function configured(){
 const url=process.env.SUPABASE_URL||'';
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY||'';
 if(process.env.TRYAMM_MEDIA_UPLOAD_ENABLED!=='true'||!/^https:\/\/[^/]+\.supabase\.co$/.test(url)||!key) return null;
 return {url,key};
}
export async function POST(req:NextRequest){
 const c=configured();
 if(!c)return reply('Media uploads are not enabled',503);
 const auth=req.headers.get('authorization')||'';
 if(!/^Bearer [^\s]+$/.test(auth))return reply('Authentication required',401);
 const mime=(req.headers.get('content-type')||'').split(';')[0].trim().toLowerCase();
 const ext=VALID_TYPES[mime];
 if(!ext)return reply('Unsupported video type',415);
 const len=Number(req.headers.get('content-length')||NaN);
 if(!Number.isSafeInteger(len)||len<=0||len>MAX_BYTES)return reply('Invalid or oversized upload',413);
 const userResponse=await fetch(c.url+'/auth/v1/user',{headers:{apikey:c.key,authorization:auth},cache:'no-store'}).catch(()=>null);
 if(!userResponse?.ok)return reply('Invalid session',401);
 const user=await userResponse.json().catch(()=>null);
 if(!user||typeof user.id!=='string'||!/^[0-9a-f-]{36}$/i.test(user.id))return reply('Invalid session',401);
 let data:Uint8Array;
 try{const buffer=await req.arrayBuffer();if(buffer.byteLength!==len||buffer.byteLength>MAX_BYTES)return reply('Upload size mismatch',413);data=new Uint8Array(buffer);}
 catch{return reply('Unable to read upload',400)}
 const headerOk = (mime==='video/mp4' || mime==='video/quicktime') ?
   data.length>12 && String.fromCharCode(...data.slice(4,8))==='ftyp' :
   data.length>4&&data[0]===0x1a&&data[1]===0x45&&data[2]===0xdf&&data[3]===0xa3;
 if(!headerOk)return reply('File signature does not match video format',415);
 const objectPath=user.id+'/'+randomUUID()+'.'+ext;
 const storagePath=c.url+'/storage/v1/object/creator-media/'+objectPath;
 const headers={apikey:c.key,authorization:'Bearer '+c.key};
 const put=await fetch(storagePath,{method:'POST',headers:{...headers,'content-type':mime,'x-upsert':'false','cache-control':'private, max-age=0'},body:Buffer.from(data)}).catch(()=>null);
 if(!put?.ok)return reply('Private storage failed',502);
 const job=await fetch(c.url+'/rest/v1/media_processing_jobs',{method:'POST',headers:{...headers,'content-type':'application/json','prefer':'return=representation'},body:JSON.stringify({owner_id:user.id,source_path:objectPath,job_type:'transcode',status:'queued'})}).catch(()=>null);
 if(!job?.ok){
   await fetch(storagePath,{method:'DELETE',headers}).catch(()=>null);
   return reply('Job queue failed; upload rolled back',502);
 }
 const jobs=await job.json().catch(()=>[]);
 return NextResponse.json({jobId:jobs?.[0]?.id??null,status:'queued',message:'Private upload queued; not publicly accessible'},{status:202,headers:{'Cache-Control':'no-store'}});
}
