"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { TagBadge } from "@/features/public/ui/tag-badge/tag-badge";

export interface ProjectCardData {
  slug: string;
  title: string;
  subtitle?: string | null;
  excerpt: string;
  stack: string[];
  links?: {
    deployed?: string | null;
    github?: string | null;
  };
  featured?: boolean;
}

interface ProjectCardProps {
  project: ProjectCardData;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const { featured } = project;
  const accent = "rgba(74, 222, 128, 0.5)";
  const borderColor = featured ? accent : "var(--border)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.08, ease: "easeOut" }}
      className="relative group"
    >
      {/* Corner crosshairs — only on featured card, matching the screenshot */}
      {featured && (
        <>
          <Crosshair position="tl" />
          <Crosshair position="tr" />
          <Crosshair position="bl" />
          <Crosshair position="br" />
        </>
      )}

      <article
        className="relative h-full p-6 md:p-7 flex flex-col gap-5"
        style={{
          border: `1px dashed ${borderColor}`,
          borderRadius: 2,
          background: "var(--bg-raised)",
          transition: "border-color 200ms ease, transform 200ms ease",
        }}
      >
        {/* Header — title + action icons */}
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/projects/${project.slug}`}>
              <h3
                className="text-[20px] md:text-[22px] mb-1.5 truncate"
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", fontWeight: 600 }}
              >
                {project.title}
              </h3>
            </Link>
            {project.subtitle && (
              <p
                className="text-[14px]"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: featured ? "#4ade80" : "var(--ink-3)",
                  fontWeight: 500,
                }}
              >
                {project.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0" style={{ color: "var(--ink-3)" }}>
            {project.links?.deployed && (
              <a
                href={project.links.deployed}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:opacity-70 transition-opacity"
                aria-label="Open live site"
              >
                <GlobeIcon />
              </a>
            )}
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:opacity-70 transition-opacity"
                aria-label="Open repo"
              >
                <GitBranchIcon />
              </a>
            )}
          </div>
        </header>

        {/* Excerpt with bullet marker */}
        <div className="flex items-start gap-3">
          <BulletMark accent={featured} />
          <p
            className="text-[15px] md:text-[16px] leading-[1.7] flex-1"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontWeight: 500 }}
          >
            {project.excerpt}
          </p>
        </div>

        {/* Stack tags */}
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {project.stack.map((tag) => (
            <TagBadge key={tag} variant={featured ? "accent" : "default"}>
              {tag}
            </TagBadge>
          ))}
        </div>
      </article>
    </motion.div>
  );
}

function BulletMark({ accent = false }: { accent?: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="mt-1.5 shrink-0"
      style={{ color: accent ? "#4ade80" : "var(--ink-4)" }}
    >
      <path d="M3 2l6 4-6 4V2z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1" />
      <path d="M1.5 7.5h12M7.5 1.5c1.8 2 1.8 10 0 12M7.5 1.5c-1.8 2-1.8 10 0 12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function GitBranchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="4" cy="3" r="1.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="4" cy="12" r="1.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="11" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1" />
      <path d="M4 4.5v6M5.5 3H8a1.5 1.5 0 011.5 1.5V6" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function Crosshair({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const pos: Record<typeof position, string> = {
    tl: "-top-1 -left-1",
    tr: "-top-1 -right-1",
    bl: "-bottom-1 -left-1",
    br: "-bottom-1 -right-1",
  };
  return (
    <span
      className={`absolute ${pos[position]} w-2 h-2 pointer-events-none`}
      style={{ color: "#4ade80" }}
      aria-hidden
    >
      <svg viewBox="0 0 8 8" width="8" height="8" fill="none">
        <path d="M0 4h8M4 0v8" stroke="currentColor" strokeWidth="1" />
      </svg>
    </span>
  );
}
