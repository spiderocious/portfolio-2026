"use client";

import { motion } from "motion/react";
import { SectionTitle } from "@/features/public/ui/section-title/section-title";
import { SectionLabel } from "@/features/public/ui/section-label/section-label";
import { CountUp } from "@/features/public/ui/count-up/count-up";
import { ScrollReveal } from "@/features/public/ui/scroll-reveal/scroll-reveal";

interface StatsSectionProps {
  stats: {
    total_visits: number;
    total_blog_reads: number;
    total_project_interactions: number;
  };
}

export function StatsSection({ stats }: StatsSectionProps) {
  const tiles = [
    {
      key: "visits",
      label: "total visits",
      value: stats.total_visits,
      hint: "site traffic · all time",
      icon: EyeIcon,
    },
    {
      key: "reads",
      label: "blog reads",
      value: stats.total_blog_reads,
      hint: "posts opened · all time",
      icon: BookIcon,
    },
    {
      key: "interactions",
      label: "project interactions",
      value: stats.total_project_interactions,
      hint: "views + link clicks",
      icon: PointerIcon,
    },
  ];

  return (
    <section className="px-6 md:px-10 lg:px-12 pb-16">
      <SectionTitle label="/stats" />

      <div className="pt-4 mb-8">
        <SectionLabel>by the numbers</SectionLabel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tiles.map(({ key, ...tile }, i) => (
          <ScrollReveal key={key} delay={i * 0.08}>
            <StatTile {...tile} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

interface StatTileProps {
  label: string;
  value: number;
  hint: string;
  icon: React.ComponentType;
}

function StatTile({ label, value, hint, icon: Icon }: StatTileProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative p-6 md:p-7 overflow-hidden"
      style={{
        border: "1px dashed var(--border)",
        borderRadius: 2,
        background: "var(--bg-raised)",
      }}
    >
      {/* Subtle corner accents */}
      <span
        className="absolute top-2 right-2 opacity-30"
        style={{ color: "var(--ink-3)" }}
      >
        <Icon />
      </span>

      <p
        className="text-[10px] tracking-[0.25em] uppercase mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
      >
        {label}
      </p>

      <div
        className="text-[44px] md:text-[52px] leading-none tabular-nums mb-3"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--ink)",
          fontWeight: 500,
          letterSpacing: "-0.02em",
        }}
      >
        <CountUp value={value} />
      </div>

      <p
        className="text-[12px]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}
      >
        {hint}
      </p>
    </motion.div>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 3h5a1 1 0 011 1v9a1 1 0 00-1-1H2V3zM14 3H9a1 1 0 00-1 1v9a1 1 0 011-1h5V3z" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function PointerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 3l4 10 2-4 4-2L3 3z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}
