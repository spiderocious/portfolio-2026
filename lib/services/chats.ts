import { getDb } from "@/lib/db";
import type { Conversation, LlmMessage, OpenAIMessage } from "./types";

export async function getAllConversations(): Promise<Conversation[]> {
  const db = await getDb();
  const { data } = await db
    .from("llm_conversations")
    .select("id, session_id, ip_hash, started_at, last_message_at, message_count")
    .order("last_message_at", { ascending: false });
  return (data as unknown as Conversation[]) ?? [];
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  const db = await getDb();
  const { data } = await db
    .from("llm_conversations")
    .select("id, session_id, ip_hash, started_at, last_message_at, message_count")
    .eq("id", id)
    .single();
  return (data as unknown as Conversation) ?? null;
}

export async function getMessagesByConversationId(conversationId: string): Promise<LlmMessage[]> {
  const db = await getDb();
  const { data } = await db
    .from("llm_messages")
    .select("id, conversation_id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  return (data as unknown as LlmMessage[]) ?? [];
}

export async function getOrCreateConversation(
  sessionId: string,
  ipHash?: string | null
): Promise<{ id: string; session_id: string; message_count: number; is_new: boolean }> {
  const db = await getDb();

  const { data: existing } = await db
    .from("llm_conversations")
    .select("id, session_id, message_count")
    .eq("session_id", sessionId)
    .single();

  if (existing) {
    const row = existing as unknown as { id: string; session_id: string; message_count: number };
    return { ...row, is_new: false };
  }

  const now = new Date().toISOString();
  const { data: created, error } = await db
    .from("llm_conversations")
    .insert({
      session_id: sessionId,
      ip_hash: ipHash ?? null,
      started_at: now,
      last_message_at: now,
      message_count: 0,
    })
    .select("id, session_id, message_count")
    .single();

  if (error || !created) throw new Error(error?.message ?? "Failed to create conversation");

  const row = created as unknown as { id: string; session_id: string; message_count: number };
  return { ...row, is_new: true };
}

export async function appendMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
): Promise<{ id: string } | { error: string }> {
  const db = await getDb();
  const now = new Date().toISOString();

  const { data, error } = await db
    .from("llm_messages")
    .insert({ conversation_id: conversationId, role, content })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Increment message count and update last_message_at
  await db
    .from("llm_conversations")
    .update({
      last_message_at: now,
      message_count: db.rpc("increment_message_count", { convo_id: conversationId }),
    })
    .eq("id", conversationId);

  return { id: (data as unknown as { id: string }).id };
}

export async function getConversationHistory(conversationId: string): Promise<OpenAIMessage[]> {
  const messages = await getMessagesByConversationId(conversationId);
  return messages.map((m) => ({ role: m.role, content: m.content }));
}
