import Image from "next/image";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { getPostBySlug } from "@/lib/services/hashnode";
import { PageShell } from "@/features/public/ui/page-shell/page-shell";
import { BackLink } from "@/features/public/ui/back-link/back-link";
import { BlogReadTracker } from "./parts/blog-read-tracker";

export async function PostDetailScreen({ slug }: { slug: string }) {
  if (!process.env.HASHNODE_PUBLICATION_HOST) notFound();

  let post = null;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }
  if (!post) notFound();

  const sanitized = DOMPurify.sanitize(post.content_html, {
    ADD_ATTR: ["target", "rel", "loading"],
  });
  const date = new Date(post.published_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <PageShell>
      <BlogReadTracker slug={post.slug} title={post.title} />

      <article className="px-6 md:px-10 lg:px-12 pt-10 pb-20">
        <div className="mb-8">
          <BackLink href="/blog" label="all posts" />
        </div>

        {/* Header */}
        <header className="max-w-[720px] mx-auto text-center mb-10">
          <div
            className="flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] uppercase mb-5"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-4)" }}
          >
            <span>{date}</span>
            <span>·</span>
            <span>{post.read_time_minutes} min read</span>
          </div>

          <h1
            className="text-[clamp(2rem,5vw,3rem)] leading-[1.08] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {post.tags.map((t) => (
                <span
                  key={t.slug}
                  className="px-2 py-0.5 text-[10px] tracking-wide"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--ink-3)",
                    border: "1px solid var(--border)",
                    borderRadius: 2,
                  }}
                >
                  #{t.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover */}
        {post.cover_image_url && (
          <div
            className="relative w-full mb-12 overflow-hidden max-w-[960px] mx-auto"
            style={{ border: "1px dashed var(--border)", borderRadius: 2, aspectRatio: "16/9" }}
          >
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 960px) 100vw, 960px"
              className="object-cover"
            />
          </div>
        )}

        {/* Body */}
        <div className="max-w-[680px] mx-auto hashnode-body">
          <div dangerouslySetInnerHTML={{ __html: sanitized }} />
        </div>
      </article>
    </PageShell>
  );
}
