"use client";

import { motion, type Variants } from "motion/react";
import { IsoGraphic } from "./iso-graphic";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const BADGES = [
  { label: "LAGOS", icon: PinIcon },
  { label: "CS", icon: HouseIcon },
  { label: "ARCH", icon: ServerIcon },
  { label: "FINTECH", icon: ChipIcon },
];

export function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 lg:gap-12 px-6 md:px-10 lg:px-12 pt-16 pb-20 lg:pt-20 lg:pb-28">
      {/* Left — text */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col">
        {/* Name row */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-10">
          <h1
            className="text-[clamp(1.8rem,4vw,2.25rem)] font-medium tracking-tight"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
          >
            oluwaferanmi adeniji
          </h1>
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] tracking-[0.18em] uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--ink-2)",
              border: "1px solid var(--border)",
              background: "var(--bg-raised)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ade80" }} />
            open to work
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-[15px] md:text-[16px] leading-[1.75] max-w-[560px] mb-10"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}
        >
          <Bold>software engineer</Bold> based in <Bold>lagos, nigeria</Bold>, shipping
          <Bold> fintech systems</Bold>, <Bold>developer tools</Bold> and all the{" "}
          <Bold>creative stuff</Bold> on earth. right now focused on <Bold>web3</Bold> and{" "}
          <Bold>ai</Bold> development.
        </motion.p>

        {/* Badges row */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-5 mb-10">
          {BADGES.map(({ label, icon: Icon }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 text-[12px] tracking-[0.15em]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}
            >
              <Icon />
              {label}
            </span>
          ))}
        </motion.div>

        {/* Play note */}
        <motion.p
          variants={itemVariants}
          className="text-[14px] flex items-center gap-2 flex-wrap"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}
        >
          and yeah i love to play with <Bold>svg</Bold>
          <SvgGlyph />
          <span>and</span>
          <Bold>motion</Bold>
          <MotionGlyph />
        </motion.p>
      </motion.div>

      {/* Right — iso graphic */}
      <div className="relative min-h-[260px] lg:min-h-[360px]">
        <IsoGraphic />
      </div>
    </section>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: "var(--ink)", fontWeight: 700 }}>{children}</span>
  );
}

/* ─── Tiny glyphs to match the screenshot ──────────────────────── */

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="6" r="2.2" stroke="currentColor" strokeWidth="1" />
      <path d="M7 1.5c2.2 0 4 1.8 4 4 0 3-4 7-4 7s-4-4-4-7c0-2.2 1.8-4 4-4z" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 6.5L7 2.5l5 4V12H2V6.5z" stroke="currentColor" strokeWidth="1" />
      <path d="M5.5 12V8.5h3V12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="3" width="10" height="3" stroke="currentColor" strokeWidth="1" />
      <rect x="2" y="8" width="10" height="3" stroke="currentColor" strokeWidth="1" />
      <circle cx="4" cy="4.5" r="0.5" fill="currentColor" />
      <circle cx="4" cy="9.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function ChipIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="3.5" y="3.5" width="7" height="7" stroke="currentColor" strokeWidth="1" />
      <path d="M5.5 5.5h3v3h-3z" stroke="currentColor" strokeWidth="1" />
      <path d="M5 2v1.5M7 2v1.5M9 2v1.5M5 10.5V12M7 10.5V12M9 10.5V12M2 5h1.5M2 7h1.5M2 9h1.5M10.5 5H12M10.5 7H12M10.5 9H12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function SvgGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: "var(--ink-2)" }}>
      <path d="M2 2l9 4.5L7 7.5l-1 3.5-4-9z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

function MotionGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: "var(--ink-2)" }}>
      <path d="M2 11L11 2M9 2h2v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M3.5 6.5l1 1M5 4l1 1M7 2.5l1 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
