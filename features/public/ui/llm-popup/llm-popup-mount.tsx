"use client";

import { usePathname } from "next/navigation";
import { LlmPopup } from "./llm-popup";

/**
 * Mounts the LLM popup on public pages only — not admin.
 */
export function LlmPopupMount() {
  const pathname = usePathname();
  if (!pathname) return null;
  if (pathname.startsWith("/admin")) return null;
  return <LlmPopup />;
}
