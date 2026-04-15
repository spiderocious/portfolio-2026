import { getDb } from "@/lib/db";
import type {
  SystemContextEntry, CreateContextEntryInput,
  UpdateContextEntryInput, ReorderItem, VoidResult,
} from "./types";

const FIELDS = "id, label, content, category, position, is_active, created_at, updated_at";

export async function getAllContextEntries(): Promise<SystemContextEntry[]> {
  const db = await getDb();
  const { data } = await db
    .from("system_convos")
    .select(FIELDS)
    .order("position", { ascending: true });
  return (data as unknown as SystemContextEntry[]) ?? [];
}

export async function getContextEntryById(id: string): Promise<SystemContextEntry | null> {
  const db = await getDb();
  const { data } = await db.from("system_convos").select(FIELDS).eq("id", id).single();
  return (data as unknown as SystemContextEntry) ?? null;
}

export async function getActiveContextEntries(): Promise<SystemContextEntry[]> {
  const db = await getDb();
  const { data } = await db
    .from("system_convos")
    .select(FIELDS)
    .eq("is_active", true)
    .order("position", { ascending: true });
  return (data as unknown as SystemContextEntry[]) ?? [];
}

export async function getAssembledSystemPrompt(): Promise<{ prompt: string; entry_count: number }> {
  const entries = await getActiveContextEntries();
  return {
    prompt: entries.map((e) => e.content).join("\n\n"),
    entry_count: entries.length,
  };
}

export async function createContextEntry(
  input: CreateContextEntryInput
): Promise<{ id: string } | { error: string }> {
  const db = await getDb();
  const { data, error } = await db
    .from("system_convos")
    .insert({
      label: input.label,
      content: input.content,
      category: input.category ?? null,
      position: input.position ?? 0,
      is_active: input.is_active ?? true,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: (data as unknown as { id: string }).id };
}

export async function updateContextEntry(
  id: string,
  input: UpdateContextEntryInput
): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db
    .from("system_convos")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  return error ? { error: error.message } : { error: null };
}

export async function deleteContextEntry(id: string): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db.from("system_convos").delete().eq("id", id);
  return error ? { error: error.message } : { error: null };
}

export async function toggleActive(id: string, isActive: boolean): Promise<VoidResult> {
  return updateContextEntry(id, { is_active: isActive });
}

export async function reorderContextEntries(items: ReorderItem[]): Promise<VoidResult> {
  const db = await getDb();
  const results = await Promise.all(
    items.map(({ id, position }) => db.from("system_convos").update({ position }).eq("id", id))
  );
  const failed = results.find((r) => r.error);
  return failed ? { error: failed.error!.message } : { error: null };
}
