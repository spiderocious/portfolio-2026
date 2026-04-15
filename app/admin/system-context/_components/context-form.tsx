"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Toggle } from "../../_components/toggle";
import { FormActionBar } from "../../_components/form-action-bar";
import type { SystemContextEntry, ContextCategory } from "@/lib/services/types";

interface ContextFormProps {
  entry?: SystemContextEntry;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function ContextForm({ entry, onSubmit }: ContextFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [label, setLabel] = useState(entry?.label ?? "");
  const [category, setCategory] = useState<ContextCategory | "">(entry?.category ?? "");
  const [position, setPosition] = useState(entry?.position?.toString() ?? "0");
  const [isActive, setIsActive] = useState(entry?.is_active ?? true);
  const [content, setContent] = useState(entry?.content ?? "");

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("label", label);
    fd.set("category", category);
    fd.set("position", position);
    fd.set("is_active", String(isActive));
    fd.set("content", content);
    startTransition(async () => { await onSubmit(fd); });
  }

  const sectionLabel = "font-mono text-[9px] uppercase tracking-[0.18em] text-a-ink-8 mt-8 mb-3 pb-2 border-b border-a-border-sub";
  const fieldLabel = "font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-a-ink-6 mb-1.5 block";
  const inputCls = "w-full h-11 bg-a-surface border border-[#222222] rounded px-3.5 font-mono text-[13px] text-a-ink-2 placeholder:text-a-ink-8 outline-none focus:border-a-border-act focus:[box-shadow:0_0_0_2px_rgba(255,255,255,0.04)] transition-all duration-150";

  return (
    <form onSubmit={handleFormSubmit} className="max-w-[720px]">
      <div className={sectionLabel}>entry info</div>

      <div className="mb-4">
        <label className={fieldLabel}>label</label>
        <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Professional Identity" required className={inputCls} />
        <p className="font-mono text-[10px] text-a-ink-8 mt-1">human-readable name for this entry</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className={fieldLabel}>category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as ContextCategory | "")} className={[inputCls, "cursor-pointer appearance-none"].join(" ")}>
            <option value="">none</option>
            <option value="professional">professional</option>
            <option value="personal">personal</option>
            <option value="opinions">opinions</option>
            <option value="instructions">instructions</option>
          </select>
        </div>
        <div>
          <label className={fieldLabel}>position</label>
          <input type="number" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="1" min="0" className={inputCls} />
          <p className="font-mono text-[10px] text-a-ink-8 mt-1">lower = appears first</p>
        </div>
        <div>
          <label className={fieldLabel}>active</label>
          <div className="flex items-center gap-3 h-11">
            <Toggle checked={isActive} onChange={setIsActive} />
            <span className="font-mono text-[10px] text-a-ink-8">include in system prompt</span>
          </div>
        </div>
      </div>

      <div className={sectionLabel}>content</div>
      <p className="font-mono text-[10px] text-a-ink-8 mb-3">written in first person — this text is sent directly to the LLM</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="I am a software developer based in Lagos, Nigeria..."
        required
        className="w-full bg-a-base border border-[#222222] rounded px-4 py-4 font-mono text-[13px] text-a-ink-2 placeholder:text-[#2a2a2a] leading-[1.7] resize-y outline-none focus:border-a-border-act transition-all duration-150"
        style={{ height: "360px" }}
      />

      <FormActionBar
        backHref="/admin/system-context"
        backLabel="← back to system context"
        saveLabel={entry ? "save entry" : "create entry"}
        saving={isPending}
        onDiscard={() => router.push("/admin/system-context")}
      />
    </form>
  );
}
