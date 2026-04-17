import type { Metadata } from "next";
import { getProjectBySlug, getAllProjectSlugsForBuild } from "@/lib/services/projects";
import { ProjectDetailScreen } from "@/features/public/features/projects/screen/project-detail-screen";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllProjectSlugsForBuild();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  const firstLine = (project.description ?? "").split("\n").find((l) => l.trim())?.slice(0, 160);
  return {
    title: `${project.title} — Feranmi Adeniji`,
    description: firstLine,
    openGraph: {
      title: project.title,
      description: firstLine,
      images: project.cover_image ? [{ url: project.cover_image }] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProjectDetailScreen slug={slug} />;
}
