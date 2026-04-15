"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SetTopbarActions } from "../../_components/set-topbar-actions";
import { Toggle } from "../../_components/toggle";
import { MarkdownEditor } from "../../_components/markdown-editor";
import { ConfirmDialog } from "../../_components/confirm-dialog";
import {
  createBoardItemAction,
  updateBoardItemAction,
  deleteBoardItemAction,
  createSubItemAction,
  updateSubItemAction,
  deleteSubItemAction,
} from "../actions";
import type { BoardItem, BoardGrouped, BoardStatus, BoardCategory, BoardPriority, SubItem } from "@/lib/services/types";

const COLUMNS: { key: BoardStatus; label: string }[] = [
  { key: "backlog",     label: "backlog"     },
  { key: "in_progress", label: "in progress" },
  { key: "done",        label: "done"        },
  { key: "on_hold",     label: "on hold"     },
];

const categoryBadge: Record<BoardCategory, string> = {
  goal:     "bg-[#0e1a2a] border-[#1a3a5c] text-a-blue",
  project:  "bg-[#0e2a1a] border-[#1a5c30] text-a-green",
  learning: "bg-[#1a1a0e] border-[#5c4a00] text-[#facc15]",
  idea:     "bg-[#1a0e1a] border-[#4a1a5c] text-[#c084fc]",
  other:    "bg-[#1a1a1a] border-[#2a2a2a] text-a-ink-4",
};

const priorityDot: Record<BoardPriority, string> = {
  high:   "bg-a-red",
  medium: "bg-a-orange",
  low:    "bg-a-ink-6",
};

const statusDot: Record<BoardStatus, string> = {
  backlog:     "bg-a-ink-6",
  in_progress: "bg-a-blue",
  done:        "bg-a-green",
  on_hold:     "bg-a-orange",
};

interface BoardItemFormData {
  title: string;
  description: string;
  status: BoardStatus;
  category: BoardCategory;
  priority: BoardPriority | "";
  due_date: string;
  is_private: boolean;
}

const defaultFormData = (status: BoardStatus = "backlog"): BoardItemFormData => ({
  title: "",
  description: "",
  status,
  category: "other",
  priority: "",
  due_date: "",
  is_private: false,
});

function formatDueDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

interface BoardClientProps {
  initial: BoardGrouped;
}

