"use client";

import Link from "next/link";
import { motion } from "motion/react";

const FOOTER_LINKS = [
  { label: "home", href: "/" },
  { label: "projects", href: "/projects" },
  { label: "experience", href: "/experience" },
  { label: "blog", href: "/blog" },
  //{ label: "experiments", href: "/experiments" },
  // { label: "awards", href: "/awards" },
  { label: "board", href: "/board" },
  { label: "about", href: "/about" },
];

const SOCIAL = [
  { label: "github", href: "https://github.com/spiderocious" },
  { label: "linkedin", href: "https://www.inkedin.com/in/oluwaferanmi-adeniji-aba341179/" },
  { label: "email", href: "mailto:devferanmi@gmail.com" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="px-6 md:px-10 lg:px-12 pt-10 pb-6"
      style={{
        borderTop: "1px dashed var(--border)",
        fontFamily: "var(--font-mono)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-10 md:gap-14 mb-10">
        {/* Identity */}
        <div>
          <p
            className="text-[11px] tracking-[0.25em] uppercase mb-3"
            style={{ color: "var(--ink-3)", fontWeight: 600 }}
          >
            <span style={{ color: "#4ade80" }}>$</span> whoami
          </p>
          <p
            className="text-[20px] md:text-[22px] mb-2.5"
            style={{ color: "var(--ink)", fontWeight: 600 }}
          >
            oluwaferanmi adeniji
          </p>
          <p
            className="text-[14px] leading-[1.7] max-w-sm"
            style={{ color: "var(--ink-2)", fontWeight: 500 }}
          >
            software engineer in lagos. shipping fintech systems, dev tools, and ai-powered products.
          </p>
        </div>

        {/* Nav */}
        <div>
          <p
            className="text-[11px] tracking-[0.25em] uppercase mb-3"
            style={{ color: "var(--ink-3)", fontWeight: 600 }}
          >
            ./pages
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[14px]" style={{ fontWeight: 500 }}>
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-[var(--ink)]"
                  style={{ color: "var(--ink-2)" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <p
            className="text-[11px] tracking-[0.25em] uppercase mb-3"
            style={{ color: "var(--ink-3)", fontWeight: 600 }}
          >
            ./elsewhere
          </p>
          <ul className="flex flex-col gap-2 text-[14px]" style={{ fontWeight: 500 }}>
            {SOCIAL.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 transition-colors hover:text-[var(--ink)]"
                  style={{ color: "var(--ink-2)" }}
                >
                  {s.label}
                  <span style={{ color: "var(--ink-4)" }}>↗</span>
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-llm"))}
                className="inline-flex items-center gap-2 transition-colors hover:text-[var(--ink)] cursor-pointer"
                style={{ color: "var(--ink-2)", fontFamily: "var(--font-mono)", fontWeight: 500 }}
              >
                ask feranmi.ai
                <span style={{ color: "#4ade80" }}>◉</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] pt-5"
        style={{ borderTop: "1px dashed var(--border-soft)", fontWeight: 500 }}
      >
        <div className="flex items-center gap-2" style={{ color: "var(--ink-3)" }}>
          <span style={{ color: "#4ade80" }}>$</span>
          <span>v2.0.0</span>
          <span style={{ color: "var(--border)" }}>·</span>
          <motion.span
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            built in Ogbomoso
          </motion.span>
        </div>

        <div className="flex items-center gap-4" style={{ color: "var(--ink-4)" }}>
          <span>© {year} oluwaferanmi adeniji</span>
          <span style={{ color: "var(--border)" }}>·</span>
          <span>all signal, no noise</span>
        </div>
      </div>
    </footer>
  );
}
