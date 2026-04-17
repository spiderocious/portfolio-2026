import type { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  withDash?: boolean;
  align?: "left" | "right";
}

export function SectionLabel({ children, withDash = true, align = "left" }: SectionLabelProps) {
  return (
    <div
      className={`flex items-center gap-4 ${align === "right" ? "flex-row-reverse" : ""}`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span
        className="text-[11px] tracking-[0.25em] uppercase whitespace-nowrap"
        style={{ color: "var(--ink-3)" }}
      >
        {children}
      </span>
      {withDash && (
        <span
          className="flex-1 border-t border-dashed"
          style={{ borderColor: "var(--border)" }}
        />
      )}
    </div>
  );
}
