import type { Metadata } from "next";
import { ExperienceScreen } from "@/features/public/features/experience/screen/experience-screen";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Experience — Feranmi Adeniji",
  description: "Work history and roles.",
};

export default function ExperiencePage() {
  return <ExperienceScreen />;
}
