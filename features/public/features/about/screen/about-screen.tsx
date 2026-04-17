import { PageShell } from "@/features/public/ui/page-shell/page-shell";
import { PageHeader } from "@/features/public/ui/page-header/page-header";
import { PageViewTracker } from "@/features/public/shared/utils/page-view-tracker";
import { SectionLabel } from "@/features/public/ui/section-label/section-label";
import { BioBlock } from "./parts/bio-block";
import { SkillsGrid } from "./parts/skills-grid";
import { PersonalTimeline } from "./parts/personal-timeline";

export function AboutScreen() {
  return (
    <PageShell>
      <PageViewTracker />
      <PageHeader
        path="/about"
        title="about"
        subtitle="the human behind the repo."
      />

      <div className="px-6 md:px-10 lg:px-12 py-10 flex flex-col gap-16">
        {/* Bio + Timeline two-column */}
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-10 lg:gap-14">
          <div>
            <div className="mb-6">
              <SectionLabel>bio</SectionLabel>
            </div>
            <BioBlock />
          </div>
          <div>
            <div className="mb-6">
              <SectionLabel>timeline</SectionLabel>
            </div>
            <PersonalTimeline />
          </div>
        </section>

        {/* Skills */}
        <section>
          <div className="mb-6">
            <SectionLabel>tech stack</SectionLabel>
          </div>
          <SkillsGrid />
        </section>
      </div>
    </PageShell>
  );
}
