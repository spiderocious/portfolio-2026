"use client";

import Link from "next/link";

interface FormActionBarProps {
  backHref: string;
  backLabel?: string;
  onDiscard?: () => void;
  saveLabel?: string;
  saving?: boolean;
}

export function FormActionBar({
  backHref,
  backLabel = "← back",
  onDiscard,
  saveLabel = "save",
  saving = false,
}: FormActionBarProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t-2 border-black -mx-8 px-8 py-4 flex items-center justify-between mt-10">
      <Link
        href={backHref}
        className="font-mono text-[11px] font-semibold text-[#666] hover:text-black transition-colors duration-150"
      >
        {backLabel}
      </Link>
      <div className="flex items-center gap-3">
        {onDiscard && (
          <button
            type="button"
            onClick={onDiscard}
            className="h-9 px-4 font-mono text-[11px] font-semibold text-black bg-white border-2 border-black rounded hover:bg-[#f4f4f4] transition-colors duration-150 cursor-pointer"
          >
            discard
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className={[
            "h-9 px-5 font-mono text-[11px] font-bold rounded border-none transition-colors duration-150",
            saving
              ? "bg-[#ccc] text-white cursor-not-allowed"
              : "bg-[#4ade80] text-black hover:bg-[#22c55e] cursor-pointer",
          ].join(" ")}
        >
          {saving ? "saving..." : saveLabel}
        </button>
      </div>
    </div>
  );
}
