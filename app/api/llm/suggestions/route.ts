import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

export { corsPreflight as OPTIONS } from "@/lib/api/cors";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const FALLBACK_SUGGESTIONS = [
  "what's his current tech stack?",
  "what project is he proudest of?",
  "is he open to work?",
];

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
  }

  let body: { messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
  }

  const recent = (body.messages ?? []).slice(-6);
  if (recent.length === 0) {
    return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const transcript = recent
      .map((m) => `${m.role === "user" ? "VISITOR" : "FERANMI.AI"}: ${m.content}`)
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You generate 3 short follow-up questions a visitor might ask next about Feranmi (a software engineer). " +
            "Questions should be: natural, curious, 4-9 words each, lowercase preferred, no emojis, and should NOT repeat what was already asked. " +
            "Return strict JSON of the form: {\"suggestions\":[\"...\",\"...\",\"...\"]}",
        },
        {
          role: "user",
          content: `Here is the recent conversation:\n\n${transcript}\n\nSuggest 3 natural next questions.`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as { suggestions?: string[] };
    const suggestions = (parsed.suggestions ?? [])
      .filter((s) => typeof s === "string" && s.trim().length > 0)
      .slice(0, 3);

    return NextResponse.json({
      suggestions: suggestions.length === 3 ? suggestions : FALLBACK_SUGGESTIONS,
    });
  } catch {
    return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
  }
}
