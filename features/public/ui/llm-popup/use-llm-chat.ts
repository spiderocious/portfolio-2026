"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

const SESSION_KEY = "feranmi_llm_session";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useLlmChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    sessionRef.current = getOrCreateSessionId();
  }, []);

  const send = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || streaming) return;

    setError(null);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };
    const placeholder: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg, placeholder]);

    setStreaming(true);
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionRef.current, message: trimmed }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        let msg = "something went wrong";
        try {
          const body = await res.json();
          msg = body.error ?? msg;
        } catch {}
        setError(msg);
        // remove the empty placeholder
        setMessages((prev) => prev.filter((m) => m.id !== placeholder.id));
        return;
      }

      if (!res.body) {
        setError("no response body");
        setMessages((prev) => prev.filter((m) => m.id !== placeholder.id));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      let done = false;
      while (!done) {
        const chunk = await reader.read();
        done = chunk.done;
        if (chunk.value) {
          acc += decoder.decode(chunk.value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === placeholder.id ? { ...m, content: acc } : m))
          );
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError("network error");
      }
      setMessages((prev) => prev.filter((m) => m.content !== ""));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [streaming]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, streaming, error, send, stop };
}
