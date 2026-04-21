import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getMessagesByConversationId } from "@/lib/services/chats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export { corsPreflight as OPTIONS } from "@/lib/api/cors";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id")?.trim();

  if (!sessionId) {
    return NextResponse.json({ messages: [] });
  }

  const db = await getDb();
  const { data } = await db
    .from("llm_conversations")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle();

  const convoId = (data as { id: string } | null)?.id;
  if (!convoId) return NextResponse.json({ messages: [] });

  const rows = await getMessagesByConversationId(convoId);
  const messages = rows.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    createdAt: new Date(m.created_at).getTime(),
  }));

  return NextResponse.json({ messages });
}
