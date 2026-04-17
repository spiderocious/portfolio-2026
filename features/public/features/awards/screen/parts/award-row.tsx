"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Award } from "@/lib/services/types";
import { MarkdownRenderer } from "@/features/public/ui/markdown-renderer/markdown-renderer";

export function AwardRow({ award, index }: { award: Award; index: number }) {
  const date = new Date(award.date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const Wrapper = award.url ? motion.a : motion.div;
  const wrapperProps = award.url
    ? { href: award.url, target: "_blank", rel: "noreferrer noopener" }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.05 }}
    >
      <Wrapper
        {...wrapperProps}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="block p-5 md:p-6"
        style={{
          border: "1px dashed var(--border)",
          borderRadius: 2,
          background: "var(--bg-raised)",
        }}
      >
        <div className="flex items-start gap-5">
          {award.image_url && (
            <div
              className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 overflow-hidden"
              style={{ border: "1px dashed var(--border)", borderRadius: 2 }}
            >
              <Image src={award.image_url} alt={award.issuer} fill sizes="56px" className="object-cover" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-1.5">
              <h3
                className="text-[19px] md:text-[21px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", fontWeight: 600 }}
              >
                {award.title}
                {award.url && <span className="ml-2 text-[14px] opacity-60">↗</span>}
              </h3>
              <span
                className="text-[12px] tracking-[0.2em] uppercase whitespace-nowrap"
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)", fontWeight: 600 }}
              >
                {date}
              </span>
            </div>
            <p
              className="text-[14px] md:text-[15px] mb-3"
              style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontWeight: 500 }}
            >
              {award.issuer}
            </p>
            {award.description && <MarkdownRenderer content={award.description} />}
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
}