export function BoardClient({ initial }: BoardClientProps) {
  const router = useRouter();
  const [grouped, setGrouped] = useState<BoardGrouped>(initial);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"new" | "edit">("new");
  const [editingItem, setEditingItem] = useState<BoardItem | null>(null);
  const [form, setForm] = useState<BoardItemFormData>(defaultFormData());
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [addSubItemFor, setAddSubItemFor] = useState<string | null>(null);
  const [subForm, setSubForm] = useState({ title: "", description: "", status: "backlog" as BoardStatus, is_private: false });

  function openNewPanel(status: BoardStatus = "backlog") {
    setForm(defaultFormData(status));
    setEditingItem(null);
    setPanelMode("new");
    setPanelOpen(true);
  }

  function openEditPanel(item: BoardItem) {
    setForm({
      title: item.title,
      description: item.description ?? "",
      status: item.status,
      category: item.category,
      priority: item.priority ?? "",
      due_date: item.due_date?.slice(0, 10) ?? "",
      is_private: item.is_private,
    });
    setEditingItem(item);
    setPanelMode("edit");
    setPanelOpen(true);
  }

  function handlePanelSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("title", form.title);
    fd.set("description", form.description);
    fd.set("status", form.status);
    fd.set("category", form.category);
    fd.set("priority", form.priority);
    fd.set("due_date", form.due_date);
    fd.set("is_private", String(form.is_private));

    startTransition(async () => {
      if (panelMode === "new") {
        await createBoardItemAction(fd);
      } else if (editingItem) {
        await updateBoardItemAction(editingItem.id, fd);
      }
      setPanelOpen(false);
      router.refresh();
    });
  }

  function handleDelete(id: string, title: string) {
    setDeleteTarget({ id, title });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      await deleteBoardItemAction(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  function handleAddSubItem(parentId: string) {
    startTransition(async () => {
      await createSubItemAction(parentId, {
        title: subForm.title,
        description: subForm.description || null,
        status: subForm.status,
        is_private: subForm.is_private,
      });
      setAddSubItemFor(null);
      setSubForm({ title: "", description: "", status: "backlog", is_private: false });
      router.refresh();
    });
  }

  function handleDeleteSubItem(id: string) {
    startTransition(async () => {
      await deleteSubItemAction(id);
      router.refresh();
    });
  }

  const allItems = [
    ...grouped.backlog,
    ...grouped.in_progress,
    ...grouped.done,
    ...grouped.on_hold,
  ];

  const inputCls = "w-full h-10 bg-a-surface border border-[#222222] rounded px-3 font-mono text-[13px] text-a-ink-2 placeholder:text-a-ink-8 outline-none focus:border-a-border-act transition-all duration-150";
  const selectCls = [inputCls, "cursor-pointer appearance-none"].join(" ");

  return (
    <>
      <SetTopbarActions>
        <button
          type="button"
          onClick={() => openNewPanel()}
          className="h-8 px-3.5 font-mono text-[11px] font-medium bg-a-btn text-a-base hover:bg-a-btn-hov transition-colors duration-150 rounded"
        >
          new item +
        </button>
      </SetTopbarActions>

      {/* Board */}
      <div className="overflow-x-auto pb-4">
        <div className="grid gap-3 min-w-[1100px]" style={{ gridTemplateColumns: "repeat(4, minmax(280px, 1fr))" }}>
          {COLUMNS.map((col) => {
            const items = grouped[col.key];
            return (
              <div key={col.key}>
                {/* Column header */}
                <div className="h-10 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-a-ink-6">
                      {col.label}
                    </span>
                    <span className="font-mono text-[10px] text-a-ink-8 bg-[#1a1a1a] border border-[#222] rounded-full px-2 py-0.5">
                      {items.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openNewPanel(col.key)}
                    className="w-6 h-6 flex items-center justify-center font-mono text-[14px] text-a-ink-8 hover:text-a-ink-4 transition-colors duration-150 bg-transparent border-none cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Column body */}
                <div className="bg-white/[0.01] border border-a-border-sub rounded-md p-2 min-h-[200px] flex flex-col gap-1.5">
                  {items.map((item) => (
                    <BoardCard
                      key={item.id}
                      item={item}
                      expanded={expandedId === item.id}
                      onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      onEdit={() => openEditPanel(item)}
                      onDelete={() => handleDelete(item.id, item.title)}
                      addSubItemFor={addSubItemFor}
                      onAddSubItem={() => setAddSubItemFor(item.id)}
                      onCancelSubItem={() => setAddSubItemFor(null)}
                      subForm={subForm}
                      onSubFormChange={setSubForm}
                      onSubmitSubItem={() => handleAddSubItem(item.id)}
                      onDeleteSubItem={handleDeleteSubItem}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-in panel */}
      {panelOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setPanelOpen(false)}
          />
          <div className="fixed right-0 top-[52px] h-[calc(100vh-52px)] w-[440px] bg-a-card border-l border-a-border z-[60] overflow-y-auto p-7">
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[13px] font-medium text-a-ink">
                {panelMode === "new" ? "new item" : "edit item"}
              </span>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-a-ink-7 hover:text-a-ink-4 transition-colors duration-150 bg-transparent border-none cursor-pointer font-mono text-[16px]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePanelSubmit} className="flex flex-col gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-a-ink-6 mb-1.5 block">title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Item title" required className={inputCls} />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-a-ink-6 mb-1.5 block">description</label>
                <MarkdownEditor value={form.description} onChange={(v) => setForm({ ...form, description: v })} height={180} placeholder="describe the item..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-a-ink-6 mb-1.5 block">status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BoardStatus })} className={selectCls}>
                    <option value="backlog">backlog</option>
                    <option value="in_progress">in progress</option>
                    <option value="done">done</option>
                    <option value="on_hold">on hold</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-a-ink-6 mb-1.5 block">category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as BoardCategory })} className={selectCls}>
                    <option value="goal">goal</option>
                    <option value="project">project</option>
                    <option value="learning">learning</option>
                    <option value="idea">idea</option>
                    <option value="other">other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-a-ink-6 mb-1.5 block">priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as BoardPriority | "" })} className={selectCls}>
                    <option value="">none</option>
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-a-ink-6 mb-1.5 block">due date</label>
                  <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className={inputCls} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Toggle checked={form.is_private} onChange={(v) => setForm({ ...form, is_private: v })} size="sm" />
                <span className="font-mono text-[10px] text-a-ink-6">hide from public board</span>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className={["w-full h-10 font-mono text-[12px] font-medium rounded border-none mt-2 transition-colors duration-150", isPending ? "bg-a-btn-dis text-a-base cursor-not-allowed" : "bg-a-btn text-a-base hover:bg-a-btn-hov cursor-pointer"].join(" ")}
              >
                {isPending ? "saving..." : panelMode === "new" ? "create item" : "save changes"}
              </button>
            </form>
          </div>
        </>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmDialog
          title="delete board item?"
          body={`this will permanently delete "${deleteTarget.title}". this cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

interface BoardCardProps {
  item: BoardItem;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  addSubItemFor: string | null;
  onAddSubItem: () => void;
  onCancelSubItem: () => void;
  subForm: { title: string; description: string; status: BoardStatus; is_private: boolean };
  onSubFormChange: (v: { title: string; description: string; status: BoardStatus; is_private: boolean }) => void;
  onSubmitSubItem: () => void;
  onDeleteSubItem: (id: string) => void;
}

function BoardCard({ item, expanded, onToggle, onEdit, onDelete, addSubItemFor, onAddSubItem, onCancelSubItem, subForm, onSubFormChange, onSubmitSubItem, onDeleteSubItem }: BoardCardProps) {
  const inputCls = "w-full bg-a-surface border border-[#222222] rounded px-3 font-mono text-[12px] text-a-ink-2 placeholder:text-a-ink-8 outline-none focus:border-a-border-act transition-all duration-150";

  return (
    <div
      className={[
        "bg-a-card border rounded p-3 cursor-pointer transition-colors duration-150",
        item.is_private ? "opacity-55" : "",
        expanded ? "border-a-border-hov" : "border-a-border hover:border-a-border-hov hover:bg-[#161616]",
      ].join(" ")}
      onClick={onToggle}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${categoryBadge[item.category]}`}>
            {item.category}
          </span>
          {item.is_private && (
            <span className="text-a-ink-6 text-[10px]">🔒</span>
          )}
        </div>
        {item.priority && (
          <div className={`w-1.5 h-1.5 rounded-full ${priorityDot[item.priority]}`} />
        )}
      </div>

      {/* Title */}
      <p className="font-mono text-[12px] font-medium text-a-ink-3 leading-snug line-clamp-2">
        {item.title}
      </p>

      {/* Due date */}
      {item.due_date && (
        <p className="font-mono text-[10px] text-a-ink-7 mt-1.5">
          due {formatDueDate(item.due_date)}
        </p>
      )}

      {/* Sub-items count */}
      {!expanded && item.sub_items.length > 0 && (
        <p className="font-mono text-[10px] text-a-ink-7 mt-1 text-right">
          {item.sub_items.length} sub-item{item.sub_items.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Expanded state */}
      {expanded && (
        <div onClick={(e) => e.stopPropagation()}>
          {item.description && (
            <div className="mt-2.5 pt-2.5 border-t border-a-border-sub">
              <p className="font-mono text-[11px] text-a-ink-4 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>
          )}

          {/* Sub-items */}
          {(item.sub_items.length > 0 || addSubItemFor === item.id) && (
            <div className="mt-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-a-ink-8 mb-1.5">sub-items</p>
              {item.sub_items.map((sub) => (
                <SubItemRow key={sub.id} sub={sub} onDelete={() => onDeleteSubItem(sub.id)} />
              ))}

              {/* Add sub-item form */}
              {addSubItemFor === item.id && (
                <div
                  className="bg-a-surface border border-a-border rounded p-3 mt-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={subForm.title}
                    onChange={(e) => onSubFormChange({ ...subForm, title: e.target.value })}
                    placeholder="Sub-item title"
                    className={[inputCls, "h-9 mb-2"].join(" ")}
                  />
                  <textarea
                    value={subForm.description}
                    onChange={(e) => onSubFormChange({ ...subForm, description: e.target.value })}
                    placeholder="description..."
                    rows={3}
                    className={[inputCls, "py-2 resize-none mb-2"].join(" ")}
                    style={{ height: "80px" }}
                  />
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center gap-2">
                      <Toggle checked={subForm.is_private} onChange={(v) => onSubFormChange({ ...subForm, is_private: v })} size="sm" />
                      <span className="font-mono text-[10px] text-a-ink-6">private</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={onCancelSubItem} className="font-mono text-[11px] text-a-ink-7 hover:text-a-ink-4 transition-colors bg-transparent border-none cursor-pointer">cancel</button>
                      <button type="button" onClick={onSubmitSubItem} className="h-8 px-3.5 font-mono text-[11px] bg-a-btn text-a-base hover:bg-a-btn-hov rounded border-none cursor-pointer transition-colors">add</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Card actions */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-a-border-sub">
            <button
              type="button"
              onClick={onAddSubItem}
              className="font-mono text-[10px] text-a-ink-7 hover:text-a-ink-4 transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              + add sub-item
            </button>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onEdit} className="font-mono text-[10px] text-a-ink-6 hover:text-a-ink-4 transition-colors bg-transparent border-none cursor-pointer p-0">edit</button>
              <button type="button" onClick={onDelete} className="font-mono text-[10px] text-a-ink-6 hover:text-a-red transition-colors bg-transparent border-none cursor-pointer p-0">delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SubItemRow({ sub, onDelete }: { sub: SubItem; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-2 h-8">
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[sub.status]}`} />
      <span className="font-mono text-[11px] text-a-ink-4 flex-1 truncate">{sub.title}</span>
      {sub.is_private && <span className="font-mono text-[10px] text-a-ink-7">🔒</span>}
      <button
        type="button"
        onClick={onDelete}
        className="w-3 h-3 flex items-center justify-center text-a-ink-8 hover:text-a-red transition-colors bg-transparent border-none cursor-pointer font-mono text-[12px] flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
}
