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
    <div className="sticky bottom-0 bg-a-base border-t border-a-border-sub -mx-8 px-8 py-4 flex items-center justify-between mt-10">
      <Link
        href={backHref}
        className="font-mono text-[11px] text-a-ink-7 hover:text-a-ink-4 transition-colors duration-150"
      >
        {backLabel}
      </Link>
      <div className="flex items-center gap-3">
        {onDiscard && (
          <button
            type="button"
            onClick={onDiscard}
            className="h-9 px-4 font-mono text-[11px] text-a-ink-5 bg-transparent border border-a-border-hov rounded hover:border-a-border-act hover:text-a-ink-4 transition-colors duration-150 cursor-pointer"
          >
            discard
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className={[
            "h-9 px-4 font-mono text-[11px] font-medium rounded transition-colors duration-150 border-none",
            saving
              ? "bg-a-btn-dis text-a-base cursor-not-allowed"
              : "bg-a-btn text-a-base hover:bg-a-btn-hov cursor-pointer",
          ].join(" ")}
        >
          {saving ? "saving..." : saveLabel}
        </button>
      </div>
    </div>
  );
}
