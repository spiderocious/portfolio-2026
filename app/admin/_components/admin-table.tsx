import React from "react";
import { AdminCard } from "./admin-card";

// ─── AdminTable ──────────────────────────────────────────────────────────────

interface Column {
  label: string;
  align?: "left" | "right" | "center";
}

interface AdminTableProps {
  columns: Column[];
  columnWidths: string;
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyText?: string;
}

export function AdminTable({
  columns,
  columnWidths,
  children,
  isEmpty = false,
  emptyText = "no entries yet.",
}: AdminTableProps) {
  return (
    <AdminCard>
      <div
        className="grid bg-[#f4f4f4] border-b-2 border-black h-10"
        style={{ gridTemplateColumns: columnWidths }}
      >
        {columns.map((col, i) => (
          <Th key={i} align={col.align}>
            {col.label}
          </Th>
        ))}
      </div>
      {isEmpty ? <EmptyRow>{emptyText}</EmptyRow> : children}
    </AdminCard>
  );
}

// ─── Th ─────────────────────────────────────────────────────────────────────

interface ThProps {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
}

export function Th({ children, align = "left" }: ThProps) {
  return (
    <div
      className={[
        "font-mono text-[9px] font-black uppercase tracking-[0.18em] text-black flex items-center px-4",
        align === "right" ? "justify-end" : align === "center" ? "justify-center" : "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// ─── Tr ─────────────────────────────────────────────────────────────────────

interface TrProps {
  children: React.ReactNode;
  columnWidths: string;
  height?: string;
}

export function Tr({ children, columnWidths, height = "h-[52px]" }: TrProps) {
  return (
    <div
      className={[
        "grid items-center border-b border-[#e0e0e0] last:border-b-0",
        "hover:bg-[#f9f9f9] transition-colors duration-100",
        height,
      ].join(" ")}
      style={{ gridTemplateColumns: columnWidths }}
    >
      {children}
    </div>
  );
}

// ─── Td ─────────────────────────────────────────────────────────────────────

interface TdProps {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

export function Td({ children, align = "left", className = "" }: TdProps) {
  return (
    <div
      className={[
        "px-4 flex items-center overflow-hidden",
        align === "right" ? "justify-end" : align === "center" ? "justify-center" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// ─── EmptyRow ────────────────────────────────────────────────────────────────

export function EmptyRow({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center h-[120px]">
      <p className="font-mono text-[11px] font-medium text-[#999]">
        {children ?? "no entries yet."}
      </p>
    </div>
  );
}
