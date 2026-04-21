import type { Metadata } from "next";
import { AwardsScreen } from "@/features/public/features/awards/screen/awards-screen";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Awards",
  description: "Recognition, honours, and achievements earned by Feranmi Adeniji across fintech and software engineering work.",
  path: "/awards",
  tags: ["awards", "recognition", "achievements"],
});

export default function AwardsPage() {
  return <AwardsScreen />;
}
