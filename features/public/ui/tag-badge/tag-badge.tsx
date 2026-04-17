import type { ReactNode } from "react";

type Variant = "default" | "accent";

interface TagBadgeProps {
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md";
}

export function TagBadge({ children, variant = "default", size = "md" }: TagBadgeProps) {
  const isAccent = variant === "accent";
  const pad =
    size === "sm"
      ? "px-2.5 py-1 text-[12px]"
      : "px-3 py-1.5 text-[13px]";

  return (
    <span
      className={`${pad} inline-flex items-center tracking-wide`}
      style={{
        fontFamily: "var(--font-mono)",
        color: isAccent ? "#4ade80" : "var(--ink)",
        fontWeight: 500,
        background: "transparent",
        border: `1px solid ${isAccent ? "rgba(74, 222, 128, 0.45)" : "var(--border)"}`,
        borderRadius: 2,
      }}
    >
      {children}
    </span>
  );
}
