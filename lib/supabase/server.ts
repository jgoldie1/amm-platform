import { createClient } from '@supabase/supabase-js';

function must(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

export function supabaseAdmin() {
  return createClient(
    must('NEXT_PUBLIC_SUPABASE_URL'),
    must('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export function tokenClient(jwt: string) {
  return createClient(
    must('NEXT_PUBLIC_SUPABASE_URL'),
    must('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${jwt}` } }
    }
  );
}
