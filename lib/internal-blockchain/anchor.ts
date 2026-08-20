import { createHash } from "node:crypto";

/**
 * Internal blockchain/trust-ledger anchoring core.
 *
 * Operational data and sensitive evidence stay off-chain. This module creates
 * deterministic proof envelopes that can be submitted to a permissioned
 * ledger adapter (for example, Hyperledger Fabric) or retained in the audit
 * outbox until a configured network is available.
 */

export type InternalChainEventType =
  | "ledger_batch_closed"
  | "revenue_split_approved"
  | "payout_approved"
  | "refund_recorded"
  | "chargeback_recorded"
  | "admin_correction_recorded"
  | "world_checkpoint_verified"
  | "security_incident_preserved"
  | "panic_mode_entered"
  | "panic_mode_recovered"
  | "deployment_verified"
  | "media_rights_attested"
  | "asset_release_attested"
  | "work_completion_attested";

export interface InternalChainAnchorInput {
  eventId: string;
  eventType: InternalChainEventType;
  occurredAt: string;
  actorRef?: string;
  resourceRef: string;
  status: string;
  amountMinor?: number;
  currency?: string;
  sourceRecordHash: string;
  previousAnchorHash?: string;
  schemaVersion?: string;
}

export interface InternalChainAnchor extends InternalChainAnchorInput {
  schemaVersion: string;
  anchorHash: string;
}

function canonicalize(input: InternalChainAnchorInput): string {
  const canonical = {
    schemaVersion: input.schemaVersion ?? "1.0",
    eventId: input.eventId,
    eventType: input.eventType,
    occurredAt: input.occurredAt,
    actorRef: input.actorRef ?? null,
    resourceRef: input.resourceRef,
    status: input.status,
    amountMinor: input.amountMinor ?? null,
    currency: input.currency ?? null,
    sourceRecordHash: input.sourceRecordHash,
    previousAnchorHash: input.previousAnchorHash ?? null,
  };
  return JSON.stringify(canonical);
}

export function sha256Hex(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

export function createInternalChainAnchor(
  input: InternalChainAnchorInput,
): InternalChainAnchor {
  if (!input.eventId || !input.resourceRef || !input.sourceRecordHash) {
    throw new Error("internal blockchain anchor requires eventId, resourceRef and sourceRecordHash");
  }
  if (typeof input.amountMinor === "number" && !Number.isSafeInteger(input.amountMinor)) {
    throw new Error("amountMinor must be a safe integer");
  }
  if (input.amountMinor !== undefined && !input.currency) {
    throw new Error("currency is required when amountMinor is present");
  }

  const schemaVersion = input.schemaVersion ?? "1.0";
  return {
    ...input,
    schemaVersion,
    anchorHash: sha256Hex(canonicalize({ ...input, schemaVersion })),
  };
}

export function verifyInternalChainAnchor(anchor: InternalChainAnchor): boolean {
  const { anchorHash, ...input } = anchor;
  return sha256Hex(canonicalize(input)) === anchorHash;
}

export interface LedgerBatchRecord {
  recordId: string;
  recordHash: string;
}

/**
 * Merkle-style batch commitment for the accounting ledger. The detailed
 * records remain in the authoritative accounting store; only this proof needs
 * to be anchored on the permissioned chain.
 */
export function createLedgerBatchRoot(records: LedgerBatchRecord[]): string {
  if (records.length === 0) throw new Error("cannot anchor an empty ledger batch");

  let level = [...records]
    .sort((a, b) => a.recordId.localeCompare(b.recordId))
    .map((record) => sha256Hex(`${record.recordId}:${record.recordHash}`));

  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left;
      next.push(sha256Hex(`${left}:${right}`));
    }
    level = next;
  }

  return level[0];
}

export interface PermissionedLedgerReceipt {
  network: string;
  transactionId: string;
  anchorHash: string;
  committedAt: string;
  blockRef?: string;
}

export interface PermissionedLedgerAdapter {
  readonly network: string;
  submit(anchor: InternalChainAnchor): Promise<PermissionedLedgerReceipt>;
  verify(receipt: PermissionedLedgerReceipt): Promise<boolean>;
}

/**
 * Fail-closed submission wrapper. Production should use a real configured
 * permissioned-ledger adapter. It must never fabricate a transaction receipt.
 */
export async function submitInternalAnchor(
  adapter: PermissionedLedgerAdapter | null,
  anchor: InternalChainAnchor,
): Promise<PermissionedLedgerReceipt> {
  if (!verifyInternalChainAnchor(anchor)) {
    throw new Error("internal blockchain anchor failed local verification");
  }
  if (!adapter) {
    throw new Error("permissioned ledger adapter is not configured");
  }
  const receipt = await adapter.submit(anchor);
  if (receipt.anchorHash !== anchor.anchorHash) {
    throw new Error("permissioned ledger receipt does not match submitted anchor");
  }
  return receipt;
}
