"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "../../_components/markdown-editor";
import { ImageUpload } from "../../_components/image-upload";
import { FormActionBar } from "../../_components/form-action-bar";
import { uploadCompanyLogo } from "@/lib/services/storage";
import type { Experience } from "@/lib/services/types";

interface ExperienceFormProps {
  experience?: Experience;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function ExperienceForm({ experience, onSubmit }: ExperienceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [role, setRole] = useState(experience?.role ?? "");
  const [company, setCompany] = useState(experience?.company ?? "");
  const [companyUrl, setCompanyUrl] = useState(experience?.company_url ?? "");
  const [location, setLocation] = useState(experience?.location ?? "");
  const [startDate, setStartDate] = useState(experience?.start_date?.slice(0, 10) ?? "");
  const [endDate, setEndDate] = useState(experience?.end_date?.slice(0, 10) ?? "");
  const [currentlyHere, setCurrentlyHere] = useState(!experience?.end_date);
  const [description, setDescription] = useState(experience?.description ?? "");
  const [achievements, setAchievements] = useState(experience?.achievements ?? "");
  const [logoUrl, setLogoUrl] = useState<string | null>(experience?.logo_url ?? null);

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("role", role);
    fd.set("company", company);
    fd.set("company_url", companyUrl);
    fd.set("location", location);
    fd.set("start_date", startDate);
    fd.set("end_date", currentlyHere ? "" : endDate);
    fd.set("description", description);
    fd.set("achievements", achievements);
    fd.set("logo_url", logoUrl ?? "");

    startTransition(async () => {
      await onSubmit(fd);
    });
  }

  const sectionLabel = "font-mono text-[9px] uppercase tracking-[0.18em] text-a-ink-8 mt-8 mb-3 pb-2 border-b border-a-border-sub";
  const fieldLabel = "font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-a-ink-6 mb-1.5 block";
  const inputCls = "w-full h-11 bg-a-surface border border-[#222222] rounded px-3.5 font-mono text-[13px] text-a-ink-2 placeholder:text-a-ink-8 outline-none focus:border-a-border-act focus:[box-shadow:0_0_0_2px_rgba(255,255,255,0.04)] transition-all duration-150";

  return (
    <form onSubmit={handleFormSubmit} className="max-w-[720px]">
      <div className={sectionLabel}>role & company</div>

      <div className="mb-4">
        <label className={fieldLabel}>role</label>
        <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Senior Frontend Engineer" required className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className={fieldLabel}>company</label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" required className={inputCls} />
        </div>
        <div>
          <label className={fieldLabel}>company url</label>
          <input type="url" value={companyUrl} onChange={(e) => setCompanyUrl(e.target.value)} placeholder="https://acme.com" className={inputCls} />
        </div>
      </div>

      <div className="mb-4">
        <label className={fieldLabel}>location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lagos, Nigeria · Remote" className={inputCls} />
      </div>

      <div className={sectionLabel}>dates</div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className={fieldLabel}>start date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label className={fieldLabel}>end date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={currentlyHere}
            className={[inputCls, currentlyHere ? "opacity-30 pointer-events-none" : ""].join(" ")}
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="currently_here"
              checked={currentlyHere}
              onChange={(e) => setCurrentlyHere(e.target.checked)}
              className="w-4 h-4 border border-[#2a2a2a] bg-a-surface rounded accent-a-green cursor-pointer"
            />
            <label htmlFor="currently_here" className="font-mono text-[12px] text-a-ink-4 cursor-pointer">
              currently here
            </label>
          </div>
        </div>
      </div>

      <div className={sectionLabel}>company logo</div>
      <div className="w-20 h-20">
        <ImageUpload
          value={logoUrl}
          onChange={setLogoUrl}
          onUpload={uploadCompanyLogo}
          height={80}
          square
        />
      </div>

      <div className={sectionLabel}>description</div>
      <MarkdownEditor value={description} onChange={setDescription} height={240} placeholder="describe the role and responsibilities..." />

      <div className={sectionLabel}>achievements</div>
      <p className="font-mono text-[10px] text-a-ink-8 mb-3">key bullets of impact — each line becomes a list item</p>
      <MarkdownEditor value={achievements} onChange={setAchievements} height={200} placeholder="- shipped X which resulted in Y..." />

      <FormActionBar
        backHref="/admin/experience"
        backLabel="← back to experience"
        saveLabel={experience ? "save entry" : "create entry"}
        saving={isPending}
        onDiscard={() => router.push("/admin/experience")}
      />
    </form>
  );
}
