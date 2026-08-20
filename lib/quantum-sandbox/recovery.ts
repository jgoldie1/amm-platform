export type RecoverySeverity = 'info' | 'degraded' | 'high' | 'critical';

export type RecoveryDomain =
  | 'auth'
  | 'live'
  | 'payments'
  | 'holgpt'
  | 'uploads'
  | 'world'
  | 'provider'
  | 'holohost'
  | 'security'
  | 'deployment';

export type RecoveryAction =
  | 'snapshot'
  | 'isolate'
  | 'reconnect'
  | 'retry_idempotent'
  | 'resume_upload'
  | 'restore_checkpoint'
  | 'open_circuit'
  | 'use_approved_fallback'
  | 'degrade_quality'
  | 'freeze_money'
  | 'revoke_tokens'
  | 'stop_external_devices'
  | 'quarantine_content'
  | 'preserve_evidence'
  | 'require_step_up'
  | 'require_ci_patch'
  | 'require_operator_approval';

export interface RecoveryIncident {
  id: string;
  domain: RecoveryDomain;
  severity: RecoverySeverity;
  reason: string;
  panicMode: boolean;
  moneyMutation?: boolean;
  idempotent?: boolean;
  checkpointAvailable?: boolean;
  approvedFallbackAvailable?: boolean;
  networkDegraded?: boolean;
  externalDeviceActive?: boolean;
}

export interface RecoveryPlan {
  incidentId: string;
  actions: RecoveryAction[];
  productionMutationAllowed: boolean;
  requiresSandbox: boolean;
  requiresCI: boolean;
  requiresOperatorApproval: boolean;
  notes: string[];
}

function pushUnique<T>(items: T[], item: T) {
  if (!items.includes(item)) items.push(item);
}

export function buildRecoveryPlan(incident: RecoveryIncident): RecoveryPlan {
  const actions: RecoveryAction[] = ['snapshot', 'preserve_evidence'];
  const notes: string[] = [];
  let productionMutationAllowed = true;
  let requiresSandbox = false;
  let requiresCI = false;
  let requiresOperatorApproval = false;

  if (incident.panicMode || incident.severity === 'critical') {
    pushUnique(actions, 'isolate');
    pushUnique(actions, 'revoke_tokens');
    pushUnique(actions, 'freeze_money');
    pushUnique(actions, 'quarantine_content');
    if (incident.externalDeviceActive) pushUnique(actions, 'stop_external_devices');
    pushUnique(actions, 'require_step_up');
    productionMutationAllowed = false;
    requiresSandbox = true;
    requiresOperatorApproval = true;
    pushUnique(actions, 'require_operator_approval');
    notes.push('Panic Mode/critical incidents cannot be self-cleared by the recovery runtime.');
  }

  switch (incident.domain) {
    case 'live':
      if (!incident.panicMode) pushUnique(actions, 'reconnect');
      break;
    case 'payments':
      if (!incident.idempotent) {
        productionMutationAllowed = false;
        requiresOperatorApproval = true;
        pushUnique(actions, 'require_operator_approval');
        notes.push('Non-idempotent money mutation requires authoritative provider reconciliation.');
      } else if (!incident.panicMode) {
        pushUnique(actions, 'retry_idempotent');
      }
      break;
    case 'holgpt':
      if (incident.idempotent && !incident.panicMode) pushUnique(actions, 'retry_idempotent');
      else requiresSandbox = true;
      break;
    case 'uploads':
      if (!incident.panicMode) pushUnique(actions, 'resume_upload');
      break;
    case 'world':
      if (incident.checkpointAvailable) pushUnique(actions, 'restore_checkpoint');
      else {
        requiresSandbox = true;
        productionMutationAllowed = false;
        notes.push('World recovery has no verified checkpoint; preserve state and investigate before mutation.');
      }
      break;
    case 'provider':
      pushUnique(actions, 'open_circuit');
      if (incident.approvedFallbackAvailable && !incident.panicMode) pushUnique(actions, 'use_approved_fallback');
      break;
    case 'holohost':
      if (incident.networkDegraded && !incident.panicMode) pushUnique(actions, 'degrade_quality');
      break;
    case 'security':
      requiresSandbox = true;
      requiresOperatorApproval = true;
      productionMutationAllowed = false;
      pushUnique(actions, 'isolate');
      pushUnique(actions, 'revoke_tokens');
      pushUnique(actions, 'freeze_money');
      if (incident.externalDeviceActive) pushUnique(actions, 'stop_external_devices');
      pushUnique(actions, 'require_step_up');
      pushUnique(actions, 'require_operator_approval');
      break;
    case 'deployment':
      requiresSandbox = true;
      requiresCI = true;
      productionMutationAllowed = false;
      pushUnique(actions, 'require_ci_patch');
      notes.push('Code/config repair must pass branch/PR, typecheck, tests, security checks, build and preview.');
      break;
    case 'auth':
      if (incident.severity === 'high') {
        pushUnique(actions, 'revoke_tokens');
        pushUnique(actions, 'require_step_up');
      }
      break;
  }

  if (incident.networkDegraded && !incident.panicMode) pushUnique(actions, 'degrade_quality');

  if (requiresCI) requiresSandbox = true;

  return {
    incidentId: incident.id,
    actions,
    productionMutationAllowed,
    requiresSandbox,
    requiresCI,
    requiresOperatorApproval,
    notes,
  };
}

export type FaultTestId =
  | 'live-reconnect'
  | 'stale-room-rejection'
  | 'duplicate-webhook'
  | 'holgpt-credit-recovery'
  | 'upload-resume'
  | 'mars-checkpoint-recovery'
  | 'provider-circuit-breaker'
  | 'holohost-degradation'
  | 'panic-mode-supremacy'
  | 'ai-repair-ci-gate';

export interface FaultTestResult {
  id: FaultTestId;
  passed: boolean;
  evidence?: string;
  safetyGatePreserved: boolean;
}

export interface RecoveryReadiness {
  green: boolean;
  passed: number;
  total: number;
  failed: FaultTestId[];
  missingEvidence: FaultTestId[];
}

export function summarizeRecoveryReadiness(results: FaultTestResult[]): RecoveryReadiness {
  const required: FaultTestId[] = [
    'live-reconnect',
    'stale-room-rejection',
    'duplicate-webhook',
    'holgpt-credit-recovery',
    'upload-resume',
    'mars-checkpoint-recovery',
    'provider-circuit-breaker',
    'holohost-degradation',
    'panic-mode-supremacy',
    'ai-repair-ci-gate',
  ];

  const byId = new Map(results.map((result) => [result.id, result]));
  const failed: FaultTestId[] = [];
  const missingEvidence: FaultTestId[] = [];
  let passed = 0;

  for (const id of required) {
    const result = byId.get(id);
    if (!result || !result.passed || !result.safetyGatePreserved) {
      failed.push(id);
      continue;
    }
    if (!result.evidence?.trim()) {
      missingEvidence.push(id);
      continue;
    }
    passed += 1;
  }

  return {
    green: passed === required.length && failed.length === 0 && missingEvidence.length === 0,
    passed,
    total: required.length,
    failed,
    missingEvidence,
  };
}
