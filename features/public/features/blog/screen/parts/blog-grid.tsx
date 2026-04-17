"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { HashnodePost } from "@/lib/services/types";
import { EmptyState } from "@/features/public/ui/empty-state/empty-state";
import { BlogListCard } from "./blog-list-card";

export function BlogGrid({ posts }: { posts: HashnodePost[] }) {
  const [active, setActive] = useState<string | null>(null);

  const tags = useMemo(() => {
    const set = new Map<string, string>();
    for (const p of posts) for (const t of p.tags) set.set(t.slug, t.name);
    return Array.from(set.entries()).map(([slug, name]) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [posts]);

  const filtered = useMemo(() => {
    if (!active) return posts;
    return posts.filter((p) => p.tags.some((t) => t.slug === active));
  }, [posts, active]);

  return (
    <div className="px-6 md:px-10 lg:px-12 py-10">
      {tags.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1">
          <Pill active={active === null} onClick={() => setActive(null)} label="all" />
          {tags.splice(0, 7).map((t) => (
            <Pill
              key={t.slug}
              active={active === t.slug}
              onClick={() => setActive(active === t.slug ? null : t.slug)}
              label={`#${t.name}`}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState>$ no posts match this filter.</EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BlogListCard post={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className="px-3 py-1.5 text-[11px] tracking-wide whitespace-nowrap shrink-0 cursor-pointer"
      style={{
        fontFamily: "var(--font-mono)",
        color: active ? "var(--bg)" : "var(--ink-2)",
        background: active ? "var(--ink)" : "transparent",
        border: `1px dashed ${active ? "var(--ink)" : "var(--border)"}`,
        borderRadius: 2,
      }}
    >
      {label}
    </motion.button>
  );
}
