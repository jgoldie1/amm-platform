import { assertFounderArchiveAccess } from "./access";
import type { FounderArchiveKind, FounderArchiveQuery, FounderArchiveRecord } from "./types";

export interface FounderArchiveSearchAdapter {
  search(input: {
    ownerId: string;
    query: string;
    limit: number;
    includeKinds?: FounderArchiveKind[];
  }): Promise<FounderArchiveRecord[]>;
}

export async function retrieveFounderArchive(
  query: FounderArchiveQuery,
  authenticatedUserId: string | undefined,
  adapter: FounderArchiveSearchAdapter,
): Promise<FounderArchiveRecord[]> {
  assertFounderArchiveAccess({
    authenticatedUserId,
    ownerId: query.ownerId,
    purpose: "retrieve",
  });

  const limit = Math.max(1, Math.min(query.limit ?? 12, 50));
  return adapter.search({
    ownerId: query.ownerId,
    query: query.query,
    limit,
    includeKinds: query.includeKinds,
  });
}

export function buildHoloGPTFounderContext(records: FounderArchiveRecord[]): string {
  return records
    .map((record) => `# ${record.title}\n${record.summary}\nTags: ${record.tags.join(", ")}`)
    .join("\n\n");
}
