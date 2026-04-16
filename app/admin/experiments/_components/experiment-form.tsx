"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "../../_components/markdown-editor";
import { TagsInput } from "../../_components/tags-input";
import { ImageUpload } from "../../_components/image-upload";
import { LinksEditor } from "../../_components/links-editor";
import { Toggle } from "../../_components/toggle";
import { FormActionBar } from "../../_components/form-action-bar";
import { FieldLabel, FieldHint } from "../../_components/field-label";
import { inputCls, selectCls } from "../../_components/input-cls";
import { SectionLabel } from "../../_components/section-label";
import { uploadExperimentCover } from "@/lib/services/storage";
import type { Experiment, ExperimentStatus } from "@/lib/services/types";

interface ExperimentFormProps {
  experiment?: Experiment;
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

export function ExperimentForm({ experiment, onSubmit }: ExperimentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(experiment?.title ?? "");
  const [slug, setSlug] = useState(experiment?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!experiment);
  const [description, setDescription] = useState(experiment?.description ?? "");
  const [status, setStatus] = useState<ExperimentStatus>(
    experiment?.status ?? "wip",
  );
  const [featured, setFeatured] = useState(experiment?.featured ?? false);
  const [stack, setStack] = useState<string[]>(experiment?.stack ?? []);
  const [coverImage, setCoverImage] = useState<string | null>(
    experiment?.cover_image ?? null,
  );
  const [links, setLinks] = useState(() => {
    const initial = experiment?.links ?? { deployed: "", github: "" };
    return Object.entries(initial).map(([key, value]) => ({
      key,
      value: value ?? "",
    }));
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
    links.forEach(({ key, value }) => {
      if (key) linksObj[key] = value;
    });
    fd.set("links", JSON.stringify(linksObj));
    fd.set("cover_image", coverImage ?? "");
    startTransition(async () => {
      await onSubmit(fd);
    });
  }

  const statusOptions: { value: ExperimentStatus; label: string }[] = [
    { value: "live", label: "live" },
    { value: "wip", label: "wip" },
    { value: "idea", label: "idea" },
    { value: "archived", label: "archived" },
  ];

  return (
    <form onSubmit={handleFormSubmit} className="max-w-200 flex flex-col gap-6">
      <SectionLabel>basic info</SectionLabel>

      <div className="flex flex-col gap-4">
        <div>
          <FieldLabel>title</FieldLabel>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="My Experiment"
            required
            className={inputCls}
          />
        </div>

        <div>
          <FieldLabel>slug</FieldLabel>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="my-experiment"
            required
            className={inputCls}
          />
          <FieldHint>used in URL: /experiments/[slug]</FieldHint>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>status</FieldLabel>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ExperimentStatus)}
              className={selectCls}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>featured</FieldLabel>
            <div className="flex items-center gap-3 h-11">
              <Toggle checked={featured} onChange={setFeatured} />
              <span className="font-mono text-[11px] font-medium text-[#666]">
                show on landing page
              </span>
            </div>
          </div>
        </div>
      </div>

      <SectionLabel>description</SectionLabel>
      <MarkdownEditor
        value={description}
        onChange={setDescription}
        height={280}
        placeholder="write markdown here..."
      />

      <SectionLabel>stack</SectionLabel>
      <TagsInput value={stack} onChange={setStack} />

      <SectionLabel>cover image</SectionLabel>
      <ImageUpload
        value={coverImage}
        onChange={setCoverImage}
        onUpload={uploadExperimentCover}
        height={120}
      />

      <SectionLabel>links</SectionLabel>
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
