"use server";

import { redirect } from "next/navigation";
import { createExperiment, updateExperiment, deleteExperiment } from "@/lib/services/experiments";
import type { ExperimentStatus, ExperimentLinks } from "@/lib/services/types";

export async function createExperimentAction(formData: FormData) {
  const result = await createExperiment({
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    status: formData.get("status") as ExperimentStatus,
    featured: formData.get("featured") === "true",
    stack: JSON.parse((formData.get("stack") as string) || "[]"),
    links: JSON.parse((formData.get("links") as string) || "{}") as ExperimentLinks,
    cover_image: (formData.get("cover_image") as string) || null,
  });
  if ("error" in result) throw new Error(result.error);
  redirect("/admin/experiments");
}

export async function updateExperimentAction(id: string, formData: FormData) {
  const result = await updateExperiment(id, {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    status: formData.get("status") as ExperimentStatus,
    featured: formData.get("featured") === "true",
    stack: JSON.parse((formData.get("stack") as string) || "[]"),
    links: JSON.parse((formData.get("links") as string) || "{}") as ExperimentLinks,
    cover_image: (formData.get("cover_image") as string) || null,
  });
  if (result.error) throw new Error(result.error);
  redirect("/admin/experiments");
}

export async function deleteExperimentAction(id: string) {
  const result = await deleteExperiment(id);
  if (result.error) throw new Error(result.error);
  redirect("/admin/experiments");
}
