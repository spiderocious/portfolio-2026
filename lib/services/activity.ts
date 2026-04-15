import { getDb } from "@/lib/db";
import type { ActivityEntry, ActivityType, CreateActivityInput, VoidResult } from "./types";

const FIELDS = "id, type, title, description, url, metadata, created_at";

export async function getActivityFeed(options: {
  limit?: number;
  type?: ActivityType;
  cursor?: string;
} = {}): Promise<{ items: ActivityEntry[]; has_more: boolean }> {
  const db = await getDb();
  const limit = options.limit ?? 20;

  let query = db
    .from("activity_feed")
    .select(FIELDS)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (options.type) query = query.eq("type", options.type);
  if (options.cursor) query = query.lt("created_at", options.cursor);

  const { data } = await query;
  const rows = (data ?? []) as unknown as ActivityEntry[];
  const has_more = rows.length > limit;

  return { items: has_more ? rows.slice(0, limit) : rows, has_more };
}

export async function getRecentActivity(limit: number): Promise<ActivityEntry[]> {
  const db = await getDb();
  const { data } = await db
    .from("activity_feed")
    .select(FIELDS)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as unknown as ActivityEntry[]) ?? [];
}

export async function getLiveworks(): Promise<ActivityEntry[]> {
  const db = await getDb();
  const { data } = await db
    .from("activity_feed")
    .select(FIELDS)
    .in("type", ["commit", "project_update"])
    .order("created_at", { ascending: false })
    .limit(2);
  return (data as unknown as ActivityEntry[]) ?? [];
}

export async function createActivityEntry(
  input: CreateActivityInput
): Promise<{ id: string } | { error: string }> {
  const db = await getDb();
  const { data, error } = await db
    .from("activity_feed")
    .insert({
      type: input.type,
      title: input.title,
      description: input.description ?? null,
      url: input.url ?? null,
      metadata: input.metadata ?? null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: (data as unknown as { id: string }).id };
}

export async function deleteActivityEntry(id: string): Promise<VoidResult> {
  const db = await getDb();
  const { error } = await db.from("activity_feed").delete().eq("id", id);
  return error ? { error: error.message } : { error: null };
}

export async function logGithubCommit(payload: {
  ref: string;
  repository: { name: string; full_name: string };
  commits: Array<{ id: string; message: string; author: { name: string } }>;
}): Promise<{ id: string } | { error: string }> {
  const commit = payload.commits[0];
  if (!commit) return { error: "no commits in payload" };

  const branch = payload.ref.replace("refs/heads/", "");
  const title = commit.message.split("\n")[0].slice(0, 200);

  return createActivityEntry({
    type: "commit",
    title,
    url: `https://github.com/${payload.repository.full_name}/commit/${commit.id}`,
    metadata: {
      repo: payload.repository.full_name,
      branch,
      sha: commit.id,
      message: commit.message,
    },
  });
}
