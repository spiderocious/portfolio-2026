import type { Metadata } from "next";
import { ExperimentsScreen } from "@/features/public/features/experiments/screen/experiments-screen";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Experiments",
  description:
    "Side projects, open-source tinkering, and playful builds by Feranmi Adeniji — the playground behind the portfolio.",
  path: "/experiments",
  tags: ["experiments", "side projects", "open source", "tinkering"],
});

export default function ExperimentsPage() {
  return <ExperimentsScreen />;
}
