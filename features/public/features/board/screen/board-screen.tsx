import { getBoardItems } from "@/lib/services/board";
import { PageShell } from "@/features/public/ui/page-shell/page-shell";
import { PageHeader } from "@/features/public/ui/page-header/page-header";
import { PageViewTracker } from "@/features/public/shared/utils/page-view-tracker";
import { EmptyState } from "@/features/public/ui/empty-state/empty-state";
import { FullKanban } from "./parts/full-kanban";

export async function BoardScreen() {
  const board = await getBoardItems({ includePrivate: false });
  const total =
    board.backlog.length +
    board.in_progress.length +
    board.done.length +
    board.on_hold.length;

  return (
    <PageShell>
      <PageViewTracker />
      <PageHeader
        path="/board"
        title="board"
        subtitle="what i'm working on, planning, and thinking about. live board — not a static roadmap."
        count={total}
        countLabel={total === 1 ? "ticket" : "tickets"}
      />

      {total === 0 ? (
        <div className="px-6 md:px-10 lg:px-12 py-10">
          <EmptyState>$ board is empty — nothing to show yet.</EmptyState>
        </div>
      ) : (
        <FullKanban board={board} />
      )}
    </PageShell>
  );
}
