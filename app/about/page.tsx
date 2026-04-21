import type { Metadata } from "next";
import { AboutScreen } from "@/features/public/features/about/screen/about-screen";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Oluwaferanmi Adeniji — senior software engineer in Lagos, Nigeria. Bio, technical range, skills, and the journey behind the work.",
  path: "/about",
  tags: ["about", "bio", "skills", "career"],
});

export default function AboutPage() {
  return <AboutScreen />;
}
