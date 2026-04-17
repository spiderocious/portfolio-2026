"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Fires a POST to /api/analytics on mount. Safe to render once per page.
 * Deduplicates per path within the same session to avoid double-counts from
 * React strict mode or fast nav.
 */
export function usePageView() {
  const pathname = usePathname();
  const fired = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!pathname) return;
    if (fired.current.has(pathname)) return;
    fired.current.add(pathname);

    const payload = {
      type: "page_view",
      page: pathname,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    };

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);
}
