import Link from "next/link";
import { getAllProjects } from "@/lib/services/projects";
import type { Project, ProjectStatus } from "@/lib/services/types";
import { ProjectsTopbarAction } from "./_components/topbar-action";
import { ProjectRowActions } from "./_components/row-actions";

const statusBadge: Record<ProjectStatus, string> = {
  active:   "bg-[#0e2a1a] border-[#1a5c30] text-a-green",
  wip:      "bg-[#1a1a0e] border-[#5c4a00] text-[#facc15]",
  archived: "bg-[#1a1a1a] border-[#2a2a2a] text-a-ink-6",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <>
      <ProjectsTopbarAction />

      {/* Section label */}
      <div className="mb-3 pb-2 border-b border-a-border-sub">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-a-ink-8">
          all projects
        </p>
      </div>

      {/* Table */}
      <div className="bg-a-card border border-a-border rounded-md overflow-hidden">
        {/* Header */}
        <div className="grid bg-a-surface h-9 border-b border-a-border-sub" style={{ gridTemplateColumns: "1fr 100px 90px 200px 120px 80px" }}>
          {["title", "status", "featured", "stack", "created", "actions"].map((h, i) => (
            <div
              key={h}
              className={[
                "font-mono text-[9px] uppercase tracking-[0.14em] text-a-ink-7 font-medium flex items-center px-4",
                i === 5 ? "justify-end" : "",
              ].join(" ")}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {projects.length === 0 ? (
          <div className="flex items-center justify-center h-[120px]">
            <p className="font-mono text-[11px] text-a-ink-7">
              no projects yet. add your first one.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))
        )}
      </div>
    </>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <div
      className="grid h-[52px] border-b border-[#191919] last:border-b-0 hover:bg-white/[0.02] transition-colors duration-100 items-center"
      style={{ gridTemplateColumns: "1fr 100px 90px 200px 120px 80px" }}
    >
      {/* Title */}
      <div className="px-4">
        <span className="font-mono text-[12px] text-a-ink-3 font-medium">{project.title}</span>
      </div>

      {/* Status */}
      <div className="px-4">
        <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${statusBadge[project.status]}`}>
          {project.status}
        </span>
      </div>

      {/* Featured toggle (display only) */}
      <div className="px-4">
        <div
          className={[
            "relative inline-flex items-center rounded-full w-8 h-[18px] transition-colors duration-200",
            project.featured ? "bg-a-green" : "bg-a-border-hov",
          ].join(" ")}
        >
          <span
            className={[
              "inline-block w-3.5 h-3.5 rounded-full transition-transform duration-200",
              project.featured ? "translate-x-4 bg-white" : "translate-x-0.5 bg-a-ink-6",
            ].join(" ")}
          />
        </div>
      </div>

      {/* Stack */}
      <div className="px-4 flex items-center gap-1 overflow-hidden">
        {project.stack.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="font-mono text-[10px] text-a-ink-4 bg-[#1a1a1a] border border-[#222] px-1.5 py-0.5 rounded whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
        {project.stack.length > 3 && (
          <span className="font-mono text-[10px] text-a-ink-7 whitespace-nowrap">
            +{project.stack.length - 3} more
          </span>
        )}
      </div>

      {/* Created */}
      <div className="px-4">
        <span className="font-mono text-[11px] text-a-ink-6">{formatDate(project.created_at)}</span>
      </div>

      {/* Actions */}
      <div className="px-4">
        <ProjectRowActions projectId={project.id} projectTitle={project.title} />
      </div>
    </div>
  );
}
