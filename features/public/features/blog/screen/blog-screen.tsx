import { getPosts } from "@/lib/services/hashnode";
import type { HashnodePost } from "@/lib/services/types";
import { PageShell } from "@/features/public/ui/page-shell/page-shell";
import { PageHeader } from "@/features/public/ui/page-header/page-header";
import { PageViewTracker } from "@/features/public/shared/utils/page-view-tracker";
import { EmptyState } from "@/features/public/ui/empty-state/empty-state";
import { BlogGrid } from "./parts/blog-grid";

async function safeGetPosts(): Promise<HashnodePost[]> {
  if (!process.env.HASHNODE_PUBLICATION_HOST) return [];
  try {
    const { posts } = await getPosts({ first: 50 });
    return posts;
  } catch {
    return [];
  }
}

export async function BlogScreen() {
  const posts = await safeGetPosts();

  return (
    <PageShell>
      <PageViewTracker />
      <PageHeader
        path="/blog"
        title="blog"
        subtitle="essays, notes, and write-ups. Battle-tested Coding patterns, Javascript wizardry, System Design, Product Engineering and Management, and architectural secrets."
        count={posts.length}
        countLabel={posts.length === 1 ? "post" : "posts"}
      />

      {posts.length === 0 ? (
        <div className="px-6 md:px-10 lg:px-12 py-12">
          <EmptyState>$ blog not configured yet — check back soon.</EmptyState>
        </div>
      ) : (
        <BlogGrid posts={posts} />
      )}
    </PageShell>
  );
}
