type BadgeVariant = "green" | "yellow" | "blue" | "purple" | "orange" | "grey" | "red";

const variants: Record<BadgeVariant, string> = {
  green:  "bg-[#dcfce7] border-[#4ade80] text-[#15803d]",
  yellow: "bg-[#fef9c3] border-[#ca8a04] text-[#854d0e]",
  blue:   "bg-[#dbeafe] border-[#2563eb] text-[#1e40af]",
  purple: "bg-[#ede9fe] border-[#7c3aed] text-[#4c1d95]",
  orange: "bg-[#ffedd5] border-[#ea580c] text-[#7c2d12]",
  grey:   "bg-[#f4f4f4] border-[#d0d0d0] text-[#555]",
  red:    "bg-[#fee2e2] border-[#ef4444] text-[#991b1b]",
};

interface StatusBadgeProps {
  label: string;
  variant: BadgeVariant;
}

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  return (
    <span
      className={[
        "font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full border",
        variants[variant],
      ].join(" ")}
    >
      {label}
    </span>
  );
}
