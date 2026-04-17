export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-10 text-center"
      style={{
        border: "1px dashed var(--border)",
        borderRadius: 2,
        fontFamily: "var(--font-mono)",
        color: "var(--ink-3)",
        fontSize: 13,
      }}
    >
      {children}
    </div>
  );
}
