import { NextResponse } from 'next/server';
import { bearerToken, verifySupabaseUser } from '@/lib/supabase/user-rest';
import { insertRow, patchRows, selectRows } from '@/lib/supabase/server-rest';
import { isSecurityAdmin, recordSecurityEvent, requireRecentStepUp } from '@/lib/security/control-plane';

type SecurityState = { id:string; mode:string; reason?:string|null; incident_id?:string|null; updated_at:string };

async function admin(request: Request) {
  const token = bearerToken(request);
  if (!token) return { error: NextResponse.json({error:'unauthorized'},{status:401}) };
  const user = await verifySupabaseUser(token);
  if (!user) return { error: NextResponse.json({error:'invalid_session'},{status:401}) };
  if (!isSecurityAdmin(user.id)) return { error: NextResponse.json({error:'security_admin_required'},{status:403}) };
  return { user };
}

export async function GET(request: Request) {
  const auth = await admin(request); if ('error' in auth) return auth.error;
  const rows = await selectRows<SecurityState>('security_control_state','select=id,mode,reason,incident_id,updated_at&id=eq.global&limit=1');
  return NextResponse.json({ state: rows[0] ?? null });
}

export async function POST(request: Request) {
  const auth = await admin(request); if ('error' in auth) return auth.error;
  const body = await request.json().catch(()=>({}));
  const action = String(body.action ?? '');
  const reason = String(body.reason ?? '').slice(0,1000) || 'Security operator action';

  if (action === 'panic') {
    const incident = await insertRow<Record<string,unknown>>('security_incidents', {
      status:'open', severity:'critical', summary:reason, affected_services:['payments','payouts','gifts','device_control','publishing','uploads','live'], opened_by:auth.user.id,
    });
    const state = (await patchRows<SecurityState>('security_control_state','id=eq.global', {
      mode:'panic', freeze_payments:true, freeze_payouts:true, freeze_gifts:true, freeze_device_control:true,
      freeze_publishing:true, freeze_uploads:true, freeze_live:true, reason, incident_id:incident.id, updated_by:auth.user.id, updated_at:new Date().toISOString(),
    }))[0];
    await recordSecurityEvent('panic.activated','critical',{reason,incidentId:incident.id},auth.user.id);
    return NextResponse.json({state,incident},{status:201});
  }

  if (action === 'elevated') {
    const state = (await patchRows<SecurityState>('security_control_state','id=eq.global', {
      mode:'elevated', freeze_payments:true, freeze_payouts:true, freeze_gifts:true, freeze_device_control:true,
      freeze_publishing:true, freeze_uploads:true, freeze_live:false, reason, updated_by:auth.user.id, updated_at:new Date().toISOString(),
    }))[0];
    await recordSecurityEvent('security.elevated','high',{reason},auth.user.id);
    return NextResponse.json({state});
  }

  if (action === 'recovery' || action === 'normal') {
    try { await requireRecentStepUp(auth.user.id,'security_recovery',300); }
    catch { return NextResponse.json({error:'passkey_step_up_required',action:'security_recovery'},{status:428}); }
    const current = (await selectRows<SecurityState>('security_control_state','select=*&id=eq.global&limit=1'))[0];
    if (action === 'recovery') {
      const state = (await patchRows<SecurityState>('security_control_state','id=eq.global', {
        mode:'recovery', freeze_payments:true, freeze_payouts:true, freeze_gifts:true, freeze_device_control:true,
        freeze_publishing:true, freeze_uploads:true, freeze_live:false, reason, updated_by:auth.user.id, updated_at:new Date().toISOString(),
      }))[0];
      await recordSecurityEvent('panic.recovery_started','high',{reason,incidentId:current?.incident_id},auth.user.id);
      return NextResponse.json({state});
    }
    const state = (await patchRows<SecurityState>('security_control_state','id=eq.global', {
      mode:'normal', freeze_payments:false, freeze_payouts:false, freeze_gifts:false, freeze_device_control:false,
      freeze_publishing:false, freeze_uploads:false, freeze_live:false, reason, incident_id:null, updated_by:auth.user.id, updated_at:new Date().toISOString(),
    }))[0];
    if (current?.incident_id) await patchRows('security_incidents',`id=eq.${encodeURIComponent(current.incident_id)}`,{status:'closed',closed_at:new Date().toISOString()});
    await recordSecurityEvent('panic.recovered','high',{reason,incidentId:current?.incident_id},auth.user.id);
    return NextResponse.json({state});
  }

  return NextResponse.json({error:'invalid_security_action'},{status:400});
}
