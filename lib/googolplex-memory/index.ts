import { insertRow, isSupabaseConfigured, selectRows } from "@/lib/supabase/server-rest";
import type { MemoryContextItem, StubbsAIRequest } from "@/lib/stubbs-ai/types";

interface MemoryRow {
  id: string;
  namespace: string;
  kind: string;
  summary: string;
  importance: number;
  source?: string | null;
  created_at?: string | null;
}

export async function retrieveGoogolplexMemory(
  request: StubbsAIRequest,
  limit = 12,
): Promise<MemoryContextItem[]> {
  if (!isSupabaseConfigured() || !request.memoryQuery?.trim()) return [];

  const namespace = encodeURIComponent(request.domain);
  const rows = await selectRows<MemoryRow>(
    "googolplex_memory",
    `namespace=eq.${namespace}&select=id,namespace,kind,summary,importance,source,created_at&order=importance.desc,created_at.desc&limit=${Math.max(1, Math.min(limit, 25))}`,
  );

  return rows.map((row) => ({
    id: row.id,
    namespace: row.namespace,
    kind: row.kind,
    summary: row.summary,
    importance: row.importance,
    source: row.source ?? undefined,
    createdAt: row.created_at ?? undefined,
  }));
}

export async function writeGoogolplexMemory(input: {
  namespace: string;
  kind: string;
  summary: string;
  importance?: number;
  source?: string;
  ownerId?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!isSupabaseConfigured()) return null;

  return insertRow<Record<string, unknown>>("googolplex_memory", {
    namespace: input.namespace,
    kind: input.kind,
    summary: input.summary,
    importance: Math.max(0, Math.min(input.importance ?? 0.5, 1)),
    source: input.source ?? null,
    owner_id: input.ownerId ?? null,
    metadata: input.metadata ?? {},
  });
}
