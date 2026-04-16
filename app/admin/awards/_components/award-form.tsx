"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "../../_components/image-upload";
import { FormActionBar } from "../../_components/form-action-bar";
import { FieldLabel, FieldHint } from "../../_components/field-label";
import { inputCls, textareaCls } from "../../_components/input-cls";
import { SectionLabel } from "../../_components/section-label";
import { uploadAwardImage } from "@/lib/services/storage";
import type { Award } from "@/lib/services/types";

interface AwardFormProps {
  award?: Award;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function AwardForm({ award, onSubmit }: AwardFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(award?.title ?? "");
  const [issuer, setIssuer] = useState(award?.issuer ?? "");
  const [date, setDate] = useState(award?.date?.slice(0, 7) ?? "");
  const [url, setUrl] = useState(award?.url ?? "");
  const [description, setDescription] = useState(award?.description ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(award?.image_url ?? null);

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("title", title);
    fd.set("issuer", issuer);
    fd.set("date", date ? `${date}-01` : "");
    fd.set("url", url);
    fd.set("description", description);
    fd.set("image_url", imageUrl ?? "");
    startTransition(async () => { await onSubmit(fd); });
  }

  return (
    <form onSubmit={handleFormSubmit} className="max-w-[720px]">
      <SectionLabel>award info</SectionLabel>

      <div className="mb-4">
        <FieldLabel>title</FieldLabel>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Best Developer Award" required className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <FieldLabel>issuer</FieldLabel>
          <input type="text" value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="IEEE / Google / etc." required className={inputCls} />
        </div>
        <div>
          <FieldLabel>date</FieldLabel>
          <input type="month" value={date} onChange={(e) => setDate(e.target.value)} required className={inputCls} />
        </div>
      </div>

      <div className="mb-4">
        <FieldLabel>url</FieldLabel>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputCls} />
        <FieldHint>link to certificate or announcement</FieldHint>
      </div>

      <div className="mb-4">
        <FieldLabel>description</FieldLabel>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="brief description of the award or recognition..."
          rows={5}
          className={textareaCls}
          style={{ height: "160px" }}
        />
      </div>

      <SectionLabel>image</SectionLabel>
      <ImageUpload value={imageUrl} onChange={setImageUrl} onUpload={uploadAwardImage} height={120} />

      <FormActionBar
        backHref="/admin/awards"
        backLabel="← back to awards"
        saveLabel={award ? "save award" : "create award"}
        saving={isPending}
        onDiscard={() => router.push("/admin/awards")}
      />
    </form>
  );
}
