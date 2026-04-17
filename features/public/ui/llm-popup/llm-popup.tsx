"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLlmChat } from "./use-llm-chat";

const SUGGESTIONS = [
  "what's feranmi working on right now?",
  "tell me about his fintech work",
  "what's his tech stack?",
  "is he open to work?",
];

export function LlmPopup() {
  const [open, setOpen] = useState(false);
  const { messages, streaming, error, send } = useLlmChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 260);
  }, [open]);

  // Lock page scroll while open + close on escape
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Listen for global "open-llm" event so other UI (like the nav contact link) can open it
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-llm", handler);
    return () => window.removeEventListener("open-llm", handler);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || streaming) return;
    send(input);
    setInput("");
  }

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open chat"
        className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: "var(--ink)",
          color: "var(--bg)",
          border: "1px solid var(--border)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          fontFamily: "var(--font-mono)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
      >
        <ChatIcon />
      </motion.button>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-stretch justify-center"
            style={{
              background: "rgba(0, 0, 0, 0.72)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              fontFamily: "var(--font-mono)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
            role="dialog"
            aria-label="Chat with Feranmi.ai"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: 8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col w-full h-full md:h-[min(92vh,900px)] md:max-w-[1100px] md:my-[4vh] md:mx-6 overflow-hidden"
              style={{
                background: "var(--bg)",
                border: "1px dashed var(--border)",
                borderRadius: 2,
                boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
              }}
            >
              {/* Header */}
              <header
                className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-dashed shrink-0"
                style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#4ade80" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                  <span className="text-[14px]" style={{ color: "var(--ink)" }}>
                    feranmi.ai
                  </span>
                  <span
                    className="text-[10px] tracking-[0.22em] uppercase"
                    style={{ color: "var(--ink-4)" }}
                  >
                    ~beta · ask anything about my work
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex items-center gap-2 px-3 py-1.5 text-[11px] tracking-[0.15em] uppercase cursor-pointer transition-colors"
                  style={{
                    color: "var(--ink-2)",
                    border: "1px dashed var(--border)",
                    borderRadius: 2,
                  }}
                >
                  <span>esc</span>
                  <span>✕</span>
                </button>
              </header>

              {/* Body: thread + side column */}
              <div className="flex-1 min-h-0 flex">
                {/* Thread */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-5 md:px-10 py-8 md:py-12"
                >
                  <div className="mx-auto w-full max-w-[760px]">
                    {messages.length === 0 ? (
                      <EmptyState onPick={(q) => send(q)} />
                    ) : (
                      <ul className="flex flex-col gap-5">
                        {messages.map((m) => (
                          <li
                            key={m.id}
                            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                          >
                            <div
                              className="max-w-[88%] px-4 py-3 text-[14px] leading-[1.65] whitespace-pre-wrap break-words"
                              style={{
                                background: m.role === "user" ? "var(--ink)" : "var(--bg-raised)",
                                color: m.role === "user" ? "var(--bg)" : "var(--ink)",
                                border: m.role === "user" ? "none" : "1px dashed var(--border)",
                                borderRadius: 2,
                              }}
                            >
                              {m.content || (streaming ? <TypingDots /> : "…")}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <p
                  className="px-5 md:px-10 py-2 text-[12px] border-t border-dashed shrink-0"
                  style={{
                    color: "#f87171",
                    borderColor: "var(--border)",
                    background: "var(--bg-raised)",
                  }}
                >
                  {error}
                </p>
              )}

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-dashed shrink-0 px-5 md:px-10 py-4"
                style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
              >
                <div className="mx-auto w-full max-w-[760px] flex items-end gap-3">
                  <span
                    className="text-[14px] pb-2"
                    style={{ color: "#4ade80" }}
                    aria-hidden
                  >
                    $
                  </span>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="ask a question about feranmi's work…"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    className="flex-1 resize-none text-[14px] outline-none bg-transparent max-h-40 py-2"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--ink)",
                    }}
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || streaming}
                    whileTap={{ scale: 0.96 }}
                    className="shrink-0 px-4 py-2 text-[12px] tracking-wide disabled:opacity-40 cursor-pointer"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--bg)",
                      background: "var(--ink)",
                      border: "1px solid var(--ink)",
                      borderRadius: 2,
                    }}
                  >
                    {streaming ? "…" : "send →"}
                  </motion.button>
                </div>
                <p
                  className="mx-auto w-full max-w-[760px] text-[10px] tracking-[0.2em] uppercase mt-2"
                  style={{ color: "var(--ink-4)" }}
                >
                  press enter to send · shift+enter for newline · esc to close
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p
          className="text-[11px] tracking-[0.25em] uppercase"
          style={{ color: "var(--ink-4)" }}
        >
          <span style={{ color: "#4ade80" }}>$</span> ./chat.sh — feranmi.ai v1
        </p>
        <h2
          className="text-[clamp(1.75rem,3.6vw,2.5rem)] leading-[1.1] tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
        >
          ask me anything
          <br />
          <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
            about feranmi.
          </span>
        </h2>
        <p
          className="text-[14px] leading-[1.7] max-w-xl"
          style={{ color: "var(--ink-2)" }}
        >
          i&apos;m a small llm grounded in feranmi&apos;s actual work, experience, and opinions.
          ask about projects, fintech, his stack, what he&apos;s building, or anything in between.
        </p>
      </div>

      <div>
        <p
          className="text-[10px] tracking-[0.25em] uppercase mb-3"
          style={{ color: "var(--ink-4)" }}
        >
          try one of these
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SUGGESTIONS.map((s) => (
            <motion.button
              key={s}
              type="button"
              onClick={() => onPick(s)}
              whileHover={{ x: 3, borderColor: "var(--ink-3)" }}
              transition={{ duration: 0.15 }}
              className="text-left text-[13px] px-4 py-3 cursor-pointer"
              style={{
                border: "1px dashed var(--border)",
                borderRadius: 2,
                color: "var(--ink-2)",
                background: "var(--bg-raised)",
              }}
            >
              → {s}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 4a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2H7l-3.5 3V13H4a2 2 0 01-2-2V4z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ background: "var(--ink-3)" }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}
