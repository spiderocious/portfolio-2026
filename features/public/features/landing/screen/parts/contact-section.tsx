"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SectionTitle } from "@/features/public/ui/section-title/section-title";
import { ScrollReveal } from "@/features/public/ui/scroll-reveal/scroll-reveal";

interface ContactLink {
  label: string;
  handle: string;
  href: string;
  external: boolean;
  icon: React.ComponentType;
}

const LINKS: ContactLink[] = [
  {
    label: "linkedin",
    handle: "in/oluwaferanmi-adeniji",
    href: "https://www.inkedin.com/in/oluwaferanmi-adeniji-aba341179/",
    external: true,
    icon: LinkedInIcon,
  },
  {
    label: "github",
    handle: "@spiderocious",
    href: "https://github.com/spiderocious",
    external: true,
    icon: GitHubIcon,
  },
  {
    label: "blog",
    handle: "devferanmi.hashnode.dev",
    href: "/blog",
    external: false,
    icon: QuillIcon,
  },
  {
    label: "email",
    handle: "devferanmi@gmail.com",
    href: "mailto:devferanmi@gmail.com",
    external: true,
    icon: MailIcon,
  },
];

export function ContactSection() {
  return (
    <section className="px-6 md:px-10 lg:px-12 pb-16">
      <SectionTitle label="/contact" />

      <ScrollReveal>
        <div
          className="relative p-6 md:p-10 overflow-hidden"
          style={{
            border: "1px dashed var(--border)",
            borderRadius: 2,
            background: "var(--bg-raised)",
          }}
        >
          {/* Prompt header */}
          <div
            className="flex items-center gap-2 mb-6 text-[14px]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontWeight: 600 }}
          >
            <span style={{ color: "#4ade80" }}>$</span>
            <span>./reach-me.sh</span>
            <motion.span
              className="inline-block w-[7px] h-[14px]"
              style={{ background: "#4ade80" }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>

          <h2
            className="text-[clamp(2rem,4vw,2.75rem)] mb-3 leading-[1.1]"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            let&apos;s build something.
          </h2>
          <p
            className="text-[16px] md:text-[17px] mb-10 max-w-xl leading-[1.7]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontWeight: 500 }}
          >
            open for interesting roles, collaborations, or just a chat about what you&apos;re working on.
            fastest replies on email or linkedin.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LINKS.map((link, i) => (
              <ContactRow key={link.label} link={link} index={i} />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function ContactRow({ link, index }: { link: ContactLink; index: number }) {
  const { icon: Icon, label, handle, href, external } = link;
  const commonProps = {
    whileHover: { x: 4 },
    transition: { duration: 0.2 },
    className:
      "group flex items-center justify-between gap-4 p-4 transition-colors",
    style: {
      border: "1px dashed var(--border)",
      borderRadius: 2,
      background: "var(--bg)",
    } as React.CSSProperties,
  };

  const content = (
    <>
      <div className="flex items-center gap-4 min-w-0">
        <span
          className="w-9 h-9 flex items-center justify-center shrink-0"
          style={{
            border: "1px dashed var(--border)",
            borderRadius: 2,
            color: "var(--ink-2)",
          }}
        >
          <Icon />
        </span>
        <div className="min-w-0">
          <p
            className="text-[11px] tracking-[0.25em] uppercase mb-1"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)", fontWeight: 600 }}
          >
            {label}
          </p>
          <p
            className="text-[15px] md:text-[16px] truncate"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", fontWeight: 500 }}
          >
            {handle}
          </p>
        </div>
      </div>
      <motion.span
        className="text-[16px] shrink-0 opacity-50 group-hover:opacity-100"
        style={{ color: "var(--ink-2)" }}
        initial={false}
      >
        {external ? "↗" : "→"}
      </motion.span>
    </>
  );

  return external ? (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      custom={index}
      {...commonProps}
    >
      {content}
    </motion.a>
  ) : (
    <motion.div custom={index} {...commonProps}>
      <Link href={href} className="flex items-center justify-between gap-4 w-full min-w-0">
        {content}
      </Link>
    </motion.div>
  );
}

// ─── Icons ─────────────────────────────────────────

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="12" height="12" stroke="currentColor" strokeWidth="1" />
      <path d="M4 5v5M4 3.5v0.01M6.5 10V6M6.5 7.5c0-1 1-1.5 2-1.5s2 0.5 2 1.5V10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1a6 6 0 00-1.9 11.7c0.3 0.05 0.4-0.1 0.4-0.3v-1.1c-1.6 0.3-2-0.7-2-0.7-0.3-0.7-0.7-0.9-0.7-0.9-0.5-0.4 0-0.4 0-0.4 0.6 0 0.9 0.6 0.9 0.6 0.5 0.9 1.3 0.6 1.7 0.5 0-0.4 0.2-0.6 0.4-0.8-1.3-0.1-2.6-0.6-2.6-2.9 0-0.6 0.2-1.1 0.6-1.5-0.1-0.2-0.3-0.8 0-1.6 0 0 0.5-0.1 1.6 0.6 0.5-0.1 1-0.2 1.5-0.2s1 0.1 1.5 0.2c1.1-0.7 1.6-0.6 1.6-0.6 0.3 0.8 0.1 1.4 0 1.6 0.4 0.4 0.6 0.9 0.6 1.5 0 2.2-1.4 2.7-2.6 2.9 0.2 0.2 0.4 0.5 0.4 1v1.5c0 0.2 0.1 0.3 0.4 0.3A6 6 0 007 1z" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

function QuillIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 12L10 4M8 2h4v4M2 12l1.5-0.5L10.5 4.5 9.5 3.5 2.5 10.5 2 12z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="3" width="12" height="8" stroke="currentColor" strokeWidth="1" />
      <path d="M1 3l6 5 6-5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
