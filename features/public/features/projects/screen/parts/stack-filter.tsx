"use client";

import { motion } from "motion/react";

interface StackFilterProps {
  tags: string[];
  active: string | null;
  onChange: (tag: string | null) => void;
}

export function StackFilter({ tags, active, onChange }: StackFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      <FilterPill
        label="all"
        isActive={active === null}
        onClick={() => onChange(null)}
      />
      {tags.map((tag) => (
        <FilterPill
          key={tag}
          label={tag}
          isActive={active === tag}
          onClick={() => onChange(tag === active ? null : tag)}
        />
      ))}
    </div>
  );
}

function FilterPill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className="relative px-3 py-1.5 text-[11px] tracking-wide whitespace-nowrap shrink-0 cursor-pointer"
      style={{
        fontFamily: "var(--font-mono)",
        color: isActive ? "var(--bg)" : "var(--ink-2)",
        background: isActive ? "var(--ink)" : "transparent",
        border: `1px dashed ${isActive ? "var(--ink)" : "var(--border)"}`,
        borderRadius: 2,
      }}
    >
      {label}
    </motion.button>
  );
}
