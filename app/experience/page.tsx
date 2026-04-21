import type { Metadata } from "next";
import { ExperienceScreen } from "@/features/public/features/experience/screen/experience-screen";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Experience",
  description:
    "Work history and engineering roles of Oluwaferanmi Adeniji — 7+ years across fintech, ecommerce, developer tools, and payment systems.",
  path: "/experience",
  tags: ["experience", "work history", "resume", "engineering roles"],
});

export default function ExperiencePage() {
  return <ExperienceScreen />;
}
