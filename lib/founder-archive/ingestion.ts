import { createHash } from "node:crypto";
import { assertFounderArchiveAccess } from "./access";
import type { FounderArchiveKind, FounderArchiveRecord, FounderArchiveSource } from "./types";

export interface FounderArchiveIngestInput {
  ownerId: string;
  authenticatedUserId?: string;
  source: FounderArchiveSource;
  kind: FounderArchiveKind;
  title: string;
  text: string;
  sourceRef?: string;
  originalCreatedAt?: string;
  tags?: string[];
  legacyDesignIds?: string[];
}

export interface FounderArchiveWriteAdapter {
  write(record: FounderArchiveRecord, chunks: Array<{ index: number; content: string; hash: string }>): Promise<void>;
}

function chunkText(text: string, size = 4000): string[] {
  const normalized = text.trim();
  if (!normalized) return [];
  const chunks: string[] = [];
  for (let i = 0; i < normalized.length; i += size) {
    chunks.push(normalized.slice(i, i + size));
  }
  return chunks;
}

function hash(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export async function ingestFounderArchive(
  input: FounderArchiveIngestInput,
  adapter: FounderArchiveWriteAdapter,
): Promise<FounderArchiveRecord> {
  assertFounderArchiveAccess({
    authenticatedUserId: input.authenticatedUserId,
    ownerId: input.ownerId,
    purpose: "ingest",
  });

  const id = crypto.randomUUID();
  const chunks = chunkText(input.text).map((content, index) => ({ index, content, hash: hash(content) }));
  const summary = input.text.trim().slice(0, 1200);

  const record: FounderArchiveRecord = {
    id,
    ownerId: input.ownerId,
    source: input.source,
    kind: input.kind,
    title: input.title,
    summary,
    sourceRef: input.sourceRef,
    checksum: hash(input.text),
    createdAt: input.originalCreatedAt,
    capturedAt: new Date().toISOString(),
    private: true,
    searchable: true,
    tags: input.tags ?? [],
    legacyDesignIds: input.legacyDesignIds ?? [],
  };

  await adapter.write(record, chunks);
  return record;
}
