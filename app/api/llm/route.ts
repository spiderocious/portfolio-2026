import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  getOrCreateConversation,
  appendMessage,
  getConversationHistory,
} from "@/lib/services/chats";
import { getAssembledSystemPrompt } from "@/lib/services/system-context";
import { streamChatResponse } from "@/lib/services/llm";

export const runtime = "nodejs";

export { corsPreflight as OPTIONS } from "@/lib/api/cors";

// ─── Rate limiting (in-memory, per-IP) ────────────────────────────
const BUCKET = new Map<string, { count: number; reset: number }>();
const LIMIT = 10;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function rateLimit(ip: string): { ok: boolean; retry_in?: number } {
  const now = Date.now();
  const rec = BUCKET.get(ip);
  if (!rec || rec.reset < now) {
    BUCKET.set(ip, { count: 1, reset: now + WINDOW_MS });
    return { ok: true };
  }
  if (rec.count >= LIMIT) {
    return { ok: false, retry_in: Math.ceil((rec.reset - now) / 1000) };
  }
  rec.count++;
  return { ok: true };
}

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  let body: { session_id?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const sessionId = body.session_id?.trim();
  const userMessage = body.message?.trim();

  if (!sessionId || !userMessage) {
    return NextResponse.json({ error: "session_id and message required" }, { status: 400 });
  }
  if (userMessage.length > 2000) {
    return NextResponse.json({ error: "message too long" }, { status: 400 });
  }

  const ip = getClientIp(req);
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "slow down, come back in a bit", retry_in: limit.retry_in },
      { status: 429 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "llm not configured" }, { status: 503 });
  }

  try {
    const convo = await getOrCreateConversation(sessionId, hashIp(ip));
    await appendMessage(convo.id, "user", userMessage);

    const [{ prompt }, history] = await Promise.all([
      getAssembledSystemPrompt(),
      getConversationHistory(convo.id),
    ]);

    const effectivePrompt = prompt ||
      "You are Feranmi's portfolio assistant. Answer questions about his work, experience, and projects warmly and concisely.";
    
    const promptWithDate = `${effectivePrompt}\n\nCurrent date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;

    const sourceStream = await streamChatResponse(history, promptWithDate);

    // Tee the stream so we can collect the full assistant response and persist it
    let full = "";
    const passthrough = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        full += new TextDecoder().decode(chunk, { stream: true });
        controller.enqueue(chunk);
      },
      async flush() {
        if (full) {
          try {
            await appendMessage(convo.id, "assistant", full);
          } catch {
            // swallow — best-effort persistence
          }
        }
      },
    });

    return new Response(sourceStream.pipeThrough(passthrough), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("[/api/llm] error", err);
    return NextResponse.json({ error: "something went wrong" }, { status: 500 });
  }
}
