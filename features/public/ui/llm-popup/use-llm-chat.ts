"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

const SESSION_KEY = "feranmi_llm_session";

function newSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readSessionId(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(SESSION_KEY) ?? "";
}

function writeSessionId(id: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, id);
}

function clearSessionId() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function useLlmChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [hydrating, setHydrating] = useState(true);
  const sessionRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const suggestionAbortRef = useRef<AbortController | null>(null);
  const hydrateAbortRef = useRef<AbortController | null>(null);

  // On mount: if we already have a session id in this tab, hydrate history
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const existing = readSessionId();
      if (!existing) {
        // No prior conversation — start fresh
        const id = newSessionId();
        writeSessionId(id);
        sessionRef.current = id;
        if (!cancelled) setHydrating(false);
        return;
      }

      sessionRef.current = existing;

      const ctl = new AbortController();
      hydrateAbortRef.current = ctl;
      try {
        const res = await fetch(
          `/api/llm/history?session_id=${encodeURIComponent(existing)}`,
          { signal: ctl.signal, cache: "no-store" }
        );
        if (!res.ok) {
          if (!cancelled) setHydrating(false);
          return;
        }
        const data: { messages?: ChatMessage[] } = await res.json();
        if (cancelled) return;
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages);
        }
      } catch {
        // silent — it's ok if hydration fails; user can still chat
      } finally {
        if (!cancelled) setHydrating(false);
      }
    }

    hydrate();

    return () => {
      cancelled = true;
      hydrateAbortRef.current?.abort();
    };
  }, []);

  const fetchSuggestions = useCallback(async (history: ChatMessage[]) => {
    suggestionAbortRef.current?.abort();
    const ctl = new AbortController();
    suggestionAbortRef.current = ctl;

    setLoadingSuggestions(true);
    try {
      const res = await fetch("/api/llm/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctl.signal,
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!res.ok) return;
      const data: { suggestions?: string[] } = await res.json();
      if (Array.isArray(data.suggestions)) setSuggestions(data.suggestions);
    } catch {
      // silent — suggestions are non-critical
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const send = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || streaming) return;
      if (!sessionRef.current) {
        // Should not happen post-hydration, but be safe
        const id = newSessionId();
        writeSessionId(id);
        sessionRef.current = id;
      }

      setError(null);
      setSuggestions([]);

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
            if (res.status === 429 && typeof body.retry_in === "number") {
              const secs = body.retry_in as number;
              const mins = Math.ceil(secs / 60);
              const wait = mins >= 2 ? `${mins} minutes` : `${secs} seconds`;
              msg = `you've hit your limit of ${body?.limit ?? "10"} messages per window — you can try again in ${wait}, or reach out to me personally at devferanmi@gmail.com`;
            } else {
              msg = body.error ?? msg;
            }
          } catch {}
          setError(msg);
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

        const finalHistory = [
          ...messages,
          userMsg,
          { ...placeholder, content: acc },
        ];
        void fetchSuggestions(finalHistory);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError("network error");
        setMessages((prev) => prev.filter((m) => m.content !== ""));
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [streaming, messages, fetchSuggestions]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  /**
   * Starts a fresh chat by rotating the session id.
   * Server-side the old conversation is kept intact (admin can still see it in /admin/chats);
   * the user just gets a new thread.
   */
  const reset = useCallback(() => {
    abortRef.current?.abort();
    suggestionAbortRef.current?.abort();
    hydrateAbortRef.current?.abort();
    clearSessionId();
    const fresh = newSessionId();
    writeSessionId(fresh);
    sessionRef.current = fresh;
    setMessages([]);
    setSuggestions([]);
    setError(null);
    setStreaming(false);
  }, []);

  return {
    messages,
    streaming,
    error,
    suggestions,
    loadingSuggestions,
    hydrating,
    send,
    stop,
    reset,
  };
}
