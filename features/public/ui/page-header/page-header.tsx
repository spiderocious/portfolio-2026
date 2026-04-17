"use client";

import { motion } from "motion/react";

interface PageHeaderProps {
  path: string;
  title: string;
  subtitle?: string;
  count?: number;
  countLabel?: string;
}

export function PageHeader({ path, title, subtitle, count, countLabel }: PageHeaderProps) {
  return (
    <header
      className="relative px-6 md:px-10 lg:px-12 pt-14 pb-12 border-b border-dashed overflow-hidden"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Decorative crosshatch in the background */}
      <span
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0, transparent 11px, currentColor 11px, currentColor 12px)",
          color: "var(--ink)",
        }}
        aria-hidden
      />
      <div className="relative">
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[13px] tracking-[0.25em] uppercase mb-5"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)", fontWeight: 600 }}
        >
          <span style={{ color: "#4ade80" }}>$</span> cat {path}
        </motion.p>

        <div className="flex items-end justify-between gap-6 flex-wrap">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-[clamp(3rem,7vw,5rem)] leading-[1.02] tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {title}
          </motion.h1>

          {typeof count === "number" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[14px] tabular-nums tracking-[0.15em] uppercase pb-2"
              style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontWeight: 600 }}
            >
              [{count.toString().padStart(2, "0")}{countLabel ? ` ${countLabel}` : ""}]
            </motion.span>
          )}
        </div>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-5 text-[16px] md:text-[17px] max-w-2xl leading-[1.7]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontWeight: 500 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </header>
  );
}
