/**
 * db — database abstraction layer
 *
 * Services import from here, never from supabase directly.
 * Swap the underlying client here without touching any service.
 *
 * Two exports:
 *   - getDb()      → async, server-side (cookies, SSR, API routes, Server Actions)
 *   - getBrowserDb() → sync, client-side (storage uploads, browser components)
 */

export { getDb, getBrowserDb } from "./client";
export type { Db } from "./client";
