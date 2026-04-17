import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Build-time / static-generation client — no cookies, no session.
 *
 * Next.js `generateStaticParams` runs outside the request lifecycle, so it
 * cannot call `cookies()`. This client uses the anon key directly with no
 * session persistence. Safe for public-read-only calls during build.
 */
let cached: SupabaseClient | null = null;

export function getBuildDb(): SupabaseClient {
  if (cached) return cached;

  cached = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
  return cached;
}
