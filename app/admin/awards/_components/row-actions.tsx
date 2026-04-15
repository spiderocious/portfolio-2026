"use client";

import Link from "next/link";
import { useState } from "react";
import { ConfirmDialog } from "../../_components/confirm-dialog";
import { deleteAwardAction } from "../actions";

export function AwardRowActions({ awardId, title }: { awardId: string; title: string }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="flex items-center gap-1 justify-end">
      <Link href={`/admin/awards/${awardId}`} className="w-7 h-7 flex items-center justify-center text-a-ink-6 hover:text-a-ink-4 transition-colors duration-150">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2L12 4.5L4.5 12H2v-2.5L9.5 2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /></svg>
      </Link>
      <button type="button" onClick={() => setConfirming(true)} className="w-7 h-7 flex items-center justify-center text-a-ink-6 hover:text-a-red transition-colors duration-150 bg-transparent border-none cursor-pointer">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2.5h4V4M3 4l1 8h6l1-8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {confirming && (
        <ConfirmDialog
          title="delete award?"
          body={`this will permanently delete "${title}". this cannot be undone.`}
          onCancel={() => setConfirming(false)}
          onConfirm={async () => { await deleteAwardAction(awardId); }}
        />
      )}
    </div>
  );
}
