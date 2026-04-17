"use client";

import { motion } from "motion/react";
import type { Experience } from "@/lib/services/types";
import { SectionTitle } from "@/features/public/ui/section-title/section-title";
import { SectionLabel } from "@/features/public/ui/section-label/section-label";
import { TagBadge } from "@/features/public/ui/tag-badge/tag-badge";
import { ScrollReveal } from "@/features/public/ui/scroll-reveal/scroll-reveal";

interface ExperienceSectionProps {
  experience: Experience[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (experience.length === 0) return null;

  return (
    <section className="px-6 md:px-10 lg:px-12 pb-16">
      <SectionTitle label="/experience" href="/experience" />

      <div className="pt-4">
        <SectionLabel align="right">work history</SectionLabel>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        {experience.map((exp, i) => (
          <ScrollReveal key={exp.id} delay={i * 0.06}>
            <ExperienceItem exp={exp} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function ExperienceItem({ exp }: { exp: Experience }) {
  const bullets = parseAchievements(exp.achievements);
  const dates = formatDateRange(exp.start_date, exp.end_date);
  const isCurrent = !exp.end_date;
  const stack = extractStack(exp.description);

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative p-6 md:p-8"
      style={{
        border: "1px dashed var(--border)",
        borderRadius: 2,
        background: "var(--bg-raised)",
      }}
    >
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3
            className="text-[20px] md:text-[22px] mb-1"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", fontWeight: 600 }}
          >
            {exp.company}
          </h3>
          <p
            className="text-[15px] md:text-[16px]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontWeight: 500 }}
          >
            {exp.role}
            {exp.location && <span> ~ {exp.location}</span>}
          </p>
        </div>
        {isCurrent && (
          <span
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase px-2.5 py-1"
            style={{
              fontFamily: "var(--font-mono)",
              color: "#4ade80",
              fontWeight: 600,
              border: "1px solid rgba(74,222,128,0.4)",
              borderRadius: 2,
            }}
          >
            <Pulse /> current
          </span>
        )}
      </header>

      <p
        className="text-[13px] mb-5"
        style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)", fontWeight: 500 }}
      >
        {dates}
      </p>

      {/* Bullets */}
      {bullets.length > 0 && (
        <ul className="space-y-2.5 mb-5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <TriangleBullet />
              <span
                className="text-[15px] md:text-[16px] leading-[1.65]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontWeight: 500 }}
              >
                {b}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Stack tags */}
      {stack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {stack.map((tag) => (
            <TagBadge key={tag}>{tag}</TagBadge>
          ))}
        </div>
      )}
    </motion.article>
  );
}

function TriangleBullet() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      className="mt-1.5 shrink-0"
      style={{ color: "var(--ink-4)" }}
    >
      <path
        d="M3 2l6 4-6 4V2z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.25"
      />
    </svg>
  );
}

function Pulse() {
  return (
    <motion.span
      className="w-1.5 h-1.5 rounded-full"
      style={{ background: "#4ade80" }}
      animate={{ opacity: [1, 0.35, 1], scale: [1, 1.2, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── Helpers ──────────────────────────────────────────────────────

function parseAchievements(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((l) => l.replace(/^[\s*\-•]+/, "").trim())
    .filter(Boolean)
    .slice(0, 4);
}

function extractStack(desc: string): string[] {
  // Look for a "Stack:" line or fall back to empty — stack tends to live in description for experience
  const match = desc.match(/(?:stack|tech|tools?)\s*[:\-]\s*(.+)/i);
  if (!match) return [];
  return match[1]
    .split(/[,|/•]/)
    .map((s) => s.trim())
    .filter((s) => s && s.length < 40)
    .slice(0, 8);
}

function formatDateRange(start: string, end: string | null): string {
  const fmt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };
  return `${fmt(start)} — ${end ? fmt(end) : "present"}`;
}
