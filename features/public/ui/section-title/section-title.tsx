"use client";

import Link from "next/link";
import { motion } from "motion/react";

/**
 * Hex-shaped centered section header used to split landing sections.
 * Ex: "/projects", "/blogs", "/stats"
 *
 * If `href` is provided, the hex becomes a link with a subtle hover lift.
 */
export function SectionTitle({ label, href }: { label: string; href?: string }) {
  const hex = (
    <HexFrame interactive={!!href}>
      <span
        className="text-[15px] md:text-[16px] tracking-wide"
        style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", fontWeight: 600 }}
      >
        {label}
      </span>
      {href && (
        <span
          className="text-[13px] tracking-[0.15em]"
          style={{ color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}
          aria-hidden
        >
          →
        </span>
      )}
    </HexFrame>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex items-center justify-center py-10"
    >
      <span
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-dashed pointer-events-none"
        style={{ borderColor: "var(--border)" }}
        aria-hidden
      />
      <div className="relative">
        {href ? (
          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <Link href={href} className="block">
              {hex}
            </Link>
          </motion.div>
        ) : (
          hex
        )}
      </div>
    </motion.div>
  );
}

function HexFrame({
  children,
  interactive,
}: {
  children: React.ReactNode;
  interactive?: boolean;
}) {
  return (
    <div
      className="relative px-9 py-3"
      style={{
        background: "var(--bg)",
        clipPath:
          "polygon(14px 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0 50%)",
        cursor: interactive ? "pointer" : "default",
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 200 40"
      >
        <polygon
          points="14,0 186,0 200,20 186,40 14,40 0,20"
          fill="none"
          stroke="var(--ink-3)"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative z-10 flex items-center gap-2">{children}</div>
    </div>
  );
}
