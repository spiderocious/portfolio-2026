"use client";

import { SectionLabel } from "@/features/public/ui/section-label/section-label";
import { SectionTitle } from "@/features/public/ui/section-title/section-title";
import type {
  BoardGrouped,
} from "@/lib/services/types";
import Link from "next/link";
import { FullKanban } from "../../../board/screen/parts/full-kanban";

interface BoardSectionProps {
  board: BoardGrouped;
}

export function BoardSection({ board }: BoardSectionProps) {
  const total =
    board.backlog.length +
    board.in_progress.length +
    board.done.length +
    board.on_hold.length;

  if (total === 0) return null;

  return (
    <section className="px-6 md:px-10 lg:px-12 pb-16">
      <SectionTitle label="/board" href="/board" />

      <div className="pt-4 mb-8 flex items-center justify-between gap-4">
        <SectionLabel>current focus</SectionLabel>
        <Link
          href="/board"
          className="text-[12px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
        >
          full board ({total}) →
        </Link>
      </div>

      <div className="overflow-x-auto -mx-6 md:-mx-10 lg:-mx-12 px-6 md:px-10 lg:px-12 pb-2">
        <FullKanban board={board} preview />
      </div>
    </section>
  );
}
