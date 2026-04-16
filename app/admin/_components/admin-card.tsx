import React from "react";

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminCard({ children, className = "" }: AdminCardProps) {
  return (
    <div className={["bg-white border-2 border-black rounded-md overflow-hidden", className].join(" ")}>
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-11 flex items-center justify-between px-5 border-b-2 border-black bg-[#f4f4f4]">
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-black">
      {children}
    </span>
  );
}

export function CardBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] font-semibold text-[#666] bg-white border border-[#d0d0d0] rounded px-2 py-0.5">
      {children}
    </span>
  );
}
