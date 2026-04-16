import React from "react";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 pb-2 border-b-2 border-black">
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-black">
        {children}
      </p>
    </div>
  );
}
