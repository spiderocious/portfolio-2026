"use client";

import { motion, type Variants } from "motion/react";
import { IsoGraphic } from "./iso-graphic";
import Image from "next/image";

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
  { label: "Coding", icon: HouseIcon },
];

export function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 lg:gap-12 px-6 md:px-10 lg:px-12 pb-20 lg:pb-28 pt-6">
      {/* Left — text */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2"
      >
        {/* Name row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center gap-x-5 gap-y-3 "
        >
          <Image
            src="/feranmi.png"
            alt="Oluwaferanmi Adeniji"
            className="rounded-xl"
            height={96}
            width={96}
            unoptimized
            priority
          />
          <h1
            className="text-[clamp(2.25rem,5vw,3rem)] font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
          >
            oluwaferanmi adeniji
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-[17px] md:text-[18px] leading-[1.8] max-w-155 mb-5"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--ink-2)",
            fontWeight: 500,
          }}
        >
          I&apos;m a <Bold>Senior Frontend Engineer</Bold> with{" "}
          <Bold>7+ years</Bold> crafting digital experiences across payments,
          fintech, ecommerce, software as a service, delivery, humanities,
          health and developer tools. I care deeply about performance, clean
          architecture, and building products that genuinely help people.
          Currently at{" "}
          <a
            href="https://moniepoint.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Bold>Moniepoint</Bold>
          </a>
          , where I contribute to frontend systems serving 10M+ users and
          processing $1B+ annually. I also maintain open-source libraries like{" "}
          <Bold>Connectic</Bold> and <Bold>Monie Utils</Bold> because building
          useful things is what gets me out of bed.
        </motion.p>

        {/* Play note */}
        <motion.p
          variants={itemVariants}
          className="text-[15px] md:text-[16px] leading-[1.75] flex items-center gap-2 flex-wrap max-w-155"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--ink-2)",
            fontWeight: 500,
          }}
        >
          I love to drive things forward — whether it&apos;s a new feature, a
          tricky bug, or just the project roadmap. I get a kick out of taking
          something from zero to one, and I&apos;m always down to roll up my
          sleeves and get into the code to make it happen.
        </motion.p>

        {/* Badges row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center gap-5 mb-10"
        >
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
      <path
        d="M7 1.5c2.2 0 4 1.8 4 4 0 3-4 7-4 7s-4-4-4-7c0-2.2 1.8-4 4-4z"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 6.5L7 2.5l5 4V12H2V6.5z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M5.5 12V8.5h3V12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect
        x="2"
        y="3"
        width="10"
        height="3"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x="2"
        y="8"
        width="10"
        height="3"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="4" cy="4.5" r="0.5" fill="currentColor" />
      <circle cx="4" cy="9.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function ChipIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect
        x="3.5"
        y="3.5"
        width="7"
        height="7"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M5.5 5.5h3v3h-3z" stroke="currentColor" strokeWidth="1" />
      <path
        d="M5 2v1.5M7 2v1.5M9 2v1.5M5 10.5V12M7 10.5V12M9 10.5V12M2 5h1.5M2 7h1.5M2 9h1.5M10.5 5H12M10.5 7H12M10.5 9H12"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function SvgGlyph() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      style={{ color: "var(--ink-2)" }}
    >
      <path
        d="M2 2l9 4.5L7 7.5l-1 3.5-4-9z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MotionGlyph() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      style={{ color: "var(--ink-2)" }}
    >
      <path
        d="M2 11L11 2M9 2h2v2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M3.5 6.5l1 1M5 4l1 1M7 2.5l1 1"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
