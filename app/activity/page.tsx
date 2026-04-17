import type { Metadata } from "next";
import { ActivityScreen } from "@/features/public/features/activity/screen/activity-screen";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Activity — Feranmi Adeniji",
  description: "Live feed of commits, posts, and project updates.",
};

export default function ActivityPage() {
  return <ActivityScreen />;
}
