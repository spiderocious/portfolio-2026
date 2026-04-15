import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import type { Award, CreateAwardInput, UpdateAwardInput, ReorderItem, VoidResult } from "./types";

const FIELDS = "id, title, issuer, description, date, url, image_url, position, created_at, updated_at";

export async function getAllAwards(): Promise<Award[]> {
  const db = await getDb();
  const { data } = await db.from("awards").select(FIELDS).order("position", { ascending: true });
  return (data as unknown as Award[]) ?? [];
}

export async function getAwardById(id: string): Promise<Award | null> {
  const db = await getDb();
  const { data } = await db.from("awards").select(FIELDS).eq("id", id).single();
  return (data as unknown as Award) ?? null;
}

export async function createAward(
  input: CreateAwardInput
): Promise<{ id: string } | { error: string }> {
  const db = await getDb();
  const { data, error } = await db
    .from("awards")
    .insert({
      title: input.title,
      issuer: input.issuer,
      description: input.description ?? null,
      date: input.date,
      url: input.url ?? null,
      image_url: input.image_url ?? null,
      position: input.position ?? 0,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/awards");
  return { id: (data as unknown as { id: string }).id };
}

export async function updateAward(id: string, input: UpdateAwardInput): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db
    .from("awards")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/awards");
  return { error: null };
}

export async function deleteAward(id: string): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db.from("awards").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/awards");
  return { error: null };
}

export async function reorderAwards(items: ReorderItem[]): Promise<VoidResult> {
  const db = await getDb();
  const results = await Promise.all(
    items.map(({ id, position }) => db.from("awards").update({ position }).eq("id", id))
  );
  const failed = results.find((r) => r.error);
  return failed ? { error: failed.error!.message } : { error: null };
}
