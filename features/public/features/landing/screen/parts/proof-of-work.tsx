import { SectionLabel } from "@/features/public/ui/section-label/section-label";
import { SectionTitle } from "@/features/public/ui/section-title/section-title";
import { ProjectCard, type ProjectCardData } from "./project-card";

interface ProofOfWorkProps {
  projects: ProjectCardData[];
}

export function ProofOfWork({ projects }: ProofOfWorkProps) {
  return (
    <section className="px-6 md:px-10 lg:px-12 pb-16">
      <SectionTitle label="/projects" href="/projects" />

      <div className="pt-4 mb-8">
        <SectionLabel>proof of work</SectionLabel>
      </div>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div
      className="p-8 text-center border border-dashed"
      style={{
        borderColor: "var(--border)",
        borderRadius: 2,
        fontFamily: "var(--font-mono)",
        color: "var(--ink-4)",
        fontSize: 13,
      }}
    >
      $ ls projects/ — no featured projects yet.
    </div>
  );
}
