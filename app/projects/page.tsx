import type { Metadata } from "next";
import { ProjectsScreen } from "@/features/public/features/projects/screen/projects-screen";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Projects",
  description:
    "Shipped fintech systems, developer tools, and AI-powered products by Feranmi Adeniji — from 10M-user platforms to open-source libraries.",
  path: "/projects",
  tags: ["projects", "portfolio", "fintech", "developer tools", "open source"],
});

export default function ProjectsPage() {
  return <ProjectsScreen />;
}
