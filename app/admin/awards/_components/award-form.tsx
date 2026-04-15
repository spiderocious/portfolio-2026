"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "../../_components/image-upload";
import { FormActionBar } from "../../_components/form-action-bar";
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
  const [date, setDate] = useState(award?.date?.slice(0, 7) ?? ""); // YYYY-MM
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

  const sectionLabel = "font-mono text-[9px] uppercase tracking-[0.18em] text-a-ink-8 mt-8 mb-3 pb-2 border-b border-a-border-sub";
  const fieldLabel = "font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-a-ink-6 mb-1.5 block";
  const inputCls = "w-full h-11 bg-a-surface border border-[#222222] rounded px-3.5 font-mono text-[13px] text-a-ink-2 placeholder:text-a-ink-8 outline-none focus:border-a-border-act focus:[box-shadow:0_0_0_2px_rgba(255,255,255,0.04)] transition-all duration-150";

  return (
    <form onSubmit={handleFormSubmit} className="max-w-[720px]">
      <div className={sectionLabel}>award info</div>

      <div className="mb-4">
        <label className={fieldLabel}>title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Best Developer Award" required className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className={fieldLabel}>issuer</label>
          <input type="text" value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="IEEE / Google / etc." required className={inputCls} />
        </div>
        <div>
          <label className={fieldLabel}>date</label>
          <input type="month" value={date} onChange={(e) => setDate(e.target.value)} required className={inputCls} />
        </div>
      </div>

      <div className="mb-4">
        <label className={fieldLabel}>url</label>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputCls} />
        <p className="font-mono text-[10px] text-a-ink-8 mt-1">link to certificate or announcement</p>
      </div>

      <div className="mb-4">
        <label className={fieldLabel}>description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="brief description of the award or recognition..."
          rows={5}
          className="w-full bg-a-surface border border-[#222222] rounded px-3.5 py-3.5 font-mono text-[13px] text-a-ink-2 placeholder:text-a-ink-8 leading-relaxed resize-y outline-none focus:border-a-border-act focus:[box-shadow:0_0_0_2px_rgba(255,255,255,0.04)] transition-all duration-150"
          style={{ height: "160px" }}
        />
      </div>

      <div className={sectionLabel}>image</div>
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
