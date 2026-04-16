import React from "react";

interface FieldLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

export function FieldLabel({ children, htmlFor }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-black mb-1.5 block"
    >
      {children}
    </label>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] text-[#888] mt-1">{children}</p>
  );
}
