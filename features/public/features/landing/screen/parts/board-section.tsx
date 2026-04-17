"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { BoardGrouped, BoardItem, BoardCategory, BoardStatus } from "@/lib/services/types";
import { SectionTitle } from "@/features/public/ui/section-title/section-title";
import { SectionLabel } from "@/features/public/ui/section-label/section-label";
import { ScrollReveal } from "@/features/public/ui/scroll-reveal/scroll-reveal";

interface BoardSectionProps {
  board: BoardGrouped;
}

const COLUMNS: { key: BoardStatus; label: string }[] = [
  { key: "backlog", label: "backlog" },
  { key: "in_progress", label: "in progress" },
  { key: "done", label: "done" },
  { key: "on_hold", label: "on hold" },
];

export function BoardSection({ board }: BoardSectionProps) {
  const total =
    board.backlog.length +
    board.in_progress.length +
    board.done.length +
    board.on_hold.length;

  if (total === 0) return null;

  return (
    <section className="px-6 md:px-10 lg:px-12 pb-16">
      <SectionTitle label="/board" href="/board" />

      <div className="pt-4 mb-8 flex items-center justify-between gap-4">
        <SectionLabel>current focus</SectionLabel>
        <Link
          href="/board"
          className="text-[11px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}
        >
          full board →
        </Link>
      </div>

      <div
        className="overflow-x-auto -mx-6 md:-mx-10 lg:-mx-12 px-6 md:px-10 lg:px-12 pb-2"
      >
        <div className="grid grid-flow-col auto-cols-[minmax(260px,1fr)] md:auto-cols-fr gap-4 md:gap-5">
          {COLUMNS.map((col, ci) => (
            <ScrollReveal key={col.key} delay={ci * 0.06}>
              <BoardColumn label={col.label} items={board[col.key].slice(0, 3)} status={col.key} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BoardColumn({
  label,
  items,
  status,
}: {
  label: string;
  items: BoardItem[];
  status: BoardStatus;
}) {
  return (
    <div
      className="p-4 flex flex-col gap-3 min-h-[220px]"
      style={{
        border: "1px dashed var(--border)",
        borderRadius: 2,
        background: "var(--bg-raised)",
      }}
    >
      <header className="flex items-center justify-between pb-2" style={{ borderBottom: "1px dashed var(--border-soft)" }}>
        <span
          className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}
        >
          <StatusDot status={status} />
          {label}
        </span>
        <span
          className="text-[10px] tabular-nums"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
        >
          {items.length.toString().padStart(2, "0")}
        </span>
      </header>

      <div className="flex flex-col gap-2.5 flex-1">
        {items.length === 0 ? (
          <p
            className="text-[11px] py-4 text-center"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
          >
            — empty —
          </p>
        ) : (
          items.map((item) => <BoardCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}

function BoardCard({ item }: { item: BoardItem }) {
  const catColor = colorForCategory(item.category);
  return (
    <motion.div
      whileHover={{ y: -2, borderColor: "var(--ink-3)" }}
      transition={{ duration: 0.2 }}
      className="relative p-3"
      style={{
        border: "1px solid var(--border-soft)",
        background: "var(--bg)",
        borderRadius: 2,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="text-[9px] tracking-[0.25em] uppercase px-1.5 py-0.5"
          style={{
            fontFamily: "var(--font-mono)",
            color: catColor,
            border: `1px solid ${catColor}40`,
            borderRadius: 2,
          }}
        >
          {item.category}
        </span>
        {item.priority === "high" && (
          <span
            className="text-[9px] tracking-[0.2em]"
            style={{ fontFamily: "var(--font-mono)", color: "#f87171" }}
          >
            HIGH
          </span>
        )}
      </div>
      <p
        className="text-[13px] leading-[1.4] line-clamp-3"
        style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
      >
        {item.title}
      </p>
      {item.sub_items.length > 0 && (
        <p
          className="text-[10px] mt-2 flex items-center gap-1"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
        >
          <ListIcon />
          {item.sub_items.length} sub-task{item.sub_items.length === 1 ? "" : "s"}
        </p>
      )}
    </motion.div>
  );
}

function StatusDot({ status }: { status: BoardStatus }) {
  const color = {
    backlog: "var(--ink-4)",
    in_progress: "#f59e0b",
    done: "#4ade80",
    on_hold: "#60a5fa",
  }[status];
  return <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />;
}

function colorForCategory(cat: BoardCategory): string {
  switch (cat) {
    case "goal":
      return "#60a5fa";
    case "project":
      return "#4ade80";
    case "learning":
      return "#f59e0b";
    case "idea":
      return "#c084fc";
    default:
      return "#9ca3af";
  }
}

function ListIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M1 2h8M1 5h8M1 8h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
