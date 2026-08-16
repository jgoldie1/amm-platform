import type { NextRequest } from 'next/server';
import { tokenClient } from '@/lib/supabase/server';

export async function requireUser(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const { data, error } = await tokenClient(token).auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}
