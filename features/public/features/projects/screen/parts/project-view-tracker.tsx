"use client";

import { useEffect, useRef } from "react";

export function ProjectViewTracker({ slug }: { slug: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "project_interaction",
        project_slug: slug,
        interaction_type: "view",
      }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);
  return null;
}

type InteractionType = "link_click" | "github_click" | "live_click";

export function useLogProjectInteraction() {
  return (slug: string, kind: InteractionType) => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "project_interaction",
        project_slug: slug,
        interaction_type: kind,
      }),
      keepalive: true,
    }).catch(() => {});
  };
}
