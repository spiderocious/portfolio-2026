import { NextRequest, NextResponse } from "next/server";
import { getActivityFeed } from "@/lib/services/activity";
import type { ActivityType } from "@/lib/services/types";

const VALID_TYPES: ActivityType[] = ["commit", "blog_post", "project_update", "experiment", "note"];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100);
  const typeParam = url.searchParams.get("type");
  const cursor = url.searchParams.get("cursor") ?? undefined;

  const type = typeParam && VALID_TYPES.includes(typeParam as ActivityType)
    ? (typeParam as ActivityType)
    : undefined;

  const data = await getActivityFeed({ limit, type, cursor });
  return NextResponse.json(data);
}
