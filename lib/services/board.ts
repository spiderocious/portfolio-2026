import { getDb } from "@/lib/db";
import type {
  BoardItem, BoardGrouped, BoardStatus, SubItem,
  CreateBoardItemInput, UpdateBoardItemInput,
  CreateSubItemInput, UpdateSubItemInput,
  ReorderItem, VoidResult,
} from "./types";

const ITEM_FIELDS = "id, title, description, status, category, priority, due_date, is_private, position, created_at, updated_at";
const SUB_FIELDS = "id, parent_id, title, description, status, is_private, position, created_at, updated_at";

function grouped(items: BoardItem[]): BoardGrouped {
  const g: BoardGrouped = { backlog: [], in_progress: [], done: [], on_hold: [] };
  for (const item of items) g[item.status].push(item);
  return g;
}

export async function getBoardItems(
  options: { includePrivate?: boolean } = {}
): Promise<BoardGrouped> {
  const db = await getDb();

  let itemQuery = db.from("board_items").select(ITEM_FIELDS).order("position", { ascending: true });
  if (!options.includePrivate) itemQuery = itemQuery.eq("is_private", false);

  const { data: itemData } = await itemQuery;
  const items = (itemData ?? []) as unknown as Omit<BoardItem, "sub_items">[];

  if (items.length === 0) return { backlog: [], in_progress: [], done: [], on_hold: [] };

  let subQuery = db
    .from("board_sub_items")
    .select(SUB_FIELDS)
    .in("parent_id", items.map((i) => i.id))
    .order("position", { ascending: true });
  if (!options.includePrivate) subQuery = subQuery.eq("is_private", false);

  const { data: subData } = await subQuery;
  const subItems = (subData ?? []) as unknown as SubItem[];

  const subMap: Record<string, SubItem[]> = {};
  for (const sub of subItems) {
    (subMap[sub.parent_id] ??= []).push(sub);
  }

  const withSubs: BoardItem[] = items.map((item) => ({
    ...item,
    sub_items: subMap[item.id] ?? [],
  }));

  return grouped(withSubs);
}

export async function getBoardItemById(id: string): Promise<BoardItem | null> {
  const db = await getDb();
  const [{ data: itemData }, { data: subData }] = await Promise.all([
    db.from("board_items").select(ITEM_FIELDS).eq("id", id).single(),
    db.from("board_sub_items").select(SUB_FIELDS).eq("parent_id", id).order("position", { ascending: true }),
  ]);

  if (!itemData) return null;
  return {
    ...(itemData as unknown as Omit<BoardItem, "sub_items">),
    sub_items: (subData as unknown as SubItem[]) ?? [],
  };
}

export async function createBoardItem(
  input: CreateBoardItemInput
): Promise<{ id: string } | { error: string }> {
  const db = await getDb();
  const { data, error } = await db
    .from("board_items")
    .insert({
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      category: input.category,
      priority: input.priority ?? null,
      due_date: input.due_date ?? null,
      is_private: input.is_private ?? false,
      position: input.position ?? 0,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: (data as unknown as { id: string }).id };
}

export async function updateBoardItem(id: string, input: UpdateBoardItemInput): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db
    .from("board_items")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  return error ? { error: error.message } : { error: null };
}

export async function deleteBoardItem(id: string): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db.from("board_items").delete().eq("id", id);
  return error ? { error: error.message } : { error: null };
}

export async function reorderBoardItems(items: ReorderItem[]): Promise<VoidResult> {
  const db = await getDb();
  const results = await Promise.all(
    items.map(({ id, position }) => db.from("board_items").update({ position }).eq("id", id))
  );
  const failed = results.find((r) => r.error);
  return failed ? { error: failed.error!.message } : { error: null };
}

export async function moveBoardItem(id: string, status: BoardStatus): Promise<VoidResult> {
  return updateBoardItem(id, { status });
}

// ─── Sub-items ────────────────────────────────────────────────────────────────

export async function getSubItems(
  parentId: string,
  options: { includePrivate?: boolean } = {}
): Promise<SubItem[]> {
  const db = await getDb();
  let query = db
    .from("board_sub_items")
    .select(SUB_FIELDS)
    .eq("parent_id", parentId)
    .order("position", { ascending: true });
  if (!options.includePrivate) query = query.eq("is_private", false);

  const { data } = await query;
  return (data as unknown as SubItem[]) ?? [];
}

export async function createSubItem(
  parentId: string,
  input: CreateSubItemInput
): Promise<{ id: string } | { error: string }> {
  const db = await getDb();
  const { data, error } = await db
    .from("board_sub_items")
    .insert({
      parent_id: parentId,
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      is_private: input.is_private ?? false,
      position: input.position ?? 0,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: (data as unknown as { id: string }).id };
}

export async function updateSubItem(id: string, input: UpdateSubItemInput): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db
    .from("board_sub_items")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  return error ? { error: error.message } : { error: null };
}

export async function deleteSubItem(id: string): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db.from("board_sub_items").delete().eq("id", id);
  return error ? { error: error.message } : { error: null };
}
