"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "../../_components/markdown-editor";
import { TagsInput } from "../../_components/tags-input";
import { ImageUpload } from "../../_components/image-upload";
import { LinksEditor } from "../../_components/links-editor";
import { Toggle } from "../../_components/toggle";
import { FormActionBar } from "../../_components/form-action-bar";
import { uploadExperimentCover } from "@/lib/services/storage";
import type { Experiment, ExperimentStatus } from "@/lib/services/types";

interface ExperimentFormProps {
  experiment?: Experiment;
  onSubmit: (formData: FormData) => Promise<void>;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export function ExperimentForm({ experiment, onSubmit }: ExperimentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(experiment?.title ?? "");
  const [slug, setSlug] = useState(experiment?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!experiment);
  const [description, setDescription] = useState(experiment?.description ?? "");
  const [status, setStatus] = useState<ExperimentStatus>(experiment?.status ?? "wip");
  const [featured, setFeatured] = useState(experiment?.featured ?? false);
  const [stack, setStack] = useState<string[]>(experiment?.stack ?? []);
  const [coverImage, setCoverImage] = useState<string | null>(experiment?.cover_image ?? null);
  const [links, setLinks] = useState(() => {
    const initial = experiment?.links ?? { deployed: "", github: "" };
    return Object.entries(initial).map(([key, value]) => ({ key, value: value ?? "" }));
  });

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugTouched) setSlug(slugify(val));
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("title", title);
    fd.set("slug", slug);
    fd.set("description", description);
    fd.set("status", status);
    fd.set("featured", String(featured));
    fd.set("stack", JSON.stringify(stack));
    const linksObj: Record<string, string> = {};
    links.forEach(({ key, value }) => { if (key) linksObj[key] = value; });
    fd.set("links", JSON.stringify(linksObj));
    fd.set("cover_image", coverImage ?? "");
    startTransition(async () => { await onSubmit(fd); });
  }

  const sectionLabel = "font-mono text-[9px] uppercase tracking-[0.18em] text-a-ink-8 mt-8 mb-3 pb-2 border-b border-a-border-sub";
  const fieldLabel = "font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-a-ink-6 mb-1.5 block";
  const inputCls = "w-full h-11 bg-a-surface border border-[#222222] rounded px-3.5 font-mono text-[13px] text-a-ink-2 placeholder:text-a-ink-8 outline-none focus:border-a-border-act focus:[box-shadow:0_0_0_2px_rgba(255,255,255,0.04)] transition-all duration-150";

  const statusOptions: { value: ExperimentStatus; label: string }[] = [
    { value: "live", label: "live" },
    { value: "wip", label: "wip" },
    { value: "idea", label: "idea" },
    { value: "archived", label: "archived" },
  ];

  return (
    <form onSubmit={handleFormSubmit} className="max-w-[720px]">
      <div className={sectionLabel}>basic info</div>

      <div className="mb-4">
        <label className={fieldLabel}>title</label>
        <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="My Experiment" required className={inputCls} />
      </div>

      <div className="mb-4">
        <label className={fieldLabel}>slug</label>
        <input type="text" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} placeholder="my-experiment" required className={inputCls} />
        <p className="font-mono text-[10px] text-a-ink-8 mt-1">used in URL: /experiments/[slug]</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className={fieldLabel}>status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as ExperimentStatus)} className={[inputCls, "cursor-pointer appearance-none"].join(" ")}>
            {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label className={fieldLabel}>featured</label>
          <div className="flex items-center gap-3 h-11">
            <Toggle checked={featured} onChange={setFeatured} />
            <span className="font-mono text-[10px] text-a-ink-8">show on landing page</span>
          </div>
        </div>
      </div>

      <div className={sectionLabel}>description</div>
      <MarkdownEditor value={description} onChange={setDescription} height={280} placeholder="write markdown here..." />

      <div className={sectionLabel}>stack</div>
      <TagsInput value={stack} onChange={setStack} />

      <div className={sectionLabel}>cover image</div>
      <ImageUpload value={coverImage} onChange={setCoverImage} onUpload={uploadExperimentCover} height={120} />

      <div className={sectionLabel}>links</div>
      <LinksEditor value={links} onChange={setLinks} />

      <FormActionBar
        backHref="/admin/experiments"
        backLabel="← back to experiments"
        saveLabel={experiment ? "save experiment" : "create experiment"}
        saving={isPending}
        onDiscard={() => router.push("/admin/experiments")}
      />
    </form>
  );
}
