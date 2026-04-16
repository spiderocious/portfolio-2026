import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Db = SupabaseClient;

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser db — call inside client components (e.g. storage uploads).
 * Session is managed via the server; this client is for browser-safe operations.
 */
export function getBrowserDb(): Db {
  return createBrowserClient(URL, ANON_KEY);
}
