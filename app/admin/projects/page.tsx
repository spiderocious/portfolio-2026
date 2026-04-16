import { getAllProjects } from "@/lib/services/projects";
import type { Project, ProjectStatus } from "@/lib/services/types";
import { AdminTable, Tr, Td } from "../_components/admin-table";
import { SectionLabel } from "../_components/section-label";
import { StatusBadge } from "../_components/status-badge";
import { ToggleDisplay } from "../_components/toggle-display";
import { StackTags } from "../_components/stack-tags";
import { ProjectsTopbarAction } from "./_components/topbar-action";
import { ProjectRowActions } from "./_components/row-actions";

const COLS = "1fr 110px 90px 200px 120px 80px";

const statusVariant: Record<ProjectStatus, "green" | "yellow" | "grey"> = {
  active:   "green",
  wip:      "yellow",
  archived: "grey",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="flex flex-col gap-4">
      <ProjectsTopbarAction />
      <SectionLabel>all projects</SectionLabel>
      <AdminTable
        columns={[
          { label: "title" },
          { label: "status" },
          { label: "featured" },
          { label: "stack" },
          { label: "created" },
          { label: "actions", align: "right" },
        ]}
        columnWidths={COLS}
        isEmpty={projects.length === 0}
        emptyText="no projects yet. add your first one."
      >
        {projects.map((project) => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </AdminTable>
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <Tr columnWidths={COLS}>
      <Td>
        <span className="font-mono text-[12px] font-semibold text-black">{project.title}</span>
      </Td>
      <Td>
        <StatusBadge label={project.status} variant={statusVariant[project.status]} />
      </Td>
      <Td>
        <ToggleDisplay value={project.featured} />
      </Td>
      <Td>
        <StackTags tags={project.stack} />
      </Td>
      <Td>
        <span className="font-mono text-[11px] text-[#666]">{formatDate(project.created_at)}</span>
      </Td>
      <Td align="right">
        <ProjectRowActions projectId={project.id} projectTitle={project.title} />
      </Td>
    </Tr>
  );
}
