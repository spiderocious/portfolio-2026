export function ToggleDisplay({ value }: { value: boolean }) {
  return (
    <div
      className={[
        "relative inline-flex items-center rounded-full w-8 h-[18px] transition-colors duration-200",
        value ? "bg-[#4ade80]" : "bg-[#d0d0d0]",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200",
          value ? "translate-x-4" : "translate-x-0.5",
        ].join(" ")}
      />
    </div>
  );
}
