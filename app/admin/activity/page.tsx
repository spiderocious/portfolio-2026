import { getActivityFeed } from "@/lib/services/activity";
import { ActivityPageClient } from "./_components/activity-client";

export default async function ActivityPage() {
  const result = await getActivityFeed({ limit: 100 });

  return <ActivityPageClient initialItems={result.items} totalCount={result.items.length} />;
}
