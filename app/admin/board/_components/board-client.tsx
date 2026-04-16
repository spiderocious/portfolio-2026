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
import { inputCls, selectCls } from "../../_components/input-cls";
import { FieldLabel } from "../../_components/field-label";
import type { BoardItem, BoardGrouped, BoardStatus, BoardCategory, BoardPriority, SubItem } from "@/lib/services/types";

const COLUMNS: { key: BoardStatus; label: string }[] = [
  { key: "backlog",     label: "backlog"     },
  { key: "in_progress", label: "in progress" },
  { key: "done",        label: "done"        },
  { key: "on_hold",     label: "on hold"     },
];

const categoryBadge: Record<BoardCategory, string> = {
  goal:     "bg-blue-50 border-blue-300 text-blue-700",
  project:  "bg-[#dcfce7] border-[#4ade80] text-[#15803d]",
  learning: "bg-yellow-50 border-yellow-300 text-yellow-700",
  idea:     "bg-purple-50 border-purple-300 text-purple-700",
  other:    "bg-[#f4f4f4] border-[#d0d0d0] text-[#666]",
};

const priorityDot: Record<BoardPriority, string> = {
  high:   "bg-[#fee2e2]",
  medium: "bg-[#ffedd5]",
  low:    "bg-[#ccc]",
};

