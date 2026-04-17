import type { ReactNode } from "react";

type Variant = "default" | "accent";

interface TagBadgeProps {
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md";
}

export function TagBadge({ children, variant = "default", size = "md" }: TagBadgeProps) {
  const isAccent = variant === "accent";
  const pad = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]";

  return (
    <span
      className={`${pad} inline-flex items-center tracking-wide`}
      style={{
        fontFamily: "var(--font-mono)",
        color: isAccent ? "#4ade80" : "var(--ink-2)",
        background: "transparent",
        border: `1px solid ${isAccent ? "rgba(74, 222, 128, 0.4)" : "var(--border)"}`,
        borderRadius: 2,
      }}
    >
      {children}
    </span>
  );
}
