import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import type { Experience, CreateExperienceInput, UpdateExperienceInput, ReorderItem, VoidResult } from "./types";

const FIELDS = "id, company, role, description, achievements, start_date, end_date, location, company_url, logo_url, position, created_at, updated_at";

export async function getAllExperience(): Promise<Experience[]> {
  const db = await getDb();
  const { data } = await db.from("experience").select(FIELDS).order("position", { ascending: true });
  return (data as unknown as Experience[]) ?? [];
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  const db = await getDb();
  const { data } = await db.from("experience").select(FIELDS).eq("id", id).single();
  return (data as unknown as Experience) ?? null;
}

export async function createExperience(
  input: CreateExperienceInput
): Promise<{ id: string } | { error: string }> {
  const db = await getDb();
  const { data, error } = await db
    .from("experience")
    .insert({
      company: input.company,
      role: input.role,
      description: input.description,
      achievements: input.achievements,
      start_date: input.start_date,
      end_date: input.end_date ?? null,
      location: input.location ?? null,
      company_url: input.company_url ?? null,
      logo_url: input.logo_url ?? null,
      position: input.position ?? 0,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/experience");
  return { id: (data as unknown as { id: string }).id };
}

export async function updateExperience(id: string, input: UpdateExperienceInput): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db
    .from("experience")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/experience");
  return { error: null };
}

export async function deleteExperience(id: string): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db.from("experience").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/experience");
  return { error: null };
}

export async function reorderExperience(items: ReorderItem[]): Promise<VoidResult> {
  const db = await getDb();
  const results = await Promise.all(
    items.map(({ id, position }) => db.from("experience").update({ position }).eq("id", id))
  );
  const failed = results.find((r) => r.error);
  return failed ? { error: failed.error!.message } : { error: null };
}
