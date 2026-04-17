"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Experiment } from "@/lib/services/types";
import { TagBadge } from "@/features/public/ui/tag-badge/tag-badge";

const STATUS_COLORS: Record<Experiment["status"], string> = {
  live: "#4ade80",
  wip: "#f59e0b",
  idea: "#c084fc",
  archived: "var(--ink-4)",
};

export function ExperimentCard({ experiment, index }: { experiment: Experiment; index: number }) {
  const color = STATUS_COLORS[experiment.status];
  const firstLine = experiment.description
    ?.split("\n")
    .find((l) => l.trim())
    ?.replace(/^#+\s*/, "")
    ?.slice(0, 160);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.05 }}
      whileHover={{ y: -3 }}
      className="relative h-full"
    >
      <Link
        href={`/experiments/${experiment.slug}`}
        className="flex flex-col h-full p-5 md:p-6 gap-4"
        style={{
          border: "1px dashed var(--border)",
          borderRadius: 2,
          background: "var(--bg-raised)",
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.25em] uppercase"
            style={{ fontFamily: "var(--font-mono)", color }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            {experiment.status}
          </span>
          {experiment.featured && (
            <span
              className="text-[9px] tracking-[0.25em] uppercase"
              style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
            >
              featured
            </span>
          )}
        </div>

        <h3
          className="text-[17px] leading-[1.3]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", fontWeight: 600 }}
        >
          {experiment.title}
        </h3>

        {firstLine && (
          <p
            className="text-[13px] leading-[1.6] flex-1"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}
          >
            {firstLine}
          </p>
        )}

        {experiment.stack.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {experiment.stack.slice(0, 4).map((tag) => (
              <TagBadge key={tag} size="sm">
                {tag}
              </TagBadge>
            ))}
          </div>
        )}
      </Link>
    </motion.article>
  );
}
