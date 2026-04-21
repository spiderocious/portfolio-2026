"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Animated hero portrait.
 *
 * Idle:
 *  - Gentle float (y, rotate)
 *  - Breathing inner glow
 *  - Rotating dashed ring wrapping the portrait
 *  - Orbiting corner crosshairs
 *  - A faint scan line sweeping top → bottom on loop
 *  - Pulsing "online" dot badge
 *
 * Hover:
 *  - Portrait leans into the cursor (tilt via parallax)
 *  - Extra dashed ring spins in
 *  - Chromatic-aberration-ish cyan/green offset glow
 *  - Crosshairs snap outward
 *  - Scan line accelerates
 */
export function HeroPortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Tilt springs
  const mx = useMotionValue(0); // -1..1
  const my = useMotionValue(0); // -1..1
  const rotateX = useSpring(useTransform(my, (v) => v * -8), {
    stiffness: 140,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, (v) => v * 10), {
    stiffness: 140,
    damping: 18,
  });
  const liftZ = useSpring(0, { stiffness: 180, damping: 22 });

  // Reset motion values when unhovered
  useEffect(() => {
    if (!hovered) {
      mx.set(0);
      my.set(0);
    }
  }, [hovered, mx, my]);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    mx.set(nx * 2);
    my.set(ny * 2);
  }

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ perspective: 900 }}
    >
      {/* Outer rotating dashed ring (always-on) */}
      <motion.svg
        className="absolute pointer-events-none"
        width="360"
        height="360"
        viewBox="0 0 360 360"
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        style={{ color: "var(--ink-3)" }}
      >
        <circle
          cx="180"
          cy="180"
          r="170"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.5"
        />
      </motion.svg>

      {/* Secondary counter-rotating ring (hover-amplified) */}
      <motion.svg
        className="absolute pointer-events-none"
        width="320"
        height="320"
        viewBox="0 0 320 320"
        aria-hidden
        animate={{ rotate: -360 }}
        transition={{ duration: hovered ? 10 : 48, repeat: Infinity, ease: "linear" }}
        style={{ color: "#4ade80", opacity: hovered ? 0.85 : 0.35 }}
      >
        <circle
          cx="160"
          cy="160"
          r="150"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 10"
        />
      </motion.svg>

      {/* Crosshair corners orbiting the portrait */}
      <Crosshair position="tl" hovered={hovered} />
      <Crosshair position="tr" hovered={hovered} />
      <Crosshair position="bl" hovered={hovered} />
      <Crosshair position="br" hovered={hovered} />

      {/* Ambient glow that breathes */}
      <motion.span
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 280,
          height: 280,
          background:
            "radial-gradient(circle at 50% 45%, rgba(74,222,128,0.18) 0%, rgba(74,222,128,0) 60%)",
          filter: "blur(4px)",
        }}
        animate={{
          scale: hovered ? [1, 1.12, 1] : [1, 1.05, 1],
          opacity: hovered ? [0.9, 1, 0.9] : [0.55, 0.8, 0.55],
        }}
        transition={{ duration: hovered ? 2.4 : 4.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The portrait tile with parallax tilt */}
      <motion.div
        ref={ref}
        onPointerEnter={() => {
          setHovered(true);
          liftZ.set(1);
        }}
        onPointerLeave={() => {
          setHovered(false);
          liftZ.set(0);
        }}
        onPointerMove={handlePointerMove}
        className="relative w-[240px] h-[240px] md:w-[260px] md:h-[260px]"
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
        }}
        animate={{
          y: hovered ? 0 : [0, -6, 0],
        }}
        transition={{
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* Chromatic-aberration-style offset layers — only visible on hover */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none mix-blend-screen"
          initial={false}
          animate={{
            opacity: hovered ? 0.55 : 0,
            x: hovered ? -4 : 0,
            y: hovered ? -2 : 0,
          }}
          transition={{ duration: 0.25 }}
          style={{ filter: "hue-rotate(90deg) saturate(2)" }}
          aria-hidden
        >
          <Image
            src="/feranmi.png"
            alt=""
            fill
            sizes="260px"
            className="object-cover"
            priority
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none mix-blend-screen"
          initial={false}
          animate={{
            opacity: hovered ? 0.4 : 0,
            x: hovered ? 4 : 0,
            y: hovered ? 2 : 0,
          }}
          transition={{ duration: 0.25 }}
          style={{ filter: "hue-rotate(-40deg) saturate(2)" }}
          aria-hidden
        >
          <Image
            src="/feranmi.png"
            alt=""
            fill
            sizes="260px"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Main portrait */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            border: "1px dashed var(--border)",
            background: "var(--bg-raised)",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(74,222,128,0.15)",
            transformStyle: "preserve-3d",
          }}
          animate={{
            boxShadow: hovered
              ? "0 22px 60px rgba(0,0,0,0.55), 0 0 0 2px rgba(74,222,128,0.55)"
              : "0 10px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(74,222,128,0.15)",
          }}
          transition={{ duration: 0.35 }}
        >
          <Image
            src="/feranmi.png"
            alt="Oluwaferanmi Adeniji"
            fill
            sizes="260px"
            priority
            className="object-cover"
          />

          {/* Scan line sweeping top → bottom */}
          <motion.span
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              height: 2,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.85) 50%, transparent 100%)",
              boxShadow: "0 0 12px rgba(74,222,128,0.7)",
            }}
            animate={{ top: ["-4%", "104%"] }}
            transition={{
              duration: hovered ? 1.4 : 3.6,
              repeat: Infinity,
              ease: "linear",
            }}
            aria-hidden
          />

          {/* Subtle scan-grid overlay */}
          <span
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.22) 0 1px, transparent 1px 3px)",
            }}
            aria-hidden
          />

          {/* Hover-only glitch stripes */}
          <motion.span
            className="absolute inset-0 pointer-events-none mix-blend-screen"
            initial={false}
            animate={{ opacity: hovered ? [0, 0.35, 0.1, 0.4, 0] : 0 }}
            transition={{ duration: 0.9, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(74,222,128,0.25) 0 2px, transparent 2px 9px)",
            }}
            aria-hidden
          />
        </motion.div>

        {/* Online status dot */}
        <motion.span
          className="absolute bottom-3 right-4 md:bottom-4 md:right-5 w-4 h-4 rounded-full z-10"
          style={{
            background: "#4ade80",
            border: "2px solid var(--bg)",
            boxShadow: "0 0 12px rgba(74,222,128,0.8)",
          }}
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />

        {/* Pulsing ring around the status dot */}
        <motion.span
          className="absolute bottom-3 right-4 md:bottom-4 md:right-5 w-4 h-4 rounded-full z-0 pointer-events-none"
          style={{ border: "2px solid rgba(74,222,128,0.6)" }}
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          aria-hidden
        />
      </motion.div>

      {/* Floating terminal tag — labels the portrait */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 pointer-events-none whitespace-nowrap"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--ink)",
          background: "var(--bg-raised)",
          border: "1px dashed var(--border)",
          borderRadius: 2,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <span style={{ color: "#4ade80" }}>●</span> feranmi.png
      </motion.div>
    </div>
  );
}

function Crosshair({
  position,
  hovered,
}: {
  position: "tl" | "tr" | "bl" | "br";
  hovered: boolean;
}) {
  const base: Record<typeof position, { top?: string; bottom?: string; left?: string; right?: string }> = {
    tl: { top: "8px", left: "8px" },
    tr: { top: "8px", right: "8px" },
    bl: { bottom: "8px", left: "8px" },
    br: { bottom: "8px", right: "8px" },
  };
  const offset = hovered
    ? ({
        tl: { top: "-10px", left: "-10px" },
        tr: { top: "-10px", right: "-10px" },
        bl: { bottom: "-10px", left: "-10px" },
        br: { bottom: "-10px", right: "-10px" },
      } as const)[position]
    : base[position];

  return (
    <motion.span
      className="absolute pointer-events-none"
      style={{ color: "#4ade80", width: 14, height: 14 }}
      animate={offset}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      aria-hidden
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M0 7h14M7 0v14" stroke="currentColor" strokeWidth="1" />
      </svg>
    </motion.span>
  );
}
