"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

const ITEMS: Array<{ label: string; href?: string; action?: "llm" }> = [
  { label: "/home", href: "/" },
  { label: "/projects", href: "/projects" },
  { label: "/experience", href: "/experience" },
  { label: "/blog", href: "/blog" },
  { label: "/experiments", href: "/experiments" },
  { label: "/awards", href: "/awards" },
  { label: "/board", href: "/board" },
  { label: "/activity", href: "/activity" },
  { label: "/about", href: "/about" },
  { label: "/contact.sh", action: "llm" },
];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 md:hidden"
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.nav
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mx-4 mt-16 flex flex-col overflow-hidden"
            style={{
              background: "var(--bg-raised)",
              border: "1px dashed var(--border)",
              borderRadius: 2,
              fontFamily: "var(--font-mono)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-dashed"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-[12px]" style={{ color: "var(--ink-3)" }}>
                <span style={{ color: "#4ade80" }}>$</span> ./menu.sh
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-[13px] cursor-pointer"
                style={{ color: "var(--ink-3)" }}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <ul className="flex flex-col">
              {ITEMS.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 + i * 0.025 }}
                  className="border-b border-dashed last:border-b-0"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between px-4 py-3.5 text-[14px]"
                      style={{ color: "var(--ink)" }}
                    >
                      <span>{item.label}</span>
                      <span style={{ color: "var(--ink-4)" }}>→</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        requestAnimationFrame(() =>
                          window.dispatchEvent(new CustomEvent("open-llm"))
                        );
                      }}
                      className="flex items-center justify-between w-full px-4 py-3.5 text-[14px] cursor-pointer text-left"
                      style={{ color: "var(--ink)" }}
                    >
                      <span>{item.label}</span>
                      <span style={{ color: "#4ade80" }}>→</span>
                    </button>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
