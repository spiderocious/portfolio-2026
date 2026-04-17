import { getActivityFeed } from "@/lib/services/activity";
import { PageShell } from "@/features/public/ui/page-shell/page-shell";
import { PageHeader } from "@/features/public/ui/page-header/page-header";
import { PageViewTracker } from "@/features/public/shared/utils/page-view-tracker";
import { EmptyState } from "@/features/public/ui/empty-state/empty-state";
import { ActivityFeed } from "./parts/activity-feed";

export async function ActivityScreen() {
  const { items, has_more } = await getActivityFeed({ limit: 20 });

  return (
    <PageShell>
      <PageViewTracker />
      <PageHeader
        path="/activity"
        title="activity"
        subtitle="live feed. commits, posts, project updates. auto-populated from github + hand-curated."
        count={items.length}
      />

      {items.length === 0 ? (
        <div className="px-6 md:px-10 lg:px-12 py-10">
          <EmptyState>$ no activity yet — watch this space.</EmptyState>
        </div>
      ) : (
        <ActivityFeed initial={items} initialHasMore={has_more} />
      )}
    </PageShell>
  );
}
