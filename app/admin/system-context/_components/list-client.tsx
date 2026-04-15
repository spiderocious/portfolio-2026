"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SetTopbarActions } from "../../_components/set-topbar-actions";
import { Toggle } from "../../_components/toggle";
import { ConfirmDialog } from "../../_components/confirm-dialog";
import { toggleContextActiveAction, deleteContextEntryAction } from "../actions";
import type { SystemContextEntry, ContextCategory } from "@/lib/services/types";

interface Props {
  entries: SystemContextEntry[];
  categoryBadge: Record<NonNullable<ContextCategory>, string>;
}

export function SystemContextListClient({ entries, categoryBadge }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);

  function handleToggle(id: string, isActive: boolean) {
    startTransition(async () => {
      await toggleContextActiveAction(id, isActive);
      router.refresh();
    });
  }

  const activeEntries = entries.filter((e) => e.is_active);
  const assembled = activeEntries.map((e) => e.content).join("\n\n");

  return (
    <>
      <SetTopbarActions>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="h-8 px-3.5 font-mono text-[11px] text-a-ink-4 bg-transparent border border-a-border-hov rounded hover:border-a-border-act hover:text-a-ink-3 transition-colors duration-150"
          >
            preview prompt
          </button>
          <Link
            href="/admin/system-context/new"
            className="h-8 px-3.5 font-mono text-[11px] font-medium bg-a-btn text-a-base hover:bg-a-btn-hov transition-colors duration-150 rounded flex items-center"
          >
            new entry +
          </Link>
        </div>
      </SetTopbarActions>

      <div className="mb-3 pb-2 border-b border-a-border-sub">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-a-ink-8">system context entries</p>
      </div>

      <div className="bg-a-card border border-a-border rounded-md overflow-hidden">
        <div className="grid bg-a-surface h-9 border-b border-a-border-sub" style={{ gridTemplateColumns: "48px 1fr 120px 80px 80px" }}>
          {["pos", "label", "category", "active", "actions"].map((h, i) => (
            <div
              key={h}
              className={["font-mono text-[9px] uppercase tracking-[0.14em] text-a-ink-7 font-medium flex items-center px-4", i === 4 ? "justify-end" : ""].join(" ")}
            >
              {h}
            </div>
          ))}
        </div>

        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-[120px]">
            <p className="font-mono text-[11px] text-a-ink-7">no context entries yet.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={[
                "grid h-12 border-b border-[#191919] last:border-b-0 hover:bg-white/[0.02] transition-colors duration-100 items-center",
                !entry.is_active ? "opacity-45" : "",
              ].join(" ")}
              style={{ gridTemplateColumns: "48px 1fr 120px 80px 80px" }}
            >
              <div className="px-4">
                <span className="font-mono text-[11px] text-a-ink-8">{entry.position}</span>
              </div>
              <div className="px-4">
                <span className="font-mono text-[12px] text-a-ink-3">{entry.label}</span>
              </div>
              <div className="px-4">
                {entry.category ? (
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${categoryBadge[entry.category]}`}>
                    {entry.category}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-a-ink-8">—</span>
                )}
              </div>
              <div className="px-4">
                <Toggle
                  checked={entry.is_active}
                  onChange={(v) => handleToggle(entry.id, v)}
                />
              </div>
              <div className="px-4 flex items-center gap-1 justify-end">
                <Link
                  href={`/admin/system-context/${entry.id}`}
                  className="w-7 h-7 flex items-center justify-center text-a-ink-6 hover:text-a-ink-4 transition-colors duration-150"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2L12 4.5L4.5 12H2v-2.5L9.5 2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /></svg>
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ id: entry.id, label: entry.label })}
                  className="w-7 h-7 flex items-center justify-center text-a-ink-6 hover:text-a-red transition-colors duration-150 bg-transparent border-none cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2.5h4V4M3 4l1 8h6l1-8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmDialog
          title="delete context entry?"
          body={`this will permanently delete "${deleteTarget.label}". this cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteContextEntryAction(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}

      {/* Preview modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-[2px]">
          <div className="w-[680px] max-h-[80vh] bg-a-surface border border-a-border-hov rounded-md flex flex-col">
            {/* Modal header */}
            <div className="h-12 flex items-center justify-between px-5 border-b border-a-border-sub flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] font-medium text-a-ink-4">assembled system prompt</span>
                <span className="font-mono text-[10px] text-a-ink-7 bg-[#1a1a1a] border border-[#222] rounded px-2 py-0.5">
                  {activeEntries.length} entries · active only
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-a-ink-7 hover:text-a-ink-4 transition-colors bg-transparent border-none cursor-pointer font-mono text-[16px]"
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="bg-a-base border border-a-border-sub rounded p-4">
                {activeEntries.length === 0 ? (
                  <p className="font-mono text-[12px] text-a-ink-7">no active entries.</p>
                ) : (
                  activeEntries.map((entry, i) => (
                    <div key={entry.id}>
                      {i > 0 && (
                        <p className="font-mono text-[10px] text-a-ink-8 my-2">— {entry.label} —</p>
                      )}
                      <pre className="font-mono text-[12px] text-a-ink-4 leading-[1.7] whitespace-pre-wrap">
                        {entry.content}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