const statusDot: Record<BoardStatus, string> = {
  backlog:     "bg-[#ccc]",
  in_progress: "bg-[#dbeafe]",
  done:        "bg-[#4ade80]",
  on_hold:     "bg-[#ffedd5]",
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
  // Do NOT put `initial` in useState — router.refresh() re-renders the server
  // component with fresh data and passes new props, but useState ignores
  // subsequent prop changes after the first render. Read directly from props.
  const grouped = initial;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"new" | "edit">("new");
  const [editingItem, setEditingItem] = useState<BoardItem | null>(null);
  const [form, setForm] = useState<BoardItemFormData>(defaultFormData());
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
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
      setActionError(null);
      let result;
      if (panelMode === "new") {
        result = await createBoardItemAction(fd);
      } else if (editingItem) {
        result = await updateBoardItemAction(editingItem.id, fd);
      }
      if (result && "error" in result && result.error) {
        setActionError(result.error);
        return;
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
      const result = await deleteBoardItemAction(deleteTarget.id);
      if (result && "error" in result && result.error) {
        setActionError(result.error);
        return;
      }
      setDeleteTarget(null);
      router.refresh();
    });
  }

  function handleAddSubItem(parentId: string) {
    startTransition(async () => {
      const result = await createSubItemAction(parentId, {
        title: subForm.title,
        description: subForm.description || null,
        status: subForm.status,
        is_private: subForm.is_private,
      });
      if (result && "error" in result && result.error) {
        setActionError(result.error);
        return;
      }
      setAddSubItemFor(null);
      setSubForm({ title: "", description: "", status: "backlog", is_private: false });
      router.refresh();
    });
  }

  function handleDeleteSubItem(id: string) {
    startTransition(async () => {
      const result = await deleteSubItemAction(id);
      if (result && "error" in result && result.error) {
        setActionError(result.error);
        return;
      }
      router.refresh();
    });
  }


  return (
    <>
      <SetTopbarActions>
        <button
          type="button"
          onClick={() => openNewPanel()}
          className="h-8 px-3.5 font-mono text-[11px] font-medium bg-[#4ade80] text-black font-semibold hover:bg-[#22c55e] transition-colors duration-150 rounded"
        >
          new item +
        </button>
      </SetTopbarActions>

      {/* Error banner */}
      {actionError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
          <span className="font-mono text-[11px] text-[#ef4444]">{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="font-mono text-[12px] text-[#ef4444] hover:text-[#fca5a5] transition-colors bg-transparent border-none cursor-pointer ml-4"
          >
            ×
          </button>
        </div>
      )}

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
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#999]">
                      {col.label}
                    </span>
                    <span className="font-mono text-[10px] text-black bg-[#f4f4f4] border border-[#d0d0d0] rounded-full px-2 py-0.5">
                      {items.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openNewPanel(col.key)}
                    className="w-6 h-6 flex items-center justify-center font-mono text-[14px] text-[#666] hover:text-black transition-colors duration-150 bg-transparent border-none cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Column body */}
                <div className="bg-[#f9f9f9] border border-[#e8e8e8] rounded-md p-2 min-h-[200px] flex flex-col gap-1.5">
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
          <div className="fixed right-0 top-[52px] h-[calc(100vh-52px)] w-[440px] bg-white border-l-2 border-black z-[60] overflow-y-auto p-7">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
              <span className="font-mono text-[13px] font-black text-black uppercase tracking-[0.1em]">
                {panelMode === "new" ? "new item" : "edit item"}
              </span>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-[#999] hover:text-black transition-colors duration-150 bg-transparent border-none cursor-pointer font-mono text-[18px]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePanelSubmit} className="flex flex-col gap-4">
              <div>
                <FieldLabel>title</FieldLabel>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Item title" required className={inputCls} />
              </div>

              <div>
                <FieldLabel>description</FieldLabel>
                <MarkdownEditor value={form.description} onChange={(v) => setForm({ ...form, description: v })} height={180} placeholder="describe the item..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>status</FieldLabel>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BoardStatus })} className={selectCls}>
                    <option value="backlog">backlog</option>
                    <option value="in_progress">in progress</option>
                    <option value="done">done</option>
                    <option value="on_hold">on hold</option>
                  </select>
                </div>
                <div>
                  <FieldLabel>category</FieldLabel>
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
                  <FieldLabel>priority</FieldLabel>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as BoardPriority | "" })} className={selectCls}>
                    <option value="">none</option>
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                </div>
                <div>
                  <FieldLabel>due date</FieldLabel>
                  <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className={inputCls} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Toggle checked={form.is_private} onChange={(v) => setForm({ ...form, is_private: v })} size="sm" />
                <span className="font-mono text-[11px] font-medium text-[#666]">hide from public board</span>
              </div>

              {actionError && (
                <p className="font-mono text-[11px] text-[#ef4444] font-semibold">{actionError}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className={["w-full h-10 font-mono text-[12px] font-bold rounded border-none mt-2 transition-colors duration-150", isPending ? "bg-[#ccc] text-white cursor-not-allowed" : "bg-[#4ade80] text-black hover:bg-[#22c55e] cursor-pointer"].join(" ")}
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
  const cardInputCls = "w-full bg-white border-2 border-black rounded px-3 font-mono text-[12px] font-medium text-black placeholder:text-[#aaa] placeholder:font-normal outline-none focus:border-[#4ade80] transition-all duration-150";

  return (
    <div
      className={[
        "bg-white border rounded p-3 cursor-pointer transition-colors duration-150",
        item.is_private ? "opacity-55" : "",
        expanded ? "border-[#aaa]" : "border-[#d0d0d0] hover:border-[#aaa] hover:bg-[#f9f9f9]",
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
            <span className="text-[#999] text-[10px]">🔒</span>
          )}
        </div>
        {item.priority && (
          <div className={`w-1.5 h-1.5 rounded-full ${priorityDot[item.priority]}`} />
        )}
      </div>

      {/* Title */}
      <p className="font-mono text-[12px] font-semibold text-black leading-snug line-clamp-2">
        {item.title}
      </p>

      {/* Due date */}
      {item.due_date && (
        <p className="font-mono text-[10px] text-[#666] mt-1.5">
          due {formatDueDate(item.due_date)}
        </p>
      )}

      {/* Sub-items count */}
      {!expanded && item.sub_items.length > 0 && (
        <p className="font-mono text-[10px] text-[#666] mt-1 text-right">
          {item.sub_items.length} sub-item{item.sub_items.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Expanded state */}
      {expanded && (
        <div onClick={(e) => e.stopPropagation()}>
          {item.description && (
            <div className="mt-2.5 pt-2.5 border-t border-[#e8e8e8]">
              <p className="font-mono text-[11px] text-[#666] leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>
          )}

          {/* Sub-items */}
          {(item.sub_items.length > 0 || addSubItemFor === item.id) && (
            <div className="mt-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black mb-1.5">sub-items</p>
              {item.sub_items.map((sub) => (
                <SubItemRow key={sub.id} sub={sub} onDelete={() => onDeleteSubItem(sub.id)} />
              ))}

              {/* Add sub-item form */}
              {addSubItemFor === item.id && (
                <div
                  className="bg-[#f9f9f9] border border-[#d0d0d0] rounded p-3 mt-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={subForm.title}
                    onChange={(e) => onSubFormChange({ ...subForm, title: e.target.value })}
                    placeholder="Sub-item title"
                    className={[cardInputCls, "h-9 mb-2"].join(" ")}
                  />
                  <textarea
                    value={subForm.description}
                    onChange={(e) => onSubFormChange({ ...subForm, description: e.target.value })}
                    placeholder="description..."
                    rows={3}
                    className={[cardInputCls, "py-2 resize-none mb-2"].join(" ")}
                    style={{ height: "80px" }}
                  />
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center gap-2">
                      <Toggle checked={subForm.is_private} onChange={(v) => onSubFormChange({ ...subForm, is_private: v })} size="sm" />
                      <span className="font-mono text-[10px] text-[#999]">private</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={onCancelSubItem} className="font-mono text-[11px] text-black hover:text-black transition-colors bg-transparent border-none cursor-pointer">cancel</button>
                      <button type="button" onClick={onSubmitSubItem} className="h-8 px-3.5 font-mono text-[11px] bg-[#4ade80] text-black font-semibold hover:bg-[#22c55e] rounded border-none cursor-pointer transition-colors">add</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Card actions */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#e8e8e8]">
            <button
              type="button"
              onClick={onAddSubItem}
              className="font-mono text-[10px] text-black hover:text-black transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              + add sub-item
            </button>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onEdit} className="font-mono text-[10px] text-[#999] hover:text-[#666] transition-colors bg-transparent border-none cursor-pointer p-0">edit</button>
              <button type="button" onClick={onDelete} className="font-mono text-[10px] text-[#999] hover:text-[#ef4444] transition-colors bg-transparent border-none cursor-pointer p-0">delete</button>
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
      <span className="font-mono text-[11px] text-[#666] flex-1 truncate">{sub.title}</span>
      {sub.is_private && <span className="font-mono text-[10px] text-[#666]">🔒</span>}
      <button
        type="button"
        onClick={onDelete}
        className="w-3 h-3 flex items-center justify-center text-[#666] hover:text-[#ef4444] transition-colors bg-transparent border-none cursor-pointer font-mono text-[12px] flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
}
