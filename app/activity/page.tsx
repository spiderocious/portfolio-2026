import type { Metadata } from "next";
import { ActivityScreen } from "@/features/public/features/activity/screen/activity-screen";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Activity",
  description:
    "Live activity stream — commits, blog posts, project updates, and experiments from Feranmi Adeniji.",
  path: "/activity",
  tags: ["activity", "live feed", "commits", "updates"],
});

export default function ActivityPage() {
  return <ActivityScreen />;
}
