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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <div className="bg-a-card border border-a-border-hov rounded-md w-[380px] p-7">
        <h3 className="font-mono text-[14px] font-medium text-a-ink mb-2">{title}</h3>
        <p className="font-mono text-[12px] text-a-ink-4 leading-relaxed">{body}</p>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 px-4 font-mono text-[11px] text-a-ink-5 bg-transparent border border-a-border-hov rounded hover:border-a-border-act hover:text-a-ink-4 transition-colors duration-150 cursor-pointer"
          >
            cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={[
              "h-9 px-4 font-mono text-[11px] font-medium rounded transition-colors duration-150 cursor-pointer border-none",
              danger
                ? "bg-a-red text-a-base hover:bg-[#fca5a5]"
                : "bg-a-btn text-a-base hover:bg-a-btn-hov",
            ].join(" ")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
