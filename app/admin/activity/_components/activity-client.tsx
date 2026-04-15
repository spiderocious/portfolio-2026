"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createActivityEntryAction, deleteActivityEntryAction } from "../actions";
import type { ActivityEntry, ActivityType } from "@/lib/services/types";

const typeColors: Record<ActivityType, string> = {
  commit:         "text-a-green",
  blog_post:      "text-a-blue",
  project_update: "text-a-purple",
  experiment:     "text-a-orange",
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

  const inputCls = "h-10 bg-a-surface border border-[#222222] rounded px-3 font-mono text-[13px] text-a-ink-2 placeholder:text-a-ink-8 outline-none focus:border-a-border-act transition-all duration-150";

  return (
    <>
      {/* Add Entry Form (collapsible) */}
      <div
        className={[
          "border rounded-md mb-3 overflow-hidden transition-colors duration-150",
          formOpen ? "bg-a-card border-a-border-hov" : "bg-a-card border-a-border hover:border-a-border-hov hover:bg-[#161616]",
        ].join(" ")}
      >
        {!formOpen ? (
          <div
            className="flex items-center justify-between px-5 py-3.5 cursor-pointer"
            onClick={() => setFormOpen(true)}
          >
            <span className="font-mono text-[11px] text-a-ink-6">add activity entry</span>
            <button
              type="button"
              className="w-6 h-6 flex items-center justify-center text-a-ink-6 hover:text-a-ink-3 transition-colors bg-transparent border-none cursor-pointer font-mono text-[18px]"
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
                className="font-mono text-[11px] text-a-ink-7 hover:text-a-ink-4 transition-colors bg-transparent border-none cursor-pointer"
              >
                cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={["h-9 px-4 font-mono text-[11px] font-medium rounded border-none transition-colors", isPending ? "bg-a-btn-dis text-a-base cursor-not-allowed" : "bg-a-btn text-a-base hover:bg-a-btn-hov cursor-pointer"].join(" ")}
              >
                {isPending ? "adding..." : "add entry"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Activity List */}
      <div className="bg-a-card border border-a-border rounded-md overflow-hidden">
        <div className="h-11 flex items-center justify-between px-5 border-b border-a-border-sub">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-a-ink-6">all activity</span>
          <span className="font-mono text-[10px] text-a-ink-7 bg-[#1a1a1a] border border-[#222] rounded-full px-2 py-0.5">
            {totalCount} entries
          </span>
        </div>

        {initialItems.length === 0 ? (
          <div className="flex items-center justify-center h-[120px]">
            <p className="font-mono text-[11px] text-a-ink-7">no activity yet. add an entry or push a commit.</p>
          </div>
        ) : (
          initialItems.map((item, i) => {
            const type = item.type as ActivityType;
            return (
              <div
                key={item.id}
                className={[
                  "flex items-start gap-3.5 px-5 py-3.5 hover:bg-white/[0.015] transition-colors duration-100",
                  i < initialItems.length - 1 ? "border-b border-[#191919]" : "",
                ].join(" ")}
              >
                {/* Type icon */}
                <div className="w-8 flex-shrink-0 pt-0.5">
                  <p className={`font-mono text-[14px] ${typeColors[type] ?? "text-a-ink-4"}`}>
                    {typeIcons[type] ?? "•"}
                  </p>
                  <p className={`font-mono text-[9px] uppercase tracking-[0.1em] ${typeColors[type] ?? "text-a-ink-7"} mt-0.5`}>
                    {item.type.replace(/_/g, " ")}
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[12px] text-a-ink-3 mb-0.5">{item.title}</p>
                  {item.description && (
                    <p className="font-mono text-[11px] text-a-ink-5 mb-0.5">{item.description}</p>
                  )}
                  {item.url && (
                    <p className="font-mono text-[10px] text-a-ink-7 truncate">{item.url}</p>
                  )}
                </div>

                {/* Right */}
                <div className="flex items-start gap-2 flex-shrink-0 pt-0.5">
                  <span className="font-mono text-[10px] text-a-ink-8">{timeAgo(item.created_at)}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                    className="w-6 h-6 flex items-center justify-center font-mono text-[14px] text-a-ink-8 hover:text-a-red transition-colors bg-transparent border-none cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
