import { getBoardItems } from "@/lib/services/board";
import { BoardClient } from "./_components/board-client";

export default async function BoardPage() {
  const grouped = await getBoardItems({ includePrivate: true });
  return <BoardClient initial={grouped} />;
}
