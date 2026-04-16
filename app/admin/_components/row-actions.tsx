"use client";

import Link from "next/link";
import React from "react";

export function RowActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5 justify-end">{children}</div>;
}

export function EditAction({ href }: { href: string }) {
  return (
    <Link
      href={href}
      title="edit"
      className="w-7 h-7 flex items-center justify-center text-[#999] hover:text-black border border-transparent hover:border-[#d0d0d0] rounded transition-all duration-150"
    >
      <PencilIcon />
    </Link>
  );
}

interface DeleteActionProps {
  onClick: () => void;
  title?: string;
}

export function DeleteAction({ onClick, title = "delete" }: DeleteActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="w-7 h-7 flex items-center justify-center text-[#999] hover:text-[#ef4444] border border-transparent hover:border-[#fca5a5] rounded transition-all duration-150 bg-transparent cursor-pointer"
    >
      <TrashIcon />
    </button>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M9.5 2L12 4.5L4.5 12H2v-2.5L9.5 2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 4h10M5 4V2.5h4V4M3 4l1 8h6l1-8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
