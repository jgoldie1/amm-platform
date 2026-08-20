import { bearerToken, verifySupabaseUser } from '@/lib/supabase/user-rest';

export interface FounderArchiveAccessContext {
  authenticatedUserId?: string;
  ownerId: string;
  serviceRole?: boolean;
  purpose: 'ingest' | 'retrieve' | 'admin';
}

export function assertFounderArchiveAccess(context: FounderArchiveAccessContext): void {
  if (context.serviceRole) return;
  if (!context.authenticatedUserId || context.authenticatedUserId !== context.ownerId) {
    throw new Error('FOUNDER_ARCHIVE_ACCESS_DENIED');
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

export async function requireFounderOwner(request: Request, ownerId: string) {
  const token = bearerToken(request);
  if (!token) throw new Error('FOUNDER_ARCHIVE_AUTH_REQUIRED');
  const user = await verifySupabaseUser(token);
  if (!user) throw new Error('FOUNDER_ARCHIVE_INVALID_SESSION');

  const configuredOwnerId = process.env.FOUNDER_OWNER_USER_ID?.trim();
  if (configuredOwnerId && ownerId !== configuredOwnerId) throw new Error('FOUNDER_ARCHIVE_OWNER_MISMATCH');

  assertFounderArchiveAccess({ authenticatedUserId: user.id, ownerId, purpose: 'retrieve' });
  return user;
}
