import type { Metadata } from "next";
import { getProjectBySlug, getAllProjectSlugsForBuild } from "@/lib/services/projects";
import { ProjectDetailScreen } from "@/features/public/features/projects/screen/project-detail-screen";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildProjectSchema, buildBreadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLdScript } from "@/lib/seo/json-ld-script";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllProjectSlugsForBuild();
}

function firstParagraph(md: string): string {
  return (md ?? "")
    .split("\n")
    .find((l) => l.trim() && !l.trim().startsWith("#"))
    ?.replace(/[*_`#>[\]()]/g, "")
    .slice(0, 160) ?? "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found", robots: { index: false, follow: false } };

  const description = firstParagraph(project.description) || project.title;
  return buildPageMetadata({
    title: project.title,
    description,
    path: `/projects/${project.slug}`,
    image: project.cover_image ?? null,
    tags: project.stack ?? [],
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  const jsonLd = project
    ? [
        buildProjectSchema({
          title: project.title,
          description: firstParagraph(project.description),
          url: `/projects/${project.slug}`,
          image: project.cover_image,
          repo: project.links?.github ?? null,
          deployedUrl: project.links?.deployed ?? null,
          datePublished: project.created_at,
          dateModified: project.updated_at,
          programmingLanguage: project.stack,
        }),
        buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
          { name: project.title, url: `/projects/${project.slug}` },
        ]),
      ]
    : null;

  return (
    <>
      {jsonLd && <JsonLdScript data={jsonLd} />}
      <ProjectDetailScreen slug={slug} />
    </>
  );
}
