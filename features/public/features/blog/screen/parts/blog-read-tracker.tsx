"use client";

import { useEffect, useRef } from "react";

export function BlogReadTracker({ slug, title }: { slug: string; title: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "blog_read", post_slug: slug, post_title: title }),
      keepalive: true,
    }).catch(() => {});
  }, [slug, title]);
  return null;
}
