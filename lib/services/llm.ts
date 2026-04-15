import OpenAI from "openai";
import type { OpenAIMessage } from "./types";
import { getAssembledSystemPrompt } from "./system-context";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function streamChatResponse(
  messages: OpenAIMessage[],
  systemPrompt: string,
  model = "gpt-4o-mini"
): Promise<ReadableStream<Uint8Array>> {
  const stream = await openai.chat.completions.create({
    model,
    stream: true,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.controller.abort();
    },
  });
}

export async function buildSystemPrompt(): Promise<{ prompt: string; entry_count: number }> {
  return getAssembledSystemPrompt();
}
