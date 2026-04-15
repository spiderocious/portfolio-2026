import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import type { Project, CreateProjectInput, UpdateProjectInput, ReorderItem, VoidResult } from "./types";

const FIELDS = "id, title, slug, description, status, stack, cover_image, links, live_data, featured, position, created_at, updated_at";

export async function getAllProjects(): Promise<Project[]> {
  const db = await getDb();
  const { data } = await db.from("projects").select(FIELDS).order("position", { ascending: true });
  return (data as unknown as Project[]) ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = await getDb();
  const { data } = await db.from("projects").select(FIELDS).eq("slug", slug).single();
  return (data as unknown as Project) ?? null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const db = await getDb();
  const { data } = await db.from("projects").select(FIELDS).eq("id", id).single();
  return (data as unknown as Project) ?? null;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const db = await getDb();
  const { data } = await db
    .from("projects")
    .select(FIELDS)
    .eq("featured", true)
    .order("position", { ascending: true });
  return (data as unknown as Project[]) ?? [];
}

export async function createProject(
  input: CreateProjectInput
): Promise<{ id: string; slug: string } | { error: string }> {
  const db = await getDb();
  const { data, error } = await db
    .from("projects")
    .insert({
      title: input.title,
      slug: input.slug,
      description: input.description,
      status: input.status,
      stack: input.stack ?? [],
      cover_image: input.cover_image ?? null,
      links: input.links ?? {},
      live_data: input.live_data ?? null,
      featured: input.featured ?? false,
      position: input.position ?? 0,
    })
    .select("id, slug")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/projects");
  const row = data as unknown as { id: string; slug: string };
  return { id: row.id, slug: row.slug };
}

export async function updateProject(id: string, input: UpdateProjectInput): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db
    .from("projects")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/projects");
  if (input.slug) revalidatePath(`/projects/${input.slug}`);
  return { error: null };
}

export async function deleteProject(id: string): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/projects");
  return { error: null };
}

export async function reorderProjects(items: ReorderItem[]): Promise<VoidResult> {
  const db = await getDb();
  const results = await Promise.all(
    items.map(({ id, position }) => db.from("projects").update({ position }).eq("id", id))
  );
  const failed = results.find((r) => r.error);
  return failed ? { error: failed.error!.message } : { error: null };
}
