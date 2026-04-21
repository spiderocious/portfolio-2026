import type { Metadata } from "next";
import { getPostBySlug, getAllPostSlugs } from "@/lib/services/hashnode";
import { PostDetailScreen } from "@/features/public/features/blog/screen/post-detail-screen";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLdScript } from "@/lib/seo/json-ld-script";

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
  if (!process.env.HASHNODE_PUBLICATION_HOST) {
    return { title: "Post not found", robots: { index: false, follow: false } };
  }
  try {
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Post not found", robots: { index: false, follow: false } };
    return buildPageMetadata({
      title: post.title,
      description: post.brief,
      path: `/blog/${post.slug}`,
      image: post.cover_image_url ?? null,
      type: "article",
      publishedTime: post.published_at,
      tags: post.tags.map((t) => t.name),
    });
  } catch {
    return { title: "Post not found", robots: { index: false, follow: false } };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post = null;
  if (process.env.HASHNODE_PUBLICATION_HOST) {
    try {
      post = await getPostBySlug(slug);
    } catch {
      post = null;
    }
  }

  const jsonLd = post
    ? [
        buildArticleSchema({
          title: post.title,
          description: post.brief,
          url: `/blog/${post.slug}`,
          image: post.cover_image_url,
          datePublished: post.published_at,
          tags: post.tags.map((t) => t.name),
        }),
        buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]),
      ]
    : null;

  return (
    <>
      {jsonLd && <JsonLdScript data={jsonLd} />}
      <PostDetailScreen slug={slug} />
    </>
  );
}
