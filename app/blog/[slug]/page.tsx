import type { Metadata } from "next";
import { getPostBySlug, getAllPostSlugs } from "@/lib/services/hashnode";
import { PostDetailScreen } from "@/features/public/features/blog/screen/post-detail-screen";

export const revalidate = 3600;

export async function generateStaticParams() {
  if (!process.env.HASHNODE_PUBLICATION_HOST) return [];
  try {
    return await getAllPostSlugs();
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!process.env.HASHNODE_PUBLICATION_HOST) return { title: "Post not found" };
  try {
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Post not found" };
    return {
      title: `${post.title} — Feranmi Adeniji`,
      description: post.brief,
      openGraph: {
        title: post.title,
        description: post.brief,
        images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
        type: "article",
        publishedTime: post.published_at,
      },
    };
  } catch {
    return { title: "Post not found" };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostDetailScreen slug={slug} />;
}
