"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const TOOLTIP_SEEN_KEY = "feranmi_llm_tooltip_seen";

/**
 * Floating chat trigger — bigger, bouncing, with pulsing ring and a pointing
 * tooltip that fades away after first interaction.
 */
export function LlmTrigger({
  hidden,
  onOpen,
}: {
  hidden: boolean;
  onOpen: () => void;
}) {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Show the tooltip after a short delay on first visit
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(TOOLTIP_SEEN_KEY) === "1";
    if (seen) return;

    const show = setTimeout(() => setTooltipVisible(true), 1800);
    const hide = setTimeout(() => {
      setTooltipVisible(false);
      sessionStorage.setItem(TOOLTIP_SEEN_KEY, "1");
    }, 11000);

    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  function handleOpen() {
    setTooltipVisible(false);
    try {
      sessionStorage.setItem(TOOLTIP_SEEN_KEY, "1");
    } catch {}
    onOpen();
  }

  if (hidden) return null;

  return (
    <div className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-[55] flex flex-col items-end gap-3 pointer-events-none">
      {/* Pointing tooltip */}
      <AnimatePresence>
        {tooltipVisible && (
          <motion.button
            type="button"
            key="tooltip"
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleOpen}
            className="relative pointer-events-auto cursor-pointer select-none"
            style={{ transformOrigin: "bottom right" }}
          >
            <motion.div
              className="relative px-3.5 py-2 text-[12px] tracking-[0.05em] shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              style={{
                fontFamily: "var(--font-mono)",
                background: "var(--ink)",
                color: "var(--bg)",
                borderRadius: 10,
                whiteSpace: "nowrap",
              }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="flex items-center gap-2">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#4ade80" }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                ask me anything
              </span>
              {/* downward-pointing tail */}
              <span
                className="absolute right-6 -bottom-[5px] w-2.5 h-2.5 rotate-45"
                style={{ background: "var(--ink)" }}
                aria-hidden
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* The button with pulsing rings */}
      <div className="relative pointer-events-auto">
        {/* Outer pulsing ring */}
        <motion.span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: "#4ade80" }}
          animate={{ scale: [1, 1.6], opacity: [0.45, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          aria-hidden
        />
        {/* Inner pulsing ring (offset for layered effect) */}
        <motion.span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: "#4ade80" }}
          animate={{ scale: [1, 1.35], opacity: [0.35, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
          aria-hidden
        />

        {/* Bouncing button */}
        <motion.button
          type="button"
          onClick={handleOpen}
          aria-label="Open chat with Feranmi.ai"
          className="relative w-16 h-16 md:w-[68px] md:h-[68px] rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: "var(--ink)",
            color: "var(--bg)",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.45), 0 0 0 3px rgba(74,222,128,0.5)",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -6, 0, -3, 0],
          }}
          transition={{
            opacity: { duration: 0.35, delay: 0.5 },
            scale: { duration: 0.35, delay: 0.5 },
            y: {
              duration: 2.4,
              repeat: Infinity,
              repeatDelay: 1.4,
              ease: [0.22, 1, 0.36, 1],
              delay: 1.5,
            },
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <SparkGlyph />

          {/* Green online dot */}
          <span
            className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full"
            style={{ background: "#4ade80", border: "2px solid var(--ink)" }}
            aria-hidden
          >
            <motion.span
              className="block w-full h-full rounded-full"
              style={{ background: "#4ade80" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </span>
        </motion.button>
      </div>
    </div>
  );
}

function SparkGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2v5M12 17v5M2 12h5M17 12h5M4.5 4.5l3.5 3.5M16 16l3.5 3.5M19.5 4.5L16 8M8 16l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" />
    </svg>
  );
}
