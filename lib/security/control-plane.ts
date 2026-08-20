import { insertRow, selectRows } from '@/lib/supabase/server-rest';

export type SecurityCapability = 'payments'|'payouts'|'gifts'|'device_control'|'publishing'|'uploads'|'live'|'admin';
export type SecurityMode = 'normal'|'elevated'|'panic'|'recovery';

type SecurityState = {
  id: string;
  mode: SecurityMode;
  freeze_payments: boolean;
  freeze_payouts: boolean;
  freeze_gifts: boolean;
  freeze_device_control: boolean;
  freeze_publishing: boolean;
  freeze_uploads: boolean;
  freeze_live: boolean;
  reason?: string | null;
  incident_id?: string | null;
  updated_at: string;
};

type UserSecurityState = { user_id:string; status:'normal'|'step_up_required'|'locked'; reason?:string|null; risk_score:number; locked_at?:string|null };

const envPanic = () => process.env.TRYAMM_PANIC_MODE === 'true';

export async function getSecurityState(): Promise<SecurityState> {
  if (envPanic()) return {
    id:'global', mode:'panic', freeze_payments:true, freeze_payouts:true, freeze_gifts:true,
    freeze_device_control:true, freeze_publishing:true, freeze_uploads:true, freeze_live:true,
    reason:'TRYAMM_PANIC_MODE environment kill switch', incident_id:null, updated_at:new Date().toISOString(),
  };
  try {
    const rows = await selectRows<SecurityState>('security_control_state','select=*&id=eq.global&limit=1');
    if (rows[0]) return rows[0];
  } catch {}
  return {
    id:'global', mode:'elevated', freeze_payments:true, freeze_payouts:true, freeze_gifts:true,
    freeze_device_control:true, freeze_publishing:true, freeze_uploads:true, freeze_live:false,
    reason:'Security control state unavailable; money/device/publish operations fail closed', incident_id:null,
    updated_at:new Date().toISOString(),
  };
}

export async function requireCapability(capability: SecurityCapability) {
  const state = await getSecurityState();
  const frozen: Record<SecurityCapability, boolean> = {
    payments: state.freeze_payments, payouts: state.freeze_payouts, gifts: state.freeze_gifts,
    device_control: state.freeze_device_control, publishing: state.freeze_publishing, uploads: state.freeze_uploads,
    live: state.freeze_live, admin: state.mode === 'panic',
  };
  if (frozen[capability]) {
    await recordSecurityEvent('capability.blocked','high',{ capability, mode: state.mode, incidentId: state.incident_id }).catch(()=>{});
    throw new Error(`SECURITY_FREEZE_${capability.toUpperCase()}`);
  }
  return state;
}

export async function getUserSecurityState(userId: string): Promise<UserSecurityState> {
  const rows = await selectRows<UserSecurityState>('user_security_state',`select=user_id,status,reason,risk_score,locked_at&user_id=eq.${encodeURIComponent(userId)}&limit=1`).catch(()=>[]);
  return rows[0] ?? { user_id:userId, status:'normal', risk_score:0 };
}

export async function requireUserSecurity(userId: string, options?: { stepUpAction?: string }) {
  const state = await getUserSecurityState(userId);
  if (state.status === 'locked') {
    await recordSecurityEvent('account.lockdown_blocked','high',{reason:state.reason,riskScore:state.risk_score},userId).catch(()=>{});
    throw new Error('ACCOUNT_LOCKED');
  }
  if (state.status === 'step_up_required') {
    if (!options?.stepUpAction) throw new Error('STEP_UP_REQUIRED');
    await requireRecentStepUp(userId, options.stepUpAction, 300);
  }
  return state;
}

export async function recordSecurityEvent(eventType: string, severity: 'info'|'low'|'medium'|'high'|'critical', payload: Record<string, unknown> = {}, actorId?: string) {
  return insertRow<Record<string, unknown>>('security_events_append_only', { actor_id: actorId ?? null, event_type: eventType, severity, payload });
}

export function isSecurityAdmin(userId: string) {
  const allowed = (process.env.SECURITY_ADMIN_USER_IDS ?? '').split(',').map(v=>v.trim()).filter(Boolean);
  return allowed.includes(userId);
}

export async function requireRecentStepUp(userId: string, action: string, maxAgeSeconds = 300) {
  const since = new Date(Date.now() - maxAgeSeconds * 1000).toISOString();
  const rows = await selectRows<{id:string}>('security_step_up_events',
    `select=id&user_id=eq.${encodeURIComponent(userId)}&action=eq.${encodeURIComponent(action)}&verified_at=gte.${encodeURIComponent(since)}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&order=verified_at.desc&limit=1`);
  if (!rows[0]) throw new Error('PASSKEY_STEP_UP_REQUIRED');
  return true;
}
