import { getAllProjects } from "@/lib/services/projects";
import { PageShell } from "@/features/public/ui/page-shell/page-shell";
import { PageHeader } from "@/features/public/ui/page-header/page-header";
import { PageViewTracker } from "@/features/public/shared/utils/page-view-tracker";
import { ProjectsGrid } from "./parts/projects-grid";

export async function ProjectsScreen() {
  const projects = await getAllProjects();

  return (
    <PageShell>
      <PageViewTracker />
      <PageHeader
        path="/projects"
        title="projects"
        subtitle="things i've built — shipped, in progress, and the ones that taught me something."
        count={projects.length}
        countLabel={projects.length === 1 ? "project" : "projects"}
      />
      <ProjectsGrid projects={projects} />
    </PageShell>
  );
}
