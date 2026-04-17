import type { Metadata } from "next";
import { BoardScreen } from "@/features/public/features/board/screen/board-screen";

// Always show current state
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Board — Feranmi Adeniji",
  description: "Current focus and what's next.",
};

export default function BoardPage() {
  return <BoardScreen />;
}
