"use client";

import { motion } from "motion/react";

/**
 * Decorative isometric graphic used on the landing hero.
 * Three floating label chips (WEB3 / DESIGN / WEB2) connected by dashed lines
 * to a stacked isometric cube tower on the right.
 */
export function IsoGraphic() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
      className="relative w-full h-full min-h-[320px] select-none pointer-events-none"
      aria-hidden
    >
      <svg
        viewBox="0 0 560 420"
        className="absolute inset-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dashed connection lines */}
        <g
          stroke="var(--ink-3)"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.7"
        >
          {/* WEB3 → top of stack */}
          <path d="M 210 110 L 360 110 L 400 135" />
          {/* DESIGN → middle */}
          <path d="M 180 200 L 360 200 L 400 190" />
          {/* WEB2 → bottom of stack */}
          <path d="M 150 265 L 360 265 L 400 245" />
        </g>

        {/* Label chips */}
        <LabelChip x={120} y={90} text="WEB3" />
        <LabelChip x={100} y={180} text="DESIGN" />
        <LabelChip x={80} y={245} text="WEB2" />

        {/* Isometric stacked tower on the right */}
        <g transform="translate(360 90)">
          <IsoBlock yOffset={0} top />
          <IsoBlock yOffset={56} />
          <IsoBlock yOffset={112} />
          {/* Base platform */}
          <g opacity="0.55">
            <path
              d="M 20 210 L 100 170 L 180 210 L 100 250 Z"
              stroke="var(--ink-3)"
              strokeWidth="1"
              strokeDasharray="2 3"
              fill="none"
            />
          </g>
        </g>
      </svg>
    </motion.div>
  );
}

interface LabelChipProps {
  x: number;
  y: number;
  text: string;
}

function LabelChip({ x, y, text }: LabelChipProps) {
  const width = text.length * 8 + 22;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        width={width}
        height={26}
        rx={2}
        fill="transparent"
        stroke="var(--ink-3)"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.7"
      />
      <text
        x={width / 2}
        y={17}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="11"
        letterSpacing="1.5"
        fill="var(--ink-2)"
        opacity="0.85"
      >
        {text}
      </text>
    </g>
  );
}

interface IsoBlockProps {
  yOffset: number;
  top?: boolean;
}

function IsoBlock({ yOffset, top = false }: IsoBlockProps) {
  // Isometric cube with top + left + right faces
  const stroke = "var(--ink-2)";
  const fill = top ? "var(--bg-alt)" : "transparent";
  return (
    <g transform={`translate(20 ${yOffset})`} opacity={0.85}>
      {/* Top face */}
      <path
        d={`M 0 40 L 80 0 L 160 40 L 80 80 Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
      />
      {/* Left face */}
      <path
        d={`M 0 40 L 0 80 L 80 120 L 80 80 Z`}
        fill="transparent"
        stroke={stroke}
        strokeWidth="1"
      />
      {/* Right face */}
      <path
        d={`M 160 40 L 160 80 L 80 120 L 80 80 Z`}
        fill="transparent"
        stroke={stroke}
        strokeWidth="1"
      />
      {top && (
        /* Decorative dots/squares on top face */
        <g transform="translate(58 32)" fill="var(--ink-3)" opacity="0.6">
          <rect x="0" y="0" width="4" height="4" />
          <rect x="8" y="0" width="4" height="4" />
          <rect x="16" y="0" width="4" height="4" />
          <rect x="0" y="6" width="4" height="4" />
          <rect x="8" y="6" width="4" height="4" />
          <rect x="16" y="6" width="4" height="4" />
        </g>
      )}
    </g>
  );
}
