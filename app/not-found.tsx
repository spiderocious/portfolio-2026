"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background: "#000",
        color: "#E2DED5",
        fontFamily: "var(--font-mono)",
      }}
    >
      <div className="w-full max-w-[520px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="p-6 md:p-8"
          style={{
            border: "1px dashed #2A2A2A",
            borderRadius: 2,
            background: "#0A0A0A",
          }}
        >
          <p className="text-[12px] tracking-[0.2em] uppercase mb-6" style={{ color: "#6A645C" }}>
            <span style={{ color: "#4ade80" }}>$</span> cat {typeof window !== "undefined" ? window.location.pathname : ""}
          </p>

          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="text-[64px] md:text-[88px] leading-none mb-4"
            style={{ color: "#F5F2EC", fontWeight: 500, letterSpacing: "-0.03em" }}
          >
            404
            <motion.span
              className="inline-block w-[12px] h-[58px] md:h-[78px] ml-2"
              style={{ background: "#4ade80", verticalAlign: "middle" }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="text-[14px] mb-8 leading-[1.65]"
            style={{ color: "#A8A298" }}
          >
            this page doesn&apos;t exist — or maybe it did and i deleted it. either way, nothing here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-[13px]"
              style={{
                color: "#F5F2EC",
                border: "1px dashed #2A2A2A",
                borderRadius: 2,
              }}
            >
              ← back to home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
