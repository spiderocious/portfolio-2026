"use server";

import { redirect } from "next/navigation";
import { createExperience, updateExperience, deleteExperience } from "@/lib/services/experience";

export async function createExperienceAction(formData: FormData) {
  const result = await createExperience({
    role: formData.get("role") as string,
    company: formData.get("company") as string,
    company_url: (formData.get("company_url") as string) || null,
    location: (formData.get("location") as string) || null,
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    description: formData.get("description") as string,
    achievements: formData.get("achievements") as string,
    logo_url: (formData.get("logo_url") as string) || null,
  });
  if ("error" in result) throw new Error(result.error);
  redirect("/admin/experience");
}

export async function updateExperienceAction(id: string, formData: FormData) {
  const result = await updateExperience(id, {
    role: formData.get("role") as string,
    company: formData.get("company") as string,
    company_url: (formData.get("company_url") as string) || null,
    location: (formData.get("location") as string) || null,
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    description: formData.get("description") as string,
    achievements: formData.get("achievements") as string,
    logo_url: (formData.get("logo_url") as string) || null,
  });
  if (result.error) throw new Error(result.error);
  redirect("/admin/experience");
}

export async function deleteExperienceAction(id: string) {
  const result = await deleteExperience(id);
  if (result.error) throw new Error(result.error);
  redirect("/admin/experience");
}
