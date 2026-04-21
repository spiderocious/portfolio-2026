import type { Metadata } from "next";
import { BoardScreen } from "@/features/public/features/board/screen/board-screen";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Board",
  description:
    "Live workspace of Feranmi Adeniji — what's in progress, planned, or shipped. A transparent Jira-style board of current focus.",
  path: "/board",
  tags: ["board", "workspace", "roadmap", "current focus"],
});

export default function BoardPage() {
  return <BoardScreen />;
}
