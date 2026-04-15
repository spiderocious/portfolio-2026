"use server";

import { revalidatePath } from "next/cache";
import { createActivityEntry, deleteActivityEntry } from "@/lib/services/activity";
import type { ActivityType } from "@/lib/services/types";

export async function createActivityEntryAction(formData: FormData) {
  const result = await createActivityEntry({
    type: formData.get("type") as ActivityType,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    url: (formData.get("url") as string) || null,
  });
  if ("error" in result) throw new Error(result.error);
  revalidatePath("/admin/activity");
  return { success: true };
}

export async function deleteActivityEntryAction(id: string) {
  const result = await deleteActivityEntry(id);
  if (result.error) throw new Error(result.error);
  revalidatePath("/admin/activity");
  return { success: true };
}
