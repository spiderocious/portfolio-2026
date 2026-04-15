"use server";

import { redirect } from "next/navigation";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/services/projects";
import type { ProjectStatus, LiveDataItem, ProjectLinks } from "@/lib/services/types";

export async function createProjectAction(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as ProjectStatus;
  const featured = formData.get("featured") === "true";
  const stack = JSON.parse((formData.get("stack") as string) || "[]") as string[];
  const links = JSON.parse((formData.get("links") as string) || "{}") as ProjectLinks;
  const live_data = JSON.parse((formData.get("live_data") as string) || "null") as LiveDataItem[] | null;
  const cover_image = (formData.get("cover_image") as string) || null;

  const result = await createProject({
    title, slug, description, status, featured, stack, links, live_data, cover_image,
  });

  if ("error" in result) {
    throw new Error(result.error);
  }

  redirect("/admin/projects");
}

export async function updateProjectAction(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as ProjectStatus;
  const featured = formData.get("featured") === "true";
  const stack = JSON.parse((formData.get("stack") as string) || "[]") as string[];
  const links = JSON.parse((formData.get("links") as string) || "{}") as ProjectLinks;
  const live_data = JSON.parse((formData.get("live_data") as string) || "null") as LiveDataItem[] | null;
  const cover_image = (formData.get("cover_image") as string) || null;

  const result = await updateProject(id, {
    title, slug, description, status, featured, stack, links, live_data, cover_image,
  });

  if (result.error) throw new Error(result.error);
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string) {
  const result = await deleteProject(id);
  if (result.error) throw new Error(result.error);
  redirect("/admin/projects");
}
