export interface FounderArchiveAccessContext {
  authenticatedUserId?: string;
  ownerId: string;
  serviceRole?: boolean;
  purpose: "ingest" | "retrieve" | "admin";
}

export function assertFounderArchiveAccess(context: FounderArchiveAccessContext): void {
  if (context.serviceRole) return;
  if (!context.authenticatedUserId || context.authenticatedUserId !== context.ownerId) {
    throw new Error("FOUNDER_ARCHIVE_ACCESS_DENIED");
  }
}

export function canFounderArchiveRead(context: FounderArchiveAccessContext): boolean {
  try {
    assertFounderArchiveAccess(context);
    return true;
  } catch {
    return false;
  }
}
