"use client";

import { motion, type Variants } from "motion/react";

const NAV_LINKS = [
  { label: "projects", href: "/projects" },
  { label: "blogs", href: "/blog" },
  { label: "contact.ai", href: "#llm" },
];

const COMING_SOON = [
  { label: "experience" },
  { label: "experiments" },
  { label: "awards" },
  { label: "board" },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function HomePage() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* ── Top nav ─────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between px-6 pt-5 pb-0 md:px-10 lg:px-16"
      >
        <span
          className="text-xs tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
        >
          devferanmi.xyz
        </span>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs tracking-wide transition-colors duration-150 hover:opacity-100"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--ink-3)",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </motion.nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col justify-center px-6 pt-16 pb-12 md:px-10 lg:px-16 max-w-5xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-0"
        >
          {/* Status pill */}
          <motion.div variants={itemVariants} className="mb-7">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
              style={{
                fontFamily: "var(--font-mono)",
                background: "var(--tag-bg)",
                color: "var(--ink-3)",
                border: "1px solid var(--border-soft)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#4ade80" }}
              />
              open to work
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="text-[clamp(2.6rem,8vw,5.5rem)] leading-[1.05] tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink)",
            }}
          >
            Oluwaferanmi
            <br />
            <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
              Adeniji.
            </span>
          </motion.h1>

          {/* Role line */}
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base max-w-md mb-1"
            style={{ color: "var(--ink-3)", fontFamily: "var(--font-body)" }}
          >
            Software engineer based in{" "}
            <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>
              Lagos, Nigeria
            </span>
            . I build{" "}
            <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>
              fintech systems
            </span>
            ,{" "}
            <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>
              developer tools
            </span>
            , and{" "}
            <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>
              AI-powered products
            </span>
            .
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-sm max-w-sm mb-10"
            style={{ color: "var(--ink-4)", fontFamily: "var(--font-body)" }}
          >
            right now i'm focused on{" "}
            <span style={{ color: "var(--ink-3)" }}>web3</span> and{" "}
            <span style={{ color: "var(--ink-3)" }}>AI</span> development.
          </motion.p>

          {/* Tech tags */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-12">
            {["REACT", "CSS", "ARCH", "DS/LIBS"].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded text-[11px] tracking-wider"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "var(--tag-bg)",
                  color: "var(--ink-3)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="w-full h-px mb-10"
            style={{ background: "var(--border-soft)" }}
          />

          {/* Sections teaser */}
          <motion.p
            variants={itemVariants}
            className="text-[11px] tracking-[0.15em] uppercase mb-5"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
          >
            work
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-sm mb-10"
            style={{ color: "var(--ink-3)" }}
          >
            and i just love to play with{" "}
            <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>svg</span>{" "}
            and{" "}
            <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>motion</span>.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Coming soon sections ──────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="px-6 pb-16 md:px-10 lg:px-16"
      >
        <p
          className="text-[11px] tracking-[0.15em] uppercase mb-5"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
        >
          more soon
        </p>
        <div className="flex flex-wrap gap-3">
          {COMING_SOON.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.9 + i * 0.06 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border-soft)",
              }}
            >
              <span
                className="text-xs"
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
              >
                /{item.label}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--border)" }}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Footer line ──────────────────────────────────────────── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="px-6 pb-6 md:px-10 lg:px-16 flex items-center justify-between"
      >
        <span
          className="text-[11px] tracking-wide"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
        >
          v2 — building
        </span>
        <span
          className="text-[11px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
        >
          Lagos, NG · {new Date().getFullYear()}
        </span>
      </motion.footer>
    </main>
  );
}
