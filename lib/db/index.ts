/**
 * db — database abstraction layer
 *
 * Services import from here, never from supabase directly.
 * Swap the underlying client here without touching any service.
 *
 * Two exports:
 *   - getDb()        → async, server-side only (cookies, SSR, API routes, Server Actions)
 *   - getBrowserDb() → sync, client-side only (storage uploads, browser components)
 *
 * IMPORTANT: getDb() must never be imported in client components — it pulls in
 * next/headers which is server-only. Use getBrowserDb() in client components instead.
 */

export { getDb } from "./server";
export { getBrowserDb } from "./browser";
export type { Db } from "./server";
