"use server";

import { redirect } from "next/navigation";
import {
  createContextEntry,
  updateContextEntry,
  deleteContextEntry,
  toggleActive,
} from "@/lib/services/system-context";
import type { ContextCategory } from "@/lib/services/types";

export async function createContextEntryAction(formData: FormData) {
  const result = await createContextEntry({
    label: formData.get("label") as string,
    content: formData.get("content") as string,
    category: (formData.get("category") as ContextCategory) || null,
    position: parseInt((formData.get("position") as string) || "0"),
    is_active: formData.get("is_active") === "true",
  });
  if ("error" in result) throw new Error(result.error);
  redirect("/admin/system-context");
}

export async function updateContextEntryAction(id: string, formData: FormData) {
  const result = await updateContextEntry(id, {
    label: formData.get("label") as string,
    content: formData.get("content") as string,
    category: (formData.get("category") as ContextCategory) || null,
    position: parseInt((formData.get("position") as string) || "0"),
    is_active: formData.get("is_active") === "true",
  });
  if (result.error) throw new Error(result.error);
  redirect("/admin/system-context");
}

export async function deleteContextEntryAction(id: string) {
  const result = await deleteContextEntry(id);
  if (result.error) throw new Error(result.error);
  redirect("/admin/system-context");
}

export async function toggleContextActiveAction(id: string, isActive: boolean) {
  const result = await toggleActive(id, isActive);
  return result;
}
