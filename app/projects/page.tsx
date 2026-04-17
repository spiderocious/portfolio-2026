import type { Metadata } from "next";
import { ProjectsScreen } from "@/features/public/features/projects/screen/projects-screen";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects — Feranmi Adeniji",
  description: "Fintech systems, dev tools, AI-powered products.",
};

export default function ProjectsPage() {
  return <ProjectsScreen />;
}
