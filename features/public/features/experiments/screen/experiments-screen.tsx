import { getAllExperiments } from "@/lib/services/experiments";
import { PageShell } from "@/features/public/ui/page-shell/page-shell";
import { PageHeader } from "@/features/public/ui/page-header/page-header";
import { PageViewTracker } from "@/features/public/shared/utils/page-view-tracker";
import { ExperimentsGrid } from "./parts/experiments-grid";

export async function ExperimentsScreen() {
  const experiments = await getAllExperiments();

  return (
    <PageShell>
      <PageViewTracker />
      <PageHeader
        path="/experiments"
        title="experiments"
        subtitle="the playground — side projects, ideas, tinkering. sometimes polished, often not."
        count={experiments.length}
        countLabel={experiments.length === 1 ? "experiment" : "experiments"}
      />
      <ExperimentsGrid experiments={experiments} />
    </PageShell>
  );
}
