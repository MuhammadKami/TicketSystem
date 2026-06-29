/**
 * Supabase client helpers.
 *
 * The whole app is designed to run WITHOUT Supabase (it falls back to the
 * in-memory store). `isSupabaseConfigured()` lets the data layer decide which
 * backend to use at runtime.
 */

import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured() {
  return Boolean(URL && (SERVICE || ANON));
}

/** Browser-safe client (anon key). Returns null when not configured. */
export function getSupabaseBrowserClient() {
  if (!URL || !ANON) return null;
  return createClient(URL, ANON, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

/** Server client. Prefers the service-role key for full CRUD in API routes. */
export function getSupabaseServerClient() {
  if (!URL || !(SERVICE || ANON)) return null;
  return createClient(URL, SERVICE || ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
