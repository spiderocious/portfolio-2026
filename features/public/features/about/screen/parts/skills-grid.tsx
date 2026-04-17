"use client";

import { motion } from "motion/react";
import { SKILL_GROUPS } from "../../data/about-data";

export function SkillsGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-14">
      {SKILL_GROUPS.map((group, i) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <SkillPanel title={group.title} tags={group.tags} />
        </motion.div>
      ))}
    </div>
  );
}

function SkillPanel({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div className="relative pl-6 md:pl-8">
      {/* Plaque header */}
      <div
        className="relative inline-flex items-center gap-2.5 px-3.5 py-2 mb-3 -ml-1"
        style={{
          border: "1px dashed var(--border)",
          borderRadius: 2,
          background: "var(--bg-raised)",
        }}
      >
        <IsoCube />
        <span
          className="text-[15px] md:text-[16px] tracking-wide"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--ink)",
            fontWeight: 600,
          }}
        >
          {title}
        </span>
      </div>

      {/* Vertical spine connecting the plaque to each tile row */}
      <span
        className="absolute left-0 top-11.5 bottom-2 border-l border-dashed"
        style={{ borderColor: "var(--border)" }}
        aria-hidden
      />

      {/* Tiles with dashed ticks connecting to the spine */}
      <div className="flex flex-wrap items-center gap-x-0 gap-y-2 pt-1">
        {tags.map((tag, idx) => (
          <TileWithTick key={tag} label={tag} index={idx} />
        ))}
      </div>
    </div>
  );
}

function TileWithTick({ label, index }: { label: string; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -4 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: 0.1 + Math.min(index, 10) * 0.03 }}
      className="inline-flex items-center"
    >
      <span
        className="inline-block border-t border-dashed"
        style={{ borderColor: "var(--border)", width: 16, height: 1 }}
        aria-hidden
      />
      <motion.span
        whileHover={{ y: -1 }}
        transition={{ duration: 0.15 }}
        className="inline-block px-3 py-1.5 text-[14px] md:text-[15px] tracking-wide mr-2 cursor-default"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--ink)",
          fontWeight: 500,
          border: "1px dashed var(--border)",
          borderRadius: 2,
          background: "var(--bg-raised)",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.12) 100%)",
        }}
      >
        {label}
      </motion.span>
    </motion.span>
  );
}

function IsoCube() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ color: "var(--ink-2)" }}
    >
      <path d="M8 1.5L14 4.5L8 7.5L2 4.5L8 1.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M2 4.5V11L8 14V7.5L2 4.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M14 4.5V11L8 14V7.5L14 4.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}
