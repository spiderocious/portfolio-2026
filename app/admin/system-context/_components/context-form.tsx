"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Toggle } from "../../_components/toggle";
import { FormActionBar } from "../../_components/form-action-bar";
import { FieldLabel, FieldHint } from "../../_components/field-label";
import { inputCls, selectCls, textareaCls } from "../../_components/input-cls";
import { SectionLabel } from "../../_components/section-label";
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

  return (
    <form onSubmit={handleFormSubmit} className="max-w-180">
      <SectionLabel>entry info</SectionLabel>

      <div className="flex flex-col gap-4">
        <div>
          <FieldLabel>label</FieldLabel>
          <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Professional Identity" required className={inputCls} />
          <FieldHint>human-readable name for this entry</FieldHint>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>category</FieldLabel>
            <select value={category} onChange={(e) => setCategory(e.target.value as ContextCategory | "")} className={selectCls}>
              <option value="">none</option>
              <option value="professional">professional</option>
              <option value="personal">personal</option>
              <option value="opinions">opinions</option>
              <option value="instructions">instructions</option>
            </select>
          </div>
          <div>
            <FieldLabel>position</FieldLabel>
            <input type="number" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="1" min="0" className={inputCls} />
            <FieldHint>lower = appears first</FieldHint>
          </div>
          <div>
            <FieldLabel>active</FieldLabel>
            <div className="flex items-center gap-3 h-11">
              <Toggle checked={isActive} onChange={setIsActive} />
              <span className="font-mono text-[11px] font-medium text-[#666]">include in system prompt</span>
            </div>
          </div>
        </div>
      </div>

      <SectionLabel>content</SectionLabel>
      <FieldHint>written in first person — this text is sent directly to the LLM</FieldHint>
      <div className="mt-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="I am a software developer based in Lagos, Nigeria..."
          required
          className={`${textareaCls} h-90`}
        />
      </div>

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
