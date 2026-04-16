"use client";

interface ConfirmDialogProps {
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel = "delete",
  onConfirm,
  onCancel,
  danger = true,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
      <div className="bg-white border border-[#d0d0d0] rounded-xl shadow-lg w-[380px] p-7">
        <h3 className="font-mono text-[14px] font-semibold text-black mb-2">{title}</h3>
        <p className="font-mono text-[12px] text-[#666] leading-relaxed">{body}</p>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 px-4 font-mono text-[11px] text-[#666] bg-transparent border border-[#d0d0d0] rounded-md hover:border-[#aaa] hover:text-black transition-colors duration-150 cursor-pointer"
          >
            cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={[
              "h-9 px-4 font-mono text-[11px] font-semibold rounded-md transition-colors duration-150 cursor-pointer border-none",
              danger
                ? "bg-[#fee2e2] text-black hover:bg-red-600"
                : "bg-[#4ade80] text-black hover:bg-[#22c55e]",
            ].join(" ")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
