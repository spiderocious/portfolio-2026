"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "../../_components/markdown-editor";
import { TagsInput } from "../../_components/tags-input";
import { ImageUpload } from "../../_components/image-upload";
import { LinksEditor } from "../../_components/links-editor";
import { LiveDataEditor } from "../../_components/live-data-editor";
import { Toggle } from "../../_components/toggle";
import { FormActionBar } from "../../_components/form-action-bar";
import { uploadProjectCover } from "@/lib/services/storage";
import type { Project, ProjectStatus } from "@/lib/services/types";

interface ProjectFormProps {
  project?: Project;
  onSubmit: (formData: FormData) => Promise<void>;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function ProjectForm({ project, onSubmit }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!project);
  const [description, setDescription] = useState(project?.description ?? "");
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "active");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [stack, setStack] = useState<string[]>(project?.stack ?? []);
  const [coverImage, setCoverImage] = useState<string | null>(project?.cover_image ?? null);
  const [links, setLinks] = useState(() => {
    const initial = project?.links ?? { deployed: "", github: "" };
    return Object.entries(initial).map(([key, value]) => ({ key, value: value ?? "" }));
  });
  const [liveData, setLiveData] = useState(project?.live_data ?? []);

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
    // Convert links array to object
    const linksObj: Record<string, string> = {};
    links.forEach(({ key, value }) => { if (key) linksObj[key] = value; });
    fd.set("links", JSON.stringify(linksObj));
    fd.set("live_data", liveData.length > 0 ? JSON.stringify(liveData) : "null");
    fd.set("cover_image", coverImage ?? "");

    startTransition(async () => {
      await onSubmit(fd);
    });
  }

  const statusOptions: { value: ProjectStatus; label: string; cls: string }[] = [
    { value: "active",   label: "active",   cls: "text-a-green" },
    { value: "wip",      label: "wip",      cls: "text-[#facc15]" },
    { value: "archived", label: "archived", cls: "text-a-ink-6" },
  ];

  const sectionLabel = "font-mono text-[9px] uppercase tracking-[0.18em] text-a-ink-8 mt-8 mb-3 pb-2 border-b border-a-border-sub";
  const fieldLabel = "font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-a-ink-6 mb-1.5 block";
  const inputCls = "w-full h-11 bg-a-surface border border-[#222222] rounded px-3.5 font-mono text-[13px] text-a-ink-2 placeholder:text-a-ink-8 outline-none focus:border-a-border-act focus:[box-shadow:0_0_0_2px_rgba(255,255,255,0.04)] transition-all duration-150";

  return (
    <form onSubmit={handleFormSubmit} className="max-w-[720px]">
      {/* ── Basic Info ── */}
      <div className={sectionLabel}>basic info</div>

      <div className="mb-4">
        <label className={fieldLabel}>title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="My Project"
          required
          className={inputCls}
        />
      </div>

      <div className="mb-4">
        <label className={fieldLabel}>slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
          placeholder="my-project"
          required
          className={inputCls}
        />
        <p className="font-mono text-[10px] text-a-ink-8 mt-1">used in URL: /projects/[slug]</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className={fieldLabel}>status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            className={[inputCls, "cursor-pointer appearance-none"].join(" ")}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
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

      {/* ── Description ── */}
      <div className={sectionLabel}>description</div>
      <MarkdownEditor
        value={description}
        onChange={setDescription}
        height={320}
        placeholder="write markdown here..."
      />

      {/* ── Stack ── */}
      <div className={sectionLabel}>stack</div>
      <TagsInput value={stack} onChange={setStack} />

      {/* ── Cover Image ── */}
      <div className={sectionLabel}>cover image</div>
      <ImageUpload
        value={coverImage}
        onChange={setCoverImage}
        onUpload={uploadProjectCover}
        height={120}
      />

      {/* ── Links ── */}
      <div className={sectionLabel}>links</div>
      <LinksEditor value={links} onChange={setLinks} />

      {/* ── Live Data ── */}
      <div className={sectionLabel}>live data</div>
      <LiveDataEditor value={liveData} onChange={setLiveData} />

      <FormActionBar
        backHref="/admin/projects"
        backLabel="← back to projects"
        saveLabel={project ? "save project" : "create project"}
        saving={isPending}
        onDiscard={() => router.push("/admin/projects")}
      />
    </form>
  );
}
