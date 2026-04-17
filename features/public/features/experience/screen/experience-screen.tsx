import { getAllExperience } from "@/lib/services/experience";
import { PageShell } from "@/features/public/ui/page-shell/page-shell";
import { PageHeader } from "@/features/public/ui/page-header/page-header";
import { PageViewTracker } from "@/features/public/shared/utils/page-view-tracker";
import { EmptyState } from "@/features/public/ui/empty-state/empty-state";
import { ExperienceTimeline } from "./parts/experience-timeline";

export async function ExperienceScreen() {
  const experience = await getAllExperience();

  return (
    <PageShell>
      <PageViewTracker />
      <PageHeader
        path="/experience"
        title="experience"
        subtitle="where i've worked, what i shipped, what it taught me."
        count={experience.length}
        countLabel={experience.length === 1 ? "role" : "roles"}
      />

      <div className="px-6 md:px-10 lg:px-12 py-10">
        {experience.length === 0 ? (
          <EmptyState>$ no work history published yet.</EmptyState>
        ) : (
          <ExperienceTimeline experience={experience} />
        )}
      </div>
    </PageShell>
  );
}
