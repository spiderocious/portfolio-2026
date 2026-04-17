import { getAllAwards } from "@/lib/services/awards";
import { PageShell } from "@/features/public/ui/page-shell/page-shell";
import { PageHeader } from "@/features/public/ui/page-header/page-header";
import { PageViewTracker } from "@/features/public/shared/utils/page-view-tracker";
import { EmptyState } from "@/features/public/ui/empty-state/empty-state";
import { AwardRow } from "./parts/award-row";

export async function AwardsScreen() {
  const awards = await getAllAwards();

  return (
    <PageShell>
      <PageViewTracker />
      <PageHeader
        path="/awards"
        title="awards"
        subtitle="recognition, honours, credentials. what the work has earned."
        count={awards.length}
      />

      <div className="px-6 md:px-10 lg:px-12 py-10">
        {awards.length === 0 ? (
          <EmptyState>$ no awards published yet.</EmptyState>
        ) : (
          <div className="flex flex-col gap-4">
            {awards.map((award, i) => (
              <AwardRow key={award.id} award={award} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
