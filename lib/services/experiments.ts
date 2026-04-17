import { revalidatePath } from "next/cache";
import { getDb, getBuildDb } from "@/lib/db";
import type { Experiment, CreateExperimentInput, UpdateExperimentInput, VoidResult } from "./types";

const FIELDS = "id, title, slug, description, status, stack, links, cover_image, featured, position, created_at, updated_at";

export async function getAllExperiments(): Promise<Experiment[]> {
  const db = await getDb();
  const { data } = await db.from("experiments").select(FIELDS).order("position", { ascending: true });
  return (data as unknown as Experiment[]) ?? [];
}

/** Build-time variant — no cookies. Safe to call from `generateStaticParams`. */
export async function getAllExperimentSlugsForBuild(): Promise<Array<{ slug: string }>> {
  const db = getBuildDb();
  const { data } = await db.from("experiments").select("slug").order("position", { ascending: true });
  return ((data as unknown as Array<{ slug: string }>) ?? []).filter((r) => !!r.slug);
}

export async function getExperimentBySlug(slug: string): Promise<Experiment | null> {
  const db = await getDb();
  const { data } = await db.from("experiments").select(FIELDS).eq("slug", slug).single();
  return (data as unknown as Experiment) ?? null;
}

export async function getExperimentById(id: string): Promise<Experiment | null> {
  const db = await getDb();
  const { data } = await db.from("experiments").select(FIELDS).eq("id", id).single();
  return (data as unknown as Experiment) ?? null;
}

export async function createExperiment(
  input: CreateExperimentInput
): Promise<{ id: string; slug: string } | { error: string }> {
  const db = await getDb();
  const { data, error } = await db
    .from("experiments")
    .insert({
      title: input.title,
      slug: input.slug,
      description: input.description,
      status: input.status,
      stack: input.stack ?? [],
      links: input.links ?? {},
      cover_image: input.cover_image ?? null,
      featured: input.featured ?? false,
      position: input.position ?? 0,
    })
    .select("id, slug")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/experiments");
  const row = data as unknown as { id: string; slug: string };
  return { id: row.id, slug: row.slug };
}

export async function updateExperiment(id: string, input: UpdateExperimentInput): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db
    .from("experiments")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/experiments");
  if (input.slug) revalidatePath(`/experiments/${input.slug}`);
  return { error: null };
}

export async function deleteExperiment(id: string): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db.from("experiments").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/experiments");
  return { error: null };
}
