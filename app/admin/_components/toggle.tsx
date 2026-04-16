"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md";
}

export function Toggle({ checked, onChange, size = "md" }: ToggleProps) {
  const trackW = size === "sm" ? "w-7" : "w-8";
  const trackH = size === "sm" ? "h-4" : "h-[18px]";
  const thumbSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";
  const thumbTranslate = checked
    ? size === "sm" ? "translate-x-3.5" : "translate-x-4"
    : "translate-x-0.5";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0",
        trackW,
        trackH,
        checked ? "bg-[#4ade80]" : "bg-[#f4f4f4] border border-[#d0d0d0]",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block rounded-full transition-transform duration-200",
          thumbSize,
          thumbTranslate,
          checked ? "bg-white" : "bg-[#888]",
        ].join(" ")}
      />
    </button>
  );
}
