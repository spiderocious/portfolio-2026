"use client";

import { motion } from "motion/react";
import type { ActivityEntry, ActivityType } from "@/lib/services/types";
import { SectionTitle } from "@/features/public/ui/section-title/section-title";
import { SectionLabel } from "@/features/public/ui/section-label/section-label";
import { ScrollReveal } from "@/features/public/ui/scroll-reveal/scroll-reveal";

interface ActivitySectionProps {
  activity: ActivityEntry[];
}

export function ActivitySection({ activity }: ActivitySectionProps) {
  if (activity.length === 0) return null;

  return (
    <section className="px-6 md:px-10 lg:px-12 pb-16">
      <SectionTitle label="/activity" href="/activity" />

      <div className="pt-4 mb-8 flex items-center justify-between gap-4">
        <SectionLabel>recent activity</SectionLabel>
        <LivePill />
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
          {/* Timeline line */}
          <span
            className="absolute left-[11px] top-3 bottom-3 w-px"
            style={{ background: "var(--border)" }}
            aria-hidden
          />
          {activity.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.05} as="li">
              <ActivityRow item={item} last={i === activity.length - 1} />
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ActivityRow({ item, last }: { item: ActivityEntry; last: boolean }) {
  const icon = iconForType(item.type);
  const color = colorForType(item.type);
  const when = formatRelative(item.created_at);

  const body = (
    <div className="relative flex items-start gap-4 py-3">
      {/* Dot */}
      <span
        className="relative z-10 mt-1 w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
        style={{
          background: "var(--bg)",
          border: `1px solid ${color}`,
          color,
        }}
      >
        {icon}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p
            className="text-[14px] leading-[1.4] truncate max-w-[60ch]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
          >
            {item.title}
          </p>
          <span
            className="text-[11px] tracking-wide whitespace-nowrap"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
          >
            {when}
          </span>
        </div>
        {item.description && (
          <p
            className="text-[13px] mt-1 line-clamp-1"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}
          >
            {item.description}
          </p>
        )}
        <p
          className="text-[10px] mt-1 tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-mono)", color }}
        >
          {labelForType(item.type)}
        </p>
      </div>
    </div>
  );

  if (!item.url) return <div className={last ? "" : "border-b border-dashed"} style={{ borderColor: "var(--border-soft)" }}>{body}</div>;

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noreferrer noopener"
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2 }}
      className={`block ${last ? "" : "border-b border-dashed"}`}
      style={{ borderColor: "var(--border-soft)" }}
    >
      {body}
    </motion.a>
  );
}

function LivePill() {
  return (
    <span
      className="inline-flex items-center gap-2 px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase"
      style={{
        fontFamily: "var(--font-mono)",
        color: "#4ade80",
        border: "1px solid rgba(74,222,128,0.4)",
        borderRadius: 2,
      }}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: "#4ade80" }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      live
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────

function iconForType(type: ActivityType) {
  switch (type) {
    case "commit":
      return <GitIcon />;
    case "blog_post":
      return <QuillIcon />;
    case "project_update":
      return <SparkIcon />;
    case "experiment":
      return <FlaskIcon />;
    default:
      return <DotIcon />;
  }
}

function labelForType(type: ActivityType): string {
  switch (type) {
    case "commit":
      return "commit";
    case "blog_post":
      return "blog post";
    case "project_update":
      return "project update";
    case "experiment":
      return "experiment";
    case "note":
      return "note";
  }
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

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const min = 60_000, hr = 3_600_000, day = 86_400_000;
  if (diff < hr) return `${Math.max(1, Math.floor(diff / min))}m ago`;
  if (diff < day) return `${Math.floor(diff / hr)}h ago`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function GitIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <circle cx="2.5" cy="2.5" r="1.2" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="2.5" cy="7.5" r="1.2" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="7.5" cy="5" r="1.2" stroke="currentColor" strokeWidth="0.9" />
      <path d="M2.5 3.7v2.6M3.7 2.5h2A1.3 1.3 0 017 3.8v.2" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

function QuillIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 8L8 2M6 2h2v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M5 1v8M1 5h8M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M4 1h2v3l2 4a1 1 0 01-1 1.5H3a1 1 0 01-1-1.5l2-4V1z" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

function DotIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <circle cx="5" cy="5" r="1.5" fill="currentColor" />
    </svg>
  );
}
