"use client";

import { motion } from "motion/react";
import { SKILL_GROUPS } from "../../data/about-data";
import { TagBadge } from "@/features/public/ui/tag-badge/tag-badge";

export function SkillsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {SKILL_GROUPS.map((group, i) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.06 }}
          className="p-5"
          style={{
            border: "1px dashed var(--border)",
            borderRadius: 2,
            background: "var(--bg-raised)",
          }}
        >
          <p
            className="text-[10px] tracking-[0.25em] uppercase mb-3"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
          >
            ◇ {group.title}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.tags.map((t) => (
              <TagBadge key={t} size="sm">{t}</TagBadge>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
