import { NextResponse } from "next/server";

/**
 * Preflight OPTIONS handler for public API routes.
 * Pairs with the global CORS headers configured in next.config.ts.
 *
 * Usage in a route.ts:
 *   export { corsPreflight as OPTIONS } from "@/lib/api/cors";
 */
export function corsPreflight(): Response {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, HEAD, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
    },
  });
}
