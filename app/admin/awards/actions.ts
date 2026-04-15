"use server";

import { redirect } from "next/navigation";
import { createAward, updateAward, deleteAward } from "@/lib/services/awards";

export async function createAwardAction(formData: FormData) {
  const result = await createAward({
    title: formData.get("title") as string,
    issuer: formData.get("issuer") as string,
    date: formData.get("date") as string,
    url: (formData.get("url") as string) || null,
    description: (formData.get("description") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
  });
  if ("error" in result) throw new Error(result.error);
  redirect("/admin/awards");
}

export async function updateAwardAction(id: string, formData: FormData) {
  const result = await updateAward(id, {
    title: formData.get("title") as string,
    issuer: formData.get("issuer") as string,
    date: formData.get("date") as string,
    url: (formData.get("url") as string) || null,
    description: (formData.get("description") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
  });
  if (result.error) throw new Error(result.error);
  redirect("/admin/awards");
}

export async function deleteAwardAction(id: string) {
  const result = await deleteAward(id);
  if (result.error) throw new Error(result.error);
  redirect("/admin/awards");
}
