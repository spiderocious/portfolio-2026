"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLlmChat, type ChatMessage } from "./use-llm-chat";
import { LlmTrigger } from "./llm-trigger";

const STARTER_SUGGESTIONS = [
  "what's feranmi working on right now?",
  "tell me about his fintech work",
  "what's his tech stack?",
  "is he open to work?",
];

export function LlmPopup() {
  const [open, setOpen] = useState(false);
  const { messages, streaming, error, suggestions, send, reset } = useLlmChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Jump instantly to bottom (no animation) — used when opening / hydrating
  const jumpToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  // Smooth scroll to bottom — used as new messages stream in
  const smoothScrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  // Jump to bottom the moment the dialog mounts (covers hydrated history + refresh)
  useLayoutEffect(() => {
    if (!open) return;
    // Run in a rAF so the content has laid out before we measure scrollHeight
    const raf = requestAnimationFrame(jumpToBottom);
    return () => cancelAnimationFrame(raf);
  }, [open, jumpToBottom]);

  // On every message/streaming update while open, keep the view pinned to the bottom
  useEffect(() => {
    if (!open) return;
    // rAF so the DOM reflects the latest chunk before we scroll
    const raf = requestAnimationFrame(smoothScrollToBottom);
    return () => cancelAnimationFrame(raf);
  }, [messages, streaming, open, smoothScrollToBottom]);

  // Focus on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 260);
  }, [open]);

  // Lock scroll + escape close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Open from global event (nav, footer, etc)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-llm", handler);
    return () => window.removeEventListener("open-llm", handler);
  }, []);

  // Auto-grow textarea up to a max
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [input]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || streaming) return;
    send(input);
    setInput("");
  }

  const hasMessages = messages.length > 0;

  return (
    <>
      <LlmTrigger hidden={open} onOpen={() => setOpen(true)} />

      <AnimatePresence>
        {open && (
          <motion.div
            key="llm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex flex-col"
            style={{
              background: "var(--bg)",
              fontFamily: "var(--font-mono)",
            }}
            role="dialog"
            aria-label="Chat with Feranmi.ai"
          >
            {/* Header */}
            <header
              className="flex items-center justify-between px-4 md:px-8 py-3.5 border-b"
              style={{
                borderColor: "var(--border-soft)",
                background: "var(--bg)",
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative"
                  style={{ background: "var(--ink)", color: "var(--bg)" }}
                >
                  <SparkMark />
                  <motion.span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                    style={{
                      background: "#4ade80",
                      border: "2px solid var(--bg)",
                    }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px]" style={{ color: "var(--ink)", fontWeight: 600 }}>
                    feranmi.ai
                  </p>
                  <p
                    className="text-[11px] truncate"
                    style={{ color: "var(--ink-3)" }}
                  >
                    {streaming ? "thinking…" : "online · ask anything about me"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {hasMessages && (
                  <button
                    type="button"
                    onClick={reset}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-[0.15em] uppercase cursor-pointer transition-colors hover:text-[var(--ink)]"
                    style={{
                      color: "var(--ink-3)",
                      border: "1px solid var(--border-soft)",
                      borderRadius: 6,
                    }}
                  >
                    <RefreshIcon /> new chat
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                  style={{
                    color: "var(--ink-2)",
                    background: "var(--bg-raised)",
                  }}
                >
                  ✕
                </button>
              </div>
            </header>

            {/* Body */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto"
              style={{ background: "var(--bg)" }}
            >
              <div className="mx-auto w-full max-w-[760px] px-4 md:px-6 py-6 md:py-10">
                {hasMessages ? (
                  <ul className="flex flex-col gap-6">
                    {messages.map((m) => (
                      <MessageBubble key={m.id} message={m} streaming={streaming} />
                    ))}
                  </ul>
                ) : (
                  <EmptyState onPick={(q) => send(q)} />
                )}
              </div>
            </div>

            {error && (
              <p
                className="mx-auto w-full max-w-[760px] px-4 md:px-6 py-2 text-[12px]"
                style={{
                  color: "#f87171",
                  background: "var(--bg)",
                }}
              >
                {error}
              </p>
            )}

            {/* Suggestions above input (ChatGPT-style "keep the conversation going") */}
            <AnimatePresence>
              {hasMessages && !streaming && suggestions.length > 0 && (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25 }}
                  className="border-t"
                  style={{
                    borderColor: "var(--border-soft)",
                    background: "var(--bg)",
                  }}
                >
                  <div className="mx-auto w-full max-w-[760px] px-4 md:px-6 py-3">
                    <p
                      className="text-[10px] tracking-[0.2em] uppercase mb-2"
                      style={{ color: "var(--ink-4)" }}
                    >
                      suggested next
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {suggestions.map((s) => (
                        <motion.button
                          key={s}
                          type="button"
                          onClick={() => send(s)}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.97 }}
                          className="text-[12.5px] px-3 py-1.5 cursor-pointer text-left transition-colors hover:text-[var(--ink)]"
                          style={{
                            border: "1px solid var(--border-soft)",
                            borderRadius: 999,
                            color: "var(--ink-2)",
                            background: "var(--bg-raised)",
                          }}
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <form
              onSubmit={submit}
              className="border-t shrink-0"
              style={{
                borderColor: "var(--border-soft)",
                background: "var(--bg)",
              }}
            >
              <div className="mx-auto w-full max-w-[760px] px-4 md:px-6 py-4">
                <div
                  className="flex items-end gap-2 p-2"
                  style={{
                    background: "var(--bg-raised)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: 16,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  }}
                >
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={hasMessages ? "reply to feranmi.ai…" : "ask anything about feranmi…"}
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        submit(e);
                      }
                    }}
                    className="flex-1 resize-none text-[15px] outline-none bg-transparent px-3 py-2.5 min-h-[44px]"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--ink)",
                      lineHeight: 1.5,
                    }}
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || streaming}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Send"
                    className="shrink-0 w-10 h-10 flex items-center justify-center disabled:opacity-30 cursor-pointer transition-opacity"
                    style={{
                      color: "var(--bg)",
                      background: "var(--ink)",
                      borderRadius: 10,
                    }}
                  >
                    {streaming ? <LoadingDots /> : <SendArrow />}
                  </motion.button>
                </div>
                <p
                  className="text-[10.5px] mt-2 text-center"
                  style={{ color: "var(--ink-4)" }}
                >
                  enter to send · shift+enter for newline · esc to close
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Message bubble (ChatGPT-like row layout, not chat-bubble on sides) ───

function MessageBubble({
  message,
  streaming,
}: {
  message: ChatMessage;
  streaming: boolean;
}) {
  const isUser = message.role === "user";
  const isStreamingThis = streaming && !isUser && message.content === "";

  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-3 md:gap-4"
    >
      <Avatar role={message.role} />
      <div className="flex-1 min-w-0 pt-0.5">
        <p
          className="text-[11px] tracking-[0.15em] uppercase mb-1.5"
          style={{ color: "var(--ink-4)" }}
        >
          {isUser ? "you" : "feranmi.ai"}
        </p>
        {isStreamingThis ? (
          <TypingDots />
        ) : (
          <div
            className="text-[14.5px] md:text-[15px] leading-[1.7] whitespace-pre-wrap break-words"
            style={{ color: "var(--ink)" }}
          >
            {message.content}
            {streaming && !isUser && message.content !== "" && <BlinkingCaret />}
          </div>
        )}
      </div>
    </motion.li>
  );
}

function Avatar({ role }: { role: "user" | "assistant" }) {
  const isUser = role === "user";
  return (
    <div
      className="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-full flex items-center justify-center"
      style={{
        background: isUser ? "var(--bg-raised)" : "var(--ink)",
        color: isUser ? "var(--ink-2)" : "var(--bg)",
        border: isUser ? "1px solid var(--border-soft)" : "none",
      }}
    >
      {isUser ? <UserGlyph /> : <SparkMark />}
    </div>
  );
}

// ─── Empty state ───

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex flex-col gap-10 pt-6 md:pt-16">
      <div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "var(--ink)", color: "var(--bg)" }}
        >
          <SparkMark size={22} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.1] tracking-tight text-center"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
        >
          what would you like to know?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="text-[14px] mt-3 text-center max-w-md mx-auto leading-[1.65]"
          style={{ color: "var(--ink-3)" }}
        >
          grounded in feranmi&apos;s actual work, experience, and opinions. no filler.
        </motion.p>
      </div>

      <div>
        <p
          className="text-[10px] tracking-[0.25em] uppercase mb-3 text-center"
          style={{ color: "var(--ink-4)" }}
        >
          try one of these
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-[620px] mx-auto">
          {STARTER_SUGGESTIONS.map((s, i) => (
            <motion.button
              key={s}
              type="button"
              onClick={() => onPick(s)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.35 + i * 0.06 }}
              whileHover={{ y: -2 }}
              className="text-left text-[13.5px] px-4 py-3.5 cursor-pointer transition-colors hover:text-[var(--ink)]"
              style={{
                border: "1px solid var(--border-soft)",
                borderRadius: 10,
                color: "var(--ink-2)",
                background: "var(--bg-raised)",
              }}
            >
              {s}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tiny glyphs ───

function SparkMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1v3.5M7 9.5V13M1 7h3.5M9.5 7H13M2.5 2.5l2.3 2.3M9.2 9.2l2.3 2.3M11.5 2.5L9.2 4.8M4.8 9.2L2.5 11.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="7" cy="7" r="1.6" fill="currentColor" />
    </svg>
  );
}

function UserGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="4.5" r="2.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 12.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SendArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 14V2M8 2L3 7M8 2l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M1.5 6a4.5 4.5 0 018-2.8M10.5 6a4.5 4.5 0 01-8 2.8M9.5 1v3h-3M2.5 11V8h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BlinkingCaret() {
  return (
    <motion.span
      className="inline-block align-baseline ml-0.5"
      style={{
        width: 8,
        height: "1.1em",
        background: "var(--ink)",
        verticalAlign: "text-bottom",
      }}
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.9, repeat: Infinity }}
    />
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-2" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full inline-block"
          style={{ background: "var(--ink-3)" }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </span>
  );
}

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 h-1 rounded-full inline-block bg-current"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </span>
  );
}
