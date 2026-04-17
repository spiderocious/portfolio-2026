"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ActivityEntry, ActivityType } from "@/lib/services/types";

const TYPES: Array<{ value: ActivityType | "all"; label: string }> = [
  { value: "all", label: "all" },
  { value: "commit", label: "commits" },
  { value: "blog_post", label: "posts" },
  { value: "project_update", label: "projects" },
  { value: "experiment", label: "experiments" },
  { value: "note", label: "notes" },
];

export function ActivityFeed({
  initial,
  initialHasMore,
}: {
  initial: ActivityEntry[];
  initialHasMore: boolean;
}) {
  const [items, setItems] = useState<ActivityEntry[]>(initial);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<ActivityType | "all">("all");

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);

  async function loadMore() {
    const last = items[items.length - 1];
    if (!last) return;
    setLoading(true);
    try {
      const url = new URL("/api/activity", window.location.origin);
      url.searchParams.set("limit", "20");
      url.searchParams.set("cursor", last.created_at);
      const res = await fetch(url.toString());
      const data: { items: ActivityEntry[]; has_more: boolean } = await res.json();
      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.has_more);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-6 md:px-10 lg:px-12 py-10">
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1">
        {TYPES.map((t) => (
          <motion.button
            key={t.value}
            type="button"
            onClick={() => setFilter(t.value)}
            whileTap={{ scale: 0.96 }}
            className="px-3 py-1.5 text-[11px] tracking-wide whitespace-nowrap shrink-0 cursor-pointer"
            style={{
              fontFamily: "var(--font-mono)",
              color: filter === t.value ? "var(--bg)" : "var(--ink-2)",
              background: filter === t.value ? "var(--ink)" : "transparent",
              border: `1px dashed ${filter === t.value ? "var(--ink)" : "var(--border)"}`,
              borderRadius: 2,
            }}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      <div
        className="relative p-4 md:p-6"
        style={{
          border: "1px dashed var(--border)",
          borderRadius: 2,
          background: "var(--bg-raised)",
        }}
      >
        <ul className="relative flex flex-col">
          <span
            className="absolute left-[11px] top-3 bottom-3 w-px"
            style={{ background: "var(--border)" }}
            aria-hidden
          />
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i, 10) * 0.03 }}
              >
                <Row item={item} last={i === filtered.length - 1} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      {filter === "all" && hasMore && (
        <div className="mt-6 flex justify-center">
          <motion.button
            type="button"
            onClick={loadMore}
            disabled={loading}
            whileTap={{ scale: 0.96 }}
            className="px-4 py-2 text-[12px] tracking-wide disabled:opacity-50"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--ink)",
              border: "1px dashed var(--border)",
              borderRadius: 2,
              background: "var(--bg-raised)",
            }}
          >
            {loading ? "loading…" : "load more"}
          </motion.button>
        </div>
      )}
    </div>
  );
}

function Row({ item, last }: { item: ActivityEntry; last: boolean }) {
  const color = colorForType(item.type);
  const when = new Date(item.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const body = (
    <div className="relative flex items-start gap-4 py-3">
      <span
        className="relative z-10 mt-1 w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
        style={{
          background: "var(--bg)",
          border: `1px solid ${color}`,
          color,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p
            className="text-[14px] leading-[1.4]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
          >
            {item.title}
          </p>
          <span
            className="text-[11px] whitespace-nowrap"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
          >
            {when}
          </span>
        </div>
        {item.description && (
          <p
            className="text-[13px] mt-1"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}
          >
            {item.description}
          </p>
        )}
        <p
          className="text-[10px] mt-1 tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-mono)", color }}
        >
          {item.type.replace("_", " ")}
        </p>
      </div>
    </div>
  );

  const wrap = last ? "" : "border-b border-dashed";
  const style = { borderColor: "var(--border-soft)" };

  if (!item.url) return <div className={wrap} style={style}>{body}</div>;

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noreferrer noopener"
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2 }}
      className={`block ${wrap}`}
      style={style}
    >
      {body}
    </motion.a>
  );
}

function colorForType(type: ActivityType): string {
  switch (type) {
    case "commit":
      return "#4ade80";
    case "blog_post":
      return "#f59e0b";
    case "project_update":
      return "#60a5fa";
    case "experiment":
      return "#c084fc";
    default:
      return "var(--ink-3)";
  }
}
