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
import { FieldLabel, FieldHint } from "../../_components/field-label";
import { inputCls, selectCls } from "../../_components/input-cls";
import { SectionLabel } from "../../_components/section-label";
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
    { value: "active",   label: "active",   cls: "text-[#15803d]" },
    { value: "wip",      label: "wip",      cls: "text-[#facc15]" },
    { value: "archived", label: "archived", cls: "text-black-6" },
  ];

  return (
    <form onSubmit={handleFormSubmit} className="max-w-[720px]">
      <SectionLabel>basic info</SectionLabel>

      <div className="flex flex-col gap-4">
        <div>
          <FieldLabel>title</FieldLabel>
          <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="My Project" required className={inputCls} />
        </div>

        <div>
          <FieldLabel>slug</FieldLabel>
          <input type="text" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} placeholder="my-project" required className={inputCls} />
          <FieldHint>used in URL: /projects/[slug]</FieldHint>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>status</FieldLabel>
            <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} className={selectCls}>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>featured</FieldLabel>
            <div className="flex items-center gap-3 h-11">
              <Toggle checked={featured} onChange={setFeatured} />
              <span className="font-mono text-[11px] font-medium text-[#666]">show on landing page</span>
            </div>
          </div>
        </div>
      </div>

      <SectionLabel>description</SectionLabel>
      <MarkdownEditor value={description} onChange={setDescription} height={320} placeholder="write markdown here..." />

      <SectionLabel>stack</SectionLabel>
      <TagsInput value={stack} onChange={setStack} />

      <SectionLabel>cover image</SectionLabel>
      <ImageUpload value={coverImage} onChange={setCoverImage} onUpload={uploadProjectCover} height={120} />

      <SectionLabel>links</SectionLabel>
      <LinksEditor value={links} onChange={setLinks} />

      <SectionLabel>live data</SectionLabel>
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
