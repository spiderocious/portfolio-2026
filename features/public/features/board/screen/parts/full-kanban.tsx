"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { BoardGrouped, BoardItem, BoardCategory, BoardStatus, SubItem } from "@/lib/services/types";
import { MarkdownRenderer } from "@/features/public/ui/markdown-renderer/markdown-renderer";

const COLUMNS: { key: BoardStatus; label: string; color: string }[] = [
  { key: "backlog", label: "backlog", color: "var(--ink-4)" },
  { key: "in_progress", label: "in progress", color: "#f59e0b" },
  { key: "done", label: "done", color: "#4ade80" },
  { key: "on_hold", label: "on hold", color: "#60a5fa" },
];

export function FullKanban({ board }: { board: BoardGrouped }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="px-6 md:px-10 lg:px-12 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {COLUMNS.map((col, ci) => (
          <motion.div
            key={col.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: ci * 0.07 }}
            className="flex flex-col gap-3 p-4 min-h-[280px]"
            style={{
              border: "1px dashed var(--border)",
              borderRadius: 2,
              background: "var(--bg-raised)",
            }}
          >
            <header
              className="flex items-center justify-between pb-3 mb-1"
              style={{ borderBottom: "1px dashed var(--border-soft)" }}
            >
              <span
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: col.color }} />
                {col.label}
              </span>
              <span
                className="text-[10px] tabular-nums"
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
              >
                {board[col.key].length.toString().padStart(2, "0")}
              </span>
            </header>

            {board[col.key].length === 0 ? (
              <p
                className="text-[11px] py-6 text-center"
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
              >
                — empty —
              </p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {board[col.key].map((item) => (
                  <BoardCard
                    key={item.id}
                    item={item}
                    open={openId === item.id}
                    onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ))}
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
      className="overflow-hidden"
      style={{
        border: "1px solid var(--border-soft)",
        background: "var(--bg)",
        borderRadius: 2,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={!canExpand}
        className={`w-full text-left p-3 ${canExpand ? "cursor-pointer" : "cursor-default"}`}
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
          <div className="flex items-center gap-2">
            {item.priority && (
              <span
                className="text-[9px] tracking-[0.2em] uppercase"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: priorityColor(item.priority),
                }}
              >
                {item.priority}
              </span>
            )}
            {canExpand && (
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[10px]"
                style={{ color: "var(--ink-4)" }}
              >
                ⌄
              </motion.span>
            )}
          </div>
        </div>

        <p
          className="text-[13px] leading-[1.4]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
        >
          {item.title}
        </p>

        <div className="flex items-center justify-between mt-2">
          {item.due_date && (
            <span
              className="text-[10px]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
            >
              due {new Date(item.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
          {item.sub_items.length > 0 && (
            <span
              className="text-[10px] ml-auto"
              style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
            >
              {item.sub_items.length} sub-task{item.sub_items.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </button>

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
              style={{ borderColor: "var(--border-soft)" }}
            >
              {item.description && <MarkdownRenderer content={item.description} />}
              {item.sub_items.length > 0 && (
                <div>
                  <p
                    className="text-[9px] tracking-[0.25em] uppercase mb-2"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
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
      style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      <span className="flex-1 truncate">{sub.title}</span>
      <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
        {sub.status.replace("_", " ")}
      </span>
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

function priorityColor(p: "low" | "medium" | "high"): string {
  if (p === "high") return "#f87171";
  if (p === "medium") return "#f59e0b";
  return "var(--ink-4)";
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
