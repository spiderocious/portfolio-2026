"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createActivityEntryAction, deleteActivityEntryAction } from "../actions";
import type { ActivityEntry, ActivityType } from "@/lib/services/types";

const typeColors: Record<ActivityType, string> = {
  commit:         "text-[#15803d]",
  blog_post:      "text-[#2563eb]",
  project_update: "text-[#7c3aed]",
  experiment:     "text-[#ea580c]",
  note:           "text-[#94a3b8]",
};

const typeIcons: Record<ActivityType, string> = {
  commit:         "⬡",
  blog_post:      "◻",
  project_update: "◈",
  experiment:     "◎",
  note:           "◇",
};

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface Props {
  initialItems: ActivityEntry[];
  totalCount: number;
}

export function ActivityPageClient({ initialItems, totalCount }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [type, setType] = useState<ActivityType>("note");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("type", type);
    fd.set("title", title);
    fd.set("description", description);
    fd.set("url", url);

    startTransition(async () => {
      await createActivityEntryAction(fd);
      setTitle("");
      setDescription("");
      setUrl("");
      setFormOpen(false);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteActivityEntryAction(id);
      router.refresh();
    });
  }

  const inputCls = "h-10 bg-[#f9f9f9] border border-[#d0d0d0] rounded px-3 font-mono text-[13px] text-black placeholder:text-[#888] outline-none focus:border-[#4ade80] transition-all duration-150";

  return (
    <div className="flex flex-col gap-4">
      {/* Add Entry Form (collapsible) */}
      <div
        className={[
          "border rounded-md overflow-hidden transition-colors duration-150",
          formOpen ? "bg-white border-[#aaa]" : "bg-white border-[#d0d0d0] hover:border-[#aaa] hover:bg-[#f4f4f4]",
        ].join(" ")}
      >
        {!formOpen ? (
          <div
            className="flex items-center justify-between px-5 py-3.5 cursor-pointer"
            onClick={() => setFormOpen(true)}
          >
            <span className="font-mono text-[11px] text-black">add activity entry</span>
            <button
              type="button"
              className="w-6 h-6 flex items-center justify-center text-black hover:text-black transition-colors bg-transparent border-none cursor-pointer font-mono text-[18px]"
            >
              +
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddSubmit} className="px-5 py-5">
            <div className="flex items-start gap-2.5 flex-wrap">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ActivityType)}
                className={[inputCls, "w-36 cursor-pointer appearance-none flex-shrink-0"].join(" ")}
              >
                <option value="commit">commit</option>
                <option value="blog_post">blog post</option>
                <option value="project_update">project update</option>
                <option value="experiment">experiment</option>
                <option value="note">note</option>
              </select>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What happened?"
                required
                className={[inputCls, "flex-1 min-w-[200px]"].join(" ")}
              />

              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
                className={[inputCls, "w-64"].join(" ")}
              />

              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className={[inputCls, "w-52"].join(" ")}
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-2.5">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="font-mono text-[11px] text-black hover:text-black transition-colors bg-transparent border-none cursor-pointer"
              >
                cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={["h-9 px-4 font-mono text-[11px] font-medium rounded border-none transition-colors", isPending ? "bg-[#ccc] text-black cursor-not-allowed" : "bg-[#4ade80] text-black font-semibold hover:bg-[#22c55e] cursor-pointer"].join(" ")}
              >
                {isPending ? "adding..." : "add entry"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Activity List */}
      <div className="bg-white border-2 border-black rounded-md overflow-hidden">
        <div className="h-11 flex items-center justify-between px-5 border-b border-[#e8e8e8]">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black">all activity</span>
          <span className="font-mono text-[10px] text-black bg-[#f4f4f4] border border-[#d0d0d0] rounded-full px-2 py-0.5">
            {totalCount} entries
          </span>
        </div>

        {initialItems.length === 0 ? (
          <div className="flex items-center justify-center h-[120px]">
            <p className="font-mono text-[11px] text-[#888]">no activity yet. add an entry or push a commit.</p>
          </div>
        ) : (
          initialItems.map((item, i) => {
            const type = item.type as ActivityType;
            return (
              <div
                key={item.id}
                className={[
                  "flex items-start gap-3.5 px-5 py-3.5 hover:bg-[#f9f9f9] transition-colors duration-100",
                  i < initialItems.length - 1 ? "border-b border-[#e8e8e8]" : "",
                ].join(" ")}
              >
                {/* Type icon */}
                <div className="w-8 flex-shrink-0 pt-0.5">
                  <p className={`font-mono text-[14px] ${typeColors[type] ?? "text-black"}`}>
                    {typeIcons[type] ?? "•"}
                  </p>
                  <p className={`font-mono text-[9px] uppercase tracking-[0.1em] ${typeColors[type] ?? "text-[#888]"} mt-0.5`}>
                    {item.type.replace(/_/g, " ")}
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[12px] text-black mb-0.5">{item.title}</p>
                  {item.description && (
                    <p className="font-mono text-[11px] text-[#666] mb-0.5">{item.description}</p>
                  )}
                  {item.url && (
                    <p className="font-mono text-[10px] text-[#666] truncate">{item.url}</p>
                  )}
                </div>

                {/* Right */}
                <div className="flex items-start gap-2 flex-shrink-0 pt-0.5">
                  <span className="font-mono text-[10px] text-[#666]">{timeAgo(item.created_at)}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                    className="w-6 h-6 flex items-center justify-center font-mono text-[14px] text-[#666] hover:text-[#ef4444] transition-colors bg-transparent border-none cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
