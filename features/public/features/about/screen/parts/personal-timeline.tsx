"use client";

import { motion } from "motion/react";
import { TIMELINE } from "../../data/about-data";

export function PersonalTimeline() {
  return (
    <div className="relative pl-7">
      <span
        className="absolute left-[11px] top-2 bottom-2 w-px"
        style={{ background: "var(--border)" }}
        aria-hidden
      />
      <div className="flex flex-col gap-5">
        {TIMELINE.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="relative"
          >
            <span
              className="absolute -left-7 top-1.5 w-[14px] h-[14px] rounded-full block"
              style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
              }}
              aria-hidden
            />
            <p
              className="text-[10px] tracking-[0.25em] uppercase mb-1"
              style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
            >
              {item.year}
            </p>
            <p
              className="text-[15px] mb-1"
              style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", fontWeight: 600 }}
            >
              {item.label}
            </p>
            <p
              className="text-[13px] leading-[1.6]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}
            >
              {item.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
