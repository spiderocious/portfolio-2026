import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/services/projects";
import { PageShell } from "@/features/public/ui/page-shell/page-shell";
import { BackLink } from "@/features/public/ui/back-link/back-link";
import { TagBadge } from "@/features/public/ui/tag-badge/tag-badge";
import { MarkdownRenderer } from "@/features/public/ui/markdown-renderer/markdown-renderer";
import { ProjectViewTracker } from "./parts/project-view-tracker";
import { ProjectLinksRow } from "./parts/project-links-row";
import { LiveDataGrid } from "./parts/live-data-grid";

interface Props {
  slug: string;
}

export async function ProjectDetailScreen({ slug }: Props) {
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const statusColor = {
    active: "#4ade80",
    wip: "#f59e0b",
    archived: "var(--ink-4)",
  }[project.status];

  return (
    <PageShell>
      <ProjectViewTracker slug={project.slug} />

      <article className="px-6 md:px-10 lg:px-12 pt-10 pb-16">
        <div className="mb-8">
          <BackLink href="/projects" label="all projects" />
        </div>

        {/* Header */}
        <header className="max-w-[760px] mx-auto text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              color: statusColor,
              border: `1px solid ${statusColor}40`,
              borderRadius: 2,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
            {project.status}
          </div>

          <h1
            className="text-[clamp(2rem,5vw,3rem)] leading-[1.05] tracking-tight mb-5"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {project.title}
          </h1>

          {project.stack.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-7">
              {project.stack.map((tag) => (
                <TagBadge key={tag}>{tag}</TagBadge>
              ))}
            </div>
          )}

          {Object.keys(project.links ?? {}).length > 0 && (
            <div className="flex justify-center">
              <ProjectLinksRow slug={project.slug} links={project.links} />
            </div>
          )}
        </header>

        {/* Cover image */}
        {project.cover_image && (
          <div
            className="relative w-full mb-10 overflow-hidden max-w-[980px] mx-auto"
            style={{ border: "1px dashed var(--border)", borderRadius: 2, aspectRatio: "16/9" }}
          >
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 980px) 100vw, 980px"
              className="object-cover"
            />
          </div>
        )}

        {/* Live data */}
        {project.live_data && project.live_data.length > 0 && (
          <section className="max-w-[860px] mx-auto mb-12">
            <p
              className="text-[10px] tracking-[0.25em] uppercase mb-3"
              style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
            >
              by the numbers
            </p>
            <LiveDataGrid items={project.live_data} />
          </section>
        )}

        {/* Body */}
        <section className="max-w-[720px] mx-auto">
          <MarkdownRenderer content={project.description} />
        </section>
      </article>
    </PageShell>
  );
}
