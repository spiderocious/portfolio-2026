"use client";

import { motion } from "motion/react";
import { useLogProjectInteraction } from "./project-view-tracker";

interface ProjectLinksRowProps {
  slug: string;
  links: Record<string, string | undefined>;
}

export function ProjectLinksRow({ slug, links }: ProjectLinksRowProps) {
  const log = useLogProjectInteraction();
  const entries = Object.entries(links).filter(([, v]) => !!v) as [string, string][];
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {entries.map(([key, href]) => {
        const kind =
          key === "github" ? "github_click" : key === "deployed" ? "live_click" : "link_click";
        return (
          <motion.a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => log(slug, kind)}
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-2 text-[12px] tracking-wide"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--ink)",
              background: "var(--bg-raised)",
              border: "1px dashed var(--border)",
              borderRadius: 2,
            }}
          >
            <IconFor type={key} />
            {labelFor(key)}
            <span style={{ color: "var(--ink-4)" }}>↗</span>
          </motion.a>
        );
      })}
    </div>
  );
}

function labelFor(key: string) {
  switch (key) {
    case "github":
      return "github";
    case "deployed":
      return "live site";
    case "demo":
      return "demo";
    case "producthunt":
      return "product hunt";
    default:
      return key;
  }
}

function IconFor({ type }: { type: string }) {
  if (type === "github")
    return (
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
        <path d="M7 1a6 6 0 00-1.9 11.7c0.3 0.05 0.4-0.1 0.4-0.3v-1.1c-1.6 0.3-2-0.7-2-0.7-0.3-0.7-0.7-0.9-0.7-0.9-0.5-0.4 0-0.4 0-0.4 0.6 0 0.9 0.6 0.9 0.6 0.5 0.9 1.3 0.6 1.7 0.5 0-0.4 0.2-0.6 0.4-0.8-1.3-0.1-2.6-0.6-2.6-2.9 0-0.6 0.2-1.1 0.6-1.5-0.1-0.2-0.3-0.8 0-1.6 0 0 0.5-0.1 1.6 0.6 0.5-0.1 1-0.2 1.5-0.2s1 0.1 1.5 0.2c1.1-0.7 1.6-0.6 1.6-0.6 0.3 0.8 0.1 1.4 0 1.6 0.4 0.4 0.6 0.9 0.6 1.5 0 2.2-1.4 2.7-2.6 2.9 0.2 0.2 0.4 0.5 0.4 1v1.5c0 0.2 0.1 0.3 0.4 0.3A6 6 0 007 1z" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    );
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1" />
      <path d="M2 7h10M7 2c1.6 1.9 1.6 8 0 10M7 2c-1.6 1.9-1.6 8 0 10" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
