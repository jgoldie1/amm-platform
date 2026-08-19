import { createHmac } from 'node:crypto';
import { NextResponse } from 'next/server';
import { bearerToken, verifySupabaseUser } from '@/lib/supabase/user-rest';
import { insertRow, patchRows, selectRows } from '@/lib/supabase/server-rest';
import { recordSecurityEvent } from '@/lib/security/control-plane';

function hash(value: string) {
  const key = process.env.SECURITY_RISK_HMAC_KEY;
  if (!key) throw new Error('SECURITY_RISK_HMAC_KEY_NOT_CONFIGURED');
  return createHmac('sha256', key).update(value).digest('hex');
}

export async function POST(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({error:'unauthorized'},{status:401});
  const user = await verifySupabaseUser(token);
  if (!user) return NextResponse.json({error:'invalid_session'},{status:401});

  try {
    const ua = request.headers.get('user-agent') ?? 'unknown';
    const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const country = request.headers.get('x-vercel-ip-country') ?? request.headers.get('cf-ipcountry') ?? null;
    const body = await request.json().catch(()=>({}));
    const clientDevice = String(body.deviceId ?? 'browser').slice(0,200);
    const deviceHash = hash(`${clientDevice}|${ua}`);
    const networkHash = hash(forwarded);
    const uaHash = hash(ua);
    const recent = await selectRows<{device_hash:string|null;country_code:string|null;occurred_at:string}>('security_session_events',
      `select=device_hash,country_code,occurred_at&user_id=eq.${encodeURIComponent(user.id)}&event_type=eq.signin&order=occurred_at.desc&limit=10`).catch(()=>[]);
    const knownDevice = recent.some(r=>r.device_hash===deviceHash);
    const countries = new Set(recent.map(r=>r.country_code).filter(Boolean));
    const reasons:string[]=[];
    let risk=0;
    if (recent.length && !knownDevice) { risk+=35; reasons.push('new_device'); }
    if (country && countries.size && !countries.has(country)) { risk+=35; reasons.push('new_country'); }
    if (ua.toLowerCase().includes('headless')) { risk+=40; reasons.push('headless_user_agent'); }
    risk=Math.min(100,risk);
    await insertRow('security_session_events',{user_id:user.id,event_type:'signin',device_hash:deviceHash,network_hash:networkHash,country_code:country,user_agent_hash:uaHash,risk_score:risk,reasons});
    if (risk>=70) {
      await patchRows('user_security_state',`user_id=eq.${encodeURIComponent(user.id)}`,{status:'locked',reason:reasons.join(','),risk_score:risk,locked_at:new Date().toISOString(),updated_at:new Date().toISOString()}).catch(async()=>{
        await insertRow('user_security_state',{user_id:user.id,status:'locked',reason:reasons.join(','),risk_score:risk,locked_at:new Date().toISOString()});
      });
      await recordSecurityEvent('signin.suspicious_locked','critical',{risk,reasons,country},user.id);
      return NextResponse.json({risk,status:'locked',reasons},{status:423});
    }
    if (risk>=35) {
      await patchRows('user_security_state',`user_id=eq.${encodeURIComponent(user.id)}`,{status:'step_up_required',reason:reasons.join(','),risk_score:risk,updated_at:new Date().toISOString()}).catch(async()=>{
        await insertRow('user_security_state',{user_id:user.id,status:'step_up_required',reason:reasons.join(','),risk_score:risk});
      });
      await recordSecurityEvent('signin.step_up_required','high',{risk,reasons,country},user.id);
      return NextResponse.json({risk,status:'step_up_required',reasons});
    }
    return NextResponse.json({risk,status:'normal',reasons});
  } catch(error) {
    return NextResponse.json({error:error instanceof Error?error.message:'risk_check_failed'},{status:503});
  }
}
