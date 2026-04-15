import { NextRequest, NextResponse } from "next/server";
import {
  getPageViewsOverTime,
  getTopPages,
  getReferrerBreakdown,
  getProjectInteractionStats,
  getBlogReadsByPost,
} from "@/lib/services/analytics";
import type { AnalyticsRange } from "@/lib/services/types";

export async function GET(req: NextRequest) {
  const range = (req.nextUrl.searchParams.get("range") ?? "30d") as AnalyticsRange;

  const [pageViewsOverTime, topPages, referrers, projectStats, blogReads] = await Promise.all([
    getPageViewsOverTime(range),
    getTopPages(range),
    getReferrerBreakdown(range),
    getProjectInteractionStats(range),
    getBlogReadsByPost(range),
  ]);

  const totalViews = pageViewsOverTime.reduce((sum, d) => sum + d.count, 0);
  const uniquePages = new Set(topPages.map((p) => p.page)).size;
  const projectInteractions = projectStats.reduce((sum, p) => sum + p.total, 0);
  const totalBlogReads = blogReads.reduce((sum, p) => sum + p.count, 0);

  return NextResponse.json({
    total_views: totalViews,
    unique_pages: uniquePages,
    project_interactions: projectInteractions,
    blog_reads: totalBlogReads,
    page_views_over_time: pageViewsOverTime,
    top_pages: topPages,
    project_stats: projectStats,
    blog_reads_by_post: blogReads,
    referrers: referrers,
  });
}
