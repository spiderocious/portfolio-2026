import type { ReactNode } from "react";
import { TerminalNav } from "@/features/public/ui/nav/terminal-nav";
import { Footer } from "@/features/public/ui/footer/footer";

/**
 * Consistent outer frame for every public page (non-landing).
 * Mirrors the shell used on the landing screen.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="px-4 md:px-8 py-6 md:py-8 flex justify-center items-start">
        <div
          className="mx-auto max-w-400 border border-dashed w-full"
          style={{
            borderColor: "var(--border)",
            borderRadius: 2,
            background: "var(--bg)",
          }}
        >
          <TerminalNav />
          {children}
          <Footer />
        </div>
      </div>
    </main>
  );
}
