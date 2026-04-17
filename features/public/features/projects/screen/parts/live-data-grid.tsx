"use client";

import { motion } from "motion/react";
import type { LiveDataItem } from "@/lib/services/types";

export function LiveDataGrid({ items }: { items: LiveDataItem[] }) {
  if (!items.length) return null;

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 gap-0 border border-dashed"
      style={{ borderColor: "var(--border)", borderRadius: 2, background: "var(--bg-raised)" }}
    >
      {items.map((item, i) => (
        <motion.div
          key={`${item.label}-${i}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.07 }}
          className="p-5 md:p-6"
          style={{
            borderRight: (i + 1) % 3 !== 0 ? "1px dashed var(--border-soft)" : undefined,
            borderBottom: "1px dashed var(--border-soft)",
          }}
        >
          <p
            className="text-[32px] md:text-[38px] leading-none tabular-nums mb-2"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--ink)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
            }}
          >
            {item.value}
          </p>
          <p
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
          >
            {item.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
