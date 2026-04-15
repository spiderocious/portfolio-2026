import { getDb } from "@/lib/db";
import type { AnalyticsRange, DashboardStats, PageView, VoidResult } from "./types";

function rangeStart(range: AnalyticsRange): string {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

// ─── Write (called from public API routes) ────────────────────────────────────

export async function logPageView(data: {
  page: string;
  referrer?: string;
  user_agent?: string;
  country?: string;
}): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db.from("page_views").insert({
    page: data.page,
    referrer: data.referrer ?? null,
    user_agent: data.user_agent ?? null,
    country: data.country ?? null,
  });
  return error ? { error: error.message } : { error: null };
}

export async function logProjectInteraction(data: {
  project_slug: string;
  interaction_type: "view" | "link_click" | "github_click" | "live_click";
}): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db.from("project_interactions").insert({
    project_slug: data.project_slug,
    interaction_type: data.interaction_type,
  });
  return error ? { error: error.message } : { error: null };
}

export async function logBlogRead(data: {
  post_slug: string;
  post_title: string;
}): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db.from("blog_reads").insert({
    post_slug: data.post_slug,
    post_title: data.post_title,
  });
  return error ? { error: error.message } : { error: null };
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getTotalVisits(): Promise<{ count: number }> {
  const db = await getDb();
  const { count } = await db
    .from("page_views")
    .select("*", { count: "exact", head: true });
  return { count: count ?? 0 };
}

export async function getTotalBlogReads(): Promise<{ count: number }> {
  const db = await getDb();
  const { count } = await db
    .from("blog_reads")
    .select("*", { count: "exact", head: true });
  return { count: count ?? 0 };
}

export async function getTotalProjectInteractions(): Promise<{ count: number }> {
  const db = await getDb();
  const { count } = await db
    .from("project_interactions")
    .select("*", { count: "exact", head: true });
  return { count: count ?? 0 };
}

export async function getRecentPageViews(limit: number): Promise<PageView[]> {
  const db = await getDb();
  const { data } = await db
    .from("page_views")
    .select("id, page, referrer, user_agent, country, visited_at")
    .order("visited_at", { ascending: false })
    .limit(limit);
  return (data as unknown as PageView[]) ?? [];
}

export async function getPageViewsOverTime(
  range: AnalyticsRange
): Promise<Array<{ date: string; count: number }>> {
  const db = await getDb();
  const { data } = await db
    .from("page_views")
    .select("visited_at")
    .gte("visited_at", rangeStart(range))
    .order("visited_at", { ascending: true });

  if (!data) return [];

  const buckets: Record<string, number> = {};
  for (const row of data) {
    const date = (row.visited_at as string).slice(0, 10);
    buckets[date] = (buckets[date] ?? 0) + 1;
  }

  return Object.entries(buckets)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getTopPages(
  range?: AnalyticsRange
): Promise<Array<{ page: string; count: number }>> {
  const db = await getDb();
  let query = db.from("page_views").select("page");
  if (range) query = query.gte("visited_at", rangeStart(range));

  const { data } = await query;
  if (!data) return [];

  const counts: Record<string, number> = {};
  for (const row of data) counts[row.page] = (counts[row.page] ?? 0) + 1;

  return Object.entries(counts)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getReferrerBreakdown(
  range?: AnalyticsRange
): Promise<Array<{ referrer: string; count: number }>> {
  const db = await getDb();
  let query = db.from("page_views").select("referrer");
  if (range) query = query.gte("visited_at", rangeStart(range));

  const { data } = await query;
  if (!data) return [];

  const counts: Record<string, number> = {};
  for (const row of data) {
    const ref = row.referrer || "direct";
    counts[ref] = (counts[ref] ?? 0) + 1;
  }

  return Object.entries(counts)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getProjectInteractionStats(range?: AnalyticsRange): Promise<
  Array<{
    project_slug: string;
    views: number;
    link_clicks: number;
    github_clicks: number;
    live_clicks: number;
    total: number;
  }>
> {
  const db = await getDb();
  let query = db
    .from("project_interactions")
    .select("project_slug, interaction_type");
  if (range) query = query.gte("interacted_at", rangeStart(range));

  const { data } = await query;
  if (!data) return [];

  const map: Record<
    string,
    { views: number; link_clicks: number; github_clicks: number; live_clicks: number }
  > = {};

  for (const row of data) {
    if (!map[row.project_slug]) {
      map[row.project_slug] = { views: 0, link_clicks: 0, github_clicks: 0, live_clicks: 0 };
    }
    const e = map[row.project_slug];
    if (row.interaction_type === "view") e.views++;
    else if (row.interaction_type === "link_click") e.link_clicks++;
    else if (row.interaction_type === "github_click") e.github_clicks++;
    else if (row.interaction_type === "live_click") e.live_clicks++;
  }

  return Object.entries(map)
    .map(([project_slug, c]) => ({
      project_slug,
      ...c,
      total: c.views + c.link_clicks + c.github_clicks + c.live_clicks,
    }))
    .sort((a, b) => b.total - a.total);
}

export async function getBlogReadsByPost(
  range?: AnalyticsRange
): Promise<Array<{ post_slug: string; post_title: string; count: number }>> {
  const db = await getDb();
  let query = db.from("blog_reads").select("post_slug, post_title");
  if (range) query = query.gte("read_at", rangeStart(range));

  const { data } = await query;
  if (!data) return [];

  const map: Record<string, { post_title: string; count: number }> = {};
  for (const row of data) {
    if (!map[row.post_slug]) map[row.post_slug] = { post_title: row.post_title, count: 0 };
    map[row.post_slug].count++;
  }

  return Object.entries(map)
    .map(([post_slug, { post_title, count }]) => ({ post_slug, post_title, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await getDb();
  const [visits, reads, interactions, chats, projects, experience, experiments, awards, boardItems, contextEntries, activity] = await Promise.all([
    db.from("page_views").select("*", { count: "exact", head: true }),
    db.from("blog_reads").select("*", { count: "exact", head: true }),
    db.from("project_interactions").select("*", { count: "exact", head: true }),
    db.from("llm_conversations").select("*", { count: "exact", head: true }),
    db.from("projects").select("*", { count: "exact", head: true }),
    db.from("experience").select("*", { count: "exact", head: true }),
    db.from("experiments").select("*", { count: "exact", head: true }),
    db.from("awards").select("*", { count: "exact", head: true }),
    db.from("board_items").select("*", { count: "exact", head: true }),
    db.from("system_convos").select("*", { count: "exact", head: true }),
    db.from("activity_feed").select("*", { count: "exact", head: true }),
  ]);

  return {
    total_visits: visits.count ?? 0,
    total_blog_reads: reads.count ?? 0,
    total_project_interactions: interactions.count ?? 0,
    total_conversations: chats.count ?? 0,
    project_count: projects.count ?? 0,
    experience_count: experience.count ?? 0,
    experiment_count: experiments.count ?? 0,
    award_count: awards.count ?? 0,
    board_item_count: boardItems.count ?? 0,
    context_entry_count: contextEntries.count ?? 0,
    activity_count: activity.count ?? 0,
  };
}
