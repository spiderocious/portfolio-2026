"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type {
  BoardGrouped,
  BoardItem,
  BoardCategory,
  BoardStatus,
  SubItem,
} from "@/lib/services/types";
import { MarkdownRenderer } from "@/features/public/ui/markdown-renderer/markdown-renderer";
import { ScrollReveal } from "../../../../ui/scroll-reveal/scroll-reveal";

const COLUMNS: { key: BoardStatus; label: string; color: string }[] = [
  { key: "backlog", label: "backlog", color: "var(--ink-4)" },
  { key: "in_progress", label: "in progress", color: "#f59e0b" },
  { key: "done", label: "done", color: "#4ade80" },
  { key: "on_hold", label: "on hold", color: "#60a5fa" },
];

export function FullKanban({ board, preview }: { board: BoardGrouped, preview?: boolean }) {
  const getItems = (key: BoardStatus) => preview ? board?.[key].slice(0, 3) : board?.[key];
  return (
    <div className="px-6 md:px-10 lg:px-12 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {COLUMNS.map((col, ci) => (
          <ScrollReveal key={col.key} delay={ci * 0.06}>
            <BoardColumn
              label={col.label}
              items={getItems(col.key)}
              status={col.key}
            />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

export function BoardColumn({
  label,
  items,
  status,
}: {
  label: string;
  items: BoardItem[];
  status: BoardStatus;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div
      className="p-4 flex flex-col gap-3 min-h-55"
      style={{
        border: "1px dashed var(--border)",
        borderRadius: 2,
        background: "var(--bg-raised)",
      }}
    >
      <header
        className="flex items-center justify-between pb-2"
        style={{ borderBottom: "1px dashed var(--border-soft)" }}
      >
        <span
          className="flex items-center gap-2 text-[13px] tracking-[0.2em] uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--ink)",
            fontWeight: 600,
          }}
        >
          <StatusDot status={status} />
          {label}
        </span>
        <span
          className="text-[12px] tabular-nums"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--ink-3)",
            fontWeight: 600,
          }}
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
          items.map((item) => (
            <BoardCard
              key={item.id}
              item={item}
              open={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function BoardCard({
  item,
  open,
  onToggle,
}: {
  item: BoardItem;
  open: boolean;
  onToggle: () => void;
}) {
  const catColor = colorForCategory(item.category);
  const canExpand = !!item.description || item.sub_items.length > 0;

  return (
    <motion.div
      layout
      whileHover={canExpand ? { y: -1 } : undefined}
      style={{
        border: "1px solid var(--border-soft)",
        background: "var(--bg)",
        borderRadius: 2,
        cursor: canExpand ? "pointer" : "default",
      }}
    >
      <motion.div
        whileHover={{ y: -2, borderColor: "var(--ink-3)" }}
        transition={{ duration: 0.2 }}
        onClick={onToggle}
        className={`w-full text-left p-3 relative ${canExpand ? "cursor-pointer" : "cursor-default"}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className="text-[10px] tracking-[0.25em] uppercase px-2 py-0.5"
            style={{
              fontFamily: "var(--font-mono)",
              color: catColor,
              fontWeight: 600,
              border: `1px solid ${catColor}40`,
              borderRadius: 2,
            }}
          >
            {item.category}
          </span>
          {item.priority === "high" && (
            <span
              className="text-[10px] tracking-[0.2em]"
              style={{
                fontFamily: "var(--font-mono)",
                color: "#f87171",
                fontWeight: 700,
              }}
            >
              HIGH
            </span>
          )}
        </div>
        <p
          className="text-[16px] md:text-[15px] leading-[1.45] line-clamp-3"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--ink)",
            fontWeight: 600,
          }}
        >
          {item.title}
        </p>
        {item.due_date && (
          <span
            className="text-[11px]"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--ink)",
              fontWeight: 600,
            }}
          >
            Due{" "}
            {new Date(item.due_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
        {item.sub_items.length > 0 && (
          <p
            className="text-[10px] mt-2 flex items-center gap-1"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--ink)",
              fontWeight: 600,
            }}
          >
            <ListIcon />
            {item.sub_items.length} sub-task
            {item.sub_items.length === 1 ? "" : "s"}
          </p>
        )}
      </motion.div>
      <AnimatePresence initial={false}>
        {open && canExpand && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="p-3 border-t border-dashed flex flex-col gap-4"
              style={{ borderColor: "var(--border)" }}
            >
              {item.description && (
                <MarkdownRenderer content={item.description} />
              )}
              {item.sub_items.length > 0 && (
                <div
                  className="border-t border-dashed pt-2"
                  style={{ borderColor: "var(--border)" }}
                >
                  <p
                    className="text-[10px] tracking-[0.25em] uppercase mb-2"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--ink)",
                    }}
                  >
                    sub-tasks
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {item.sub_items.map((sub) => (
                      <SubItemRow key={sub.id} sub={sub} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SubItemRow({ sub }: { sub: SubItem }) {
  const color = subStatusColor(sub.status);
  return (
    <li
      className="flex items-center gap-2 text-[12px]"
      style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: color }}
      />
      <span className="flex-1">{sub.title}</span>
    </li>
  );
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

function subStatusColor(s: BoardStatus): string {
  switch (s) {
    case "done":
      return "#4ade80";
    case "in_progress":
      return "#f59e0b";
    case "on_hold":
      return "#60a5fa";
    default:
      return "var(--ink-4)";
  }
}

function StatusDot({ status }: { status: BoardStatus }) {
  const color = {
    backlog: "var(--ink-4)",
    in_progress: "#f59e0b",
    done: "#4ade80",
    on_hold: "#60a5fa",
  }[status];
  return (
    <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
  );
}

function ListIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M1 2h8M1 5h8M1 8h5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
