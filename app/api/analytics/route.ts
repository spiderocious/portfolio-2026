import { NextRequest, NextResponse } from "next/server";
import { logPageView, logProjectInteraction, logBlogRead } from "@/lib/services/analytics";

export { corsPreflight as OPTIONS } from "@/lib/api/cors";

type Body =
  | { type: "page_view"; page: string; referrer?: string | null; user_agent?: string | null }
  | {
      type: "project_interaction";
      project_slug: string;
      interaction_type: "view" | "link_click" | "github_click" | "live_click";
    }
  | { type: "blog_read"; post_slug: string; post_title: string };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    if (body.type === "page_view") {
      const country = req.headers.get("x-vercel-ip-country") || undefined;
      await logPageView({
        page: body.page,
        referrer: body.referrer ?? undefined,
        user_agent: body.user_agent ?? undefined,
        country,
      });
      return NextResponse.json({ ok: true });
    }

    if (body.type === "project_interaction") {
      await logProjectInteraction({
        project_slug: body.project_slug,
        interaction_type: body.interaction_type,
      });
      return NextResponse.json({ ok: true });
    }

    if (body.type === "blog_read") {
      await logBlogRead({ post_slug: body.post_slug, post_title: body.post_title });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "unknown type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
}
