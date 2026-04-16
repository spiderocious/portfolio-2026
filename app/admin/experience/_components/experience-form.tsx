"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "../../_components/markdown-editor";
import { ImageUpload } from "../../_components/image-upload";
import { FormActionBar } from "../../_components/form-action-bar";
import { FieldLabel, FieldHint } from "../../_components/field-label";
import { inputCls } from "../../_components/input-cls";
import { SectionLabel } from "../../_components/section-label";
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
    startTransition(async () => { await onSubmit(fd); });
  }

  return (
    <form onSubmit={handleFormSubmit} className="max-w-[720px]">
      <SectionLabel>role & company</SectionLabel>

      <div className="flex flex-col gap-4">
        <div>
          <FieldLabel>role</FieldLabel>
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Senior Frontend Engineer" required className={inputCls} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>company</FieldLabel>
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" required className={inputCls} />
          </div>
          <div>
            <FieldLabel>company url</FieldLabel>
            <input type="url" value={companyUrl} onChange={(e) => setCompanyUrl(e.target.value)} placeholder="https://acme.com" className={inputCls} />
          </div>
        </div>

        <div>
          <FieldLabel>location</FieldLabel>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lagos, Nigeria · Remote" className={inputCls} />
        </div>
      </div>

      <SectionLabel>dates</SectionLabel>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>start date</FieldLabel>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className={inputCls} />
          </div>
          <div>
            <FieldLabel>end date</FieldLabel>
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
                className="w-4 h-4 border-2 border-black rounded accent-[#4ade80] cursor-pointer"
              />
              <label htmlFor="currently_here" className="font-mono text-[12px] font-medium text-black cursor-pointer">
                currently here
              </label>
            </div>
          </div>
        </div>
      </div>

      <SectionLabel>company logo</SectionLabel>
      <div className="w-20 h-20">
        <ImageUpload value={logoUrl} onChange={setLogoUrl} onUpload={uploadCompanyLogo} height={80} square />
      </div>

      <SectionLabel>description</SectionLabel>
      <MarkdownEditor value={description} onChange={setDescription} height={240} placeholder="describe the role and responsibilities..." />

      <SectionLabel>achievements</SectionLabel>
      <FieldHint>key bullets of impact — each line becomes a list item</FieldHint>
      <div className="mt-2">
        <MarkdownEditor value={achievements} onChange={setAchievements} height={200} placeholder="- shipped X which resulted in Y..." />
      </div>

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
