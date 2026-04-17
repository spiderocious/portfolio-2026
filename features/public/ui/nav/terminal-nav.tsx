"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MobileMenu } from "./mobile-menu";

const NAV_LINKS = [
  { label: "/home", href: "/" },
  { label: "/projects", href: "/projects" },
  { label: "/blogs", href: "/blog" },
];

const CONTACT_LINK = { label: "/contact.sh" };

function useLiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    const raf = requestAnimationFrame(() => setNow(new Date()));
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, []);
  return now;
}

function formatTime(d: Date | null) {
  if (!d) return "--:--:--";
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => n.toString().padStart(2, "0"))
    .join(":");
}

export function TerminalNav() {
  const pathname = usePathname();
  const now = useLiveClock();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center justify-between gap-4 px-6 py-5 md:px-10 lg:px-12 border-b border-dashed"
        style={{
          borderColor: "var(--border)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {/* Left — terminal prompt + clock */}
        <div className="flex items-center gap-4 md:gap-6 text-[14px] md:text-[15px] min-w-0" style={{ fontWeight: 500 }}>
          <span
            className="flex items-center gap-1.5 whitespace-nowrap"
            style={{ color: "var(--ink)", fontWeight: 600 }}
          >
            <span>nycx@dev</span>
            <span style={{ color: "#4ade80" }}>~</span>
            <span style={{ color: "var(--ink-3)" }}>$</span>
          </span>
          <span
            className="tabular-nums hidden sm:inline whitespace-nowrap"
            style={{ color: "var(--ink-2)" }}
            suppressHydrationWarning
          >
            {formatTime(now)}
          </span>
        </div>

        {/* Center — primary nav (hidden on small screens) */}
        <div className="hidden md:flex items-center gap-1 text-[15px]">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-2 transition-colors duration-150"
                style={{
                  color: active ? "var(--ink)" : "var(--ink-2)",
                  fontWeight: active ? 600 : 500,
                  border: active ? "1px dashed #4ade80" : "1px dashed transparent",
                  borderRadius: 2,
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right — contact (opens LLM popup) */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-llm"))}
          className="hidden sm:inline text-[15px] transition-colors duration-150 cursor-pointer hover:text-[var(--ink)]"
          style={{ color: "var(--ink)", fontFamily: "var(--font-mono)", fontWeight: 500 }}
        >
          {CONTACT_LINK.label}
        </button>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="md:hidden px-3 py-1.5 text-[13px] border border-dashed cursor-pointer"
          style={{
            borderColor: "var(--border)",
            color: "var(--ink-2)",
            borderRadius: 2,
          }}
          aria-label="Open menu"
        >
          ./menu.sh
        </button>
      </motion.nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
