"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { Experience } from "@/lib/services/types";
import { MarkdownRenderer } from "@/features/public/ui/markdown-renderer/markdown-renderer";
import { TagBadge } from "@/features/public/ui/tag-badge/tag-badge";

interface Props {
  experience: Experience[];
}

export function ExperienceTimeline({ experience }: Props) {
  const [openId, setOpenId] = useState<string | null>(experience[0]?.id ?? null);

  return (
    <div className="relative pl-6 md:pl-8">
      {/* Vertical spine */}
      <span
        className="absolute left-[7px] md:left-[11px] top-2 bottom-2 w-px"
        style={{ background: "var(--border)" }}
        aria-hidden
      />

      <div className="flex flex-col gap-5">
        {experience.map((exp, i) => (
          <ExperienceRow
            key={exp.id}
            exp={exp}
            index={i}
            open={openId === exp.id}
            onToggle={() => setOpenId(openId === exp.id ? null : exp.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ExperienceRow({
  exp,
  index,
  open,
  onToggle,
}: {
  exp: Experience;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const isCurrent = !exp.end_date;
  const dates = formatRange(exp.start_date, exp.end_date);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Timeline dot */}
      <span
        className="absolute -left-6 md:-left-8 top-7 z-10"
        aria-hidden
      >
        <span
          className="relative w-[14px] h-[14px] rounded-full block"
          style={{
            background: isCurrent ? "#4ade80" : "var(--bg-raised)",
            border: `1px solid ${isCurrent ? "#4ade80" : "var(--border)"}`,
          }}
        >
          {isCurrent && (
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: "#4ade80", opacity: 0.3 }}
              animate={{ scale: [1, 2], opacity: [0.4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </span>
      </span>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left"
        style={{
          border: "1px dashed var(--border)",
          borderRadius: 2,
          background: "var(--bg-raised)",
        }}
      >
        <div className="p-5 md:p-7">
          <header className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 min-w-0">
              {exp.logo_url ? (
                <div
                  className="relative w-10 h-10 shrink-0 overflow-hidden"
                  style={{ border: "1px dashed var(--border)", borderRadius: 2 }}
                >
                  <Image src={exp.logo_url} alt={exp.company} fill sizes="40px" className="object-cover" />
                </div>
              ) : (
                <div
                  className="w-10 h-10 shrink-0 flex items-center justify-center"
                  style={{
                    border: "1px dashed var(--border)",
                    borderRadius: 2,
                    fontFamily: "var(--font-mono)",
                    color: "var(--ink-3)",
                    fontSize: 14,
                  }}
                >
                  {exp.company.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <h3
                  className="text-[17px] md:text-[18px] mb-0.5"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", fontWeight: 600 }}
                >
                  {exp.role}
                </h3>
                <p
                  className="text-[13px]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}
                >
                  {exp.company_url ? (
                    <a
                      href={exp.company_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {exp.company}
                    </a>
                  ) : (
                    exp.company
                  )}
                  {exp.location && <span style={{ color: "var(--ink-4)" }}> · {exp.location}</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className="text-[11px] tabular-nums tracking-wide"
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
              >
                {dates}
              </span>
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="text-[14px]"
                style={{ color: "var(--ink-3)" }}
              >
                ⌄
              </motion.span>
            </div>
          </header>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div
                className="px-5 md:px-7 pb-6 pt-2 border-t border-dashed flex flex-col gap-6"
                style={{ borderColor: "var(--border-soft)" }}
              >
                {exp.description && (
                  <div>
                    <SectionMini>overview</SectionMini>
                    <MarkdownRenderer content={exp.description} />
                  </div>
                )}
                {exp.achievements && (
                  <div>
                    <SectionMini>achievements</SectionMini>
                    <MarkdownRenderer content={exp.achievements} />
                  </div>
                )}
                {extractStack(exp.description).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {extractStack(exp.description).map((tag) => (
                      <TagBadge key={tag} size="sm">
                        {tag}
                      </TagBadge>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.article>
  );
}

function SectionMini({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] tracking-[0.25em] uppercase mb-3"
      style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
    >
      {children}
    </p>
  );
}

function formatRange(start: string, end: string | null): string {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return `${fmt(start)} — ${end ? fmt(end) : "present"}`;
}

function extractStack(desc: string): string[] {
  const m = desc.match(/(?:stack|tech|tools?)\s*[:\-]\s*(.+)/i);
  if (!m) return [];
  return m[1]
    .split(/[,|/•]/)
    .map((s) => s.trim())
    .filter((s) => s && s.length < 40)
    .slice(0, 10);
}
