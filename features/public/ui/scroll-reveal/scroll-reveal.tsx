"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "article" | "li";
  className?: string;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: custom, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function ScrollReveal({
  children,
  delay = 0,
  as = "div",
  className,
}: ScrollRevealProps) {
  const MotionTag =
    as === "section" ? motion.section
      : as === "article" ? motion.article
      : as === "li" ? motion.li
      : motion.div;

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
      custom={delay}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
