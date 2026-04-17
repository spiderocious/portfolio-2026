import type { Metadata } from "next";
import { AboutScreen } from "@/features/public/features/about/screen/about-screen";

export const metadata: Metadata = {
  title: "About — Feranmi Adeniji",
  description: "Who I am, what I do, and how I work.",
};

export default function AboutPage() {
  return <AboutScreen />;
}
