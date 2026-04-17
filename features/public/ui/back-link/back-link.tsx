"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function BackLink({ href, label = "back" }: { href: string; label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={href}
        className="group inline-flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase"
        style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}
      >
        <motion.span
          className="inline-block"
          whileHover={{ x: -3 }}
          transition={{ duration: 0.2 }}
        >
          ←
        </motion.span>
        <span className="group-hover:text-[var(--ink)] transition-colors">{label}</span>
      </Link>
    </motion.div>
  );
}
