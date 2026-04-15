"use server";

import { revalidatePath } from "next/cache";
import {
  createBoardItem, updateBoardItem, deleteBoardItem,
  createSubItem, updateSubItem, deleteSubItem,
} from "@/lib/services/board";
import type { BoardStatus, BoardCategory, BoardPriority, CreateSubItemInput, UpdateSubItemInput } from "@/lib/services/types";

export async function createBoardItemAction(formData: FormData) {
  const result = await createBoardItem({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    status: formData.get("status") as BoardStatus,
    category: formData.get("category") as BoardCategory,
    priority: (formData.get("priority") as BoardPriority) || null,
    due_date: (formData.get("due_date") as string) || null,
    is_private: formData.get("is_private") === "true",
  });
  revalidatePath("/admin/board");
  return result;
}

export async function updateBoardItemAction(id: string, formData: FormData) {
  const result = await updateBoardItem(id, {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    status: formData.get("status") as BoardStatus,
    category: formData.get("category") as BoardCategory,
    priority: (formData.get("priority") as BoardPriority) || null,
    due_date: (formData.get("due_date") as string) || null,
    is_private: formData.get("is_private") === "true",
  });
  revalidatePath("/admin/board");
  return result;
}

export async function deleteBoardItemAction(id: string) {
  const result = await deleteBoardItem(id);
  revalidatePath("/admin/board");
  return result;
}

export async function createSubItemAction(parentId: string, input: CreateSubItemInput) {
  const result = await createSubItem(parentId, input);
  revalidatePath("/admin/board");
  return result;
}

export async function updateSubItemAction(id: string, input: UpdateSubItemInput) {
  const result = await updateSubItem(id, input);
  revalidatePath("/admin/board");
  return result;
}

export async function deleteSubItemAction(id: string) {
  const result = await deleteSubItem(id);
  revalidatePath("/admin/board");
  return result;
}
