import { getDb } from "@/lib/db";

export async function getPublicStats(): Promise<{
  total_visits: number;
  total_blog_reads: number;
  total_project_interactions: number;
}> {
  const db = await getDb();
  const [visits, reads, interactions] = await Promise.all([
    db.from("page_views").select("*", { count: "exact", head: true }),
    db.from("blog_reads").select("*", { count: "exact", head: true }),
    db.from("project_interactions").select("*", { count: "exact", head: true }),
  ]);

  return {
    total_visits: visits.count ?? 0,
    total_blog_reads: reads.count ?? 0,
    total_project_interactions: interactions.count ?? 0,
  };
}
