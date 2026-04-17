"use client";

import { motion } from "motion/react";
import { BIO_PARAGRAPHS } from "../../data/about-data";

export function BioBlock() {
  return (
    <div className="flex flex-col gap-5 max-w-[640px]">
      {BIO_PARAGRAPHS.map((p, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: i * 0.08 }}
          className="text-[17px] md:text-[18px] leading-[1.85]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontWeight: 500 }}
        >
          {p}
        </motion.p>
      ))}
    </div>
  );
}
