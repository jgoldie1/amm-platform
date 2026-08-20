export interface HoloEvidenceRecord {
  id: string;
  type: "route" | "identity" | "content" | "payment" | "federation" | "deployment";
  checksum: string;
  createdAt: string;
  source: string;
  anchor?: { network: string; transactionId: string; anchoredAt: string };
}

export function buildEvidenceAnchorPayload(record: HoloEvidenceRecord) {
  return {
    id: record.id,
    type: record.type,
    checksum: record.checksum,
    createdAt: record.createdAt,
    source: record.source,
  };
}
