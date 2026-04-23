import Image from "next/image";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import hljs from "highlight.js";
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

  // Sanitize first, then apply syntax highlighting via regex replacement on the HTML string
  const clean = DOMPurify.sanitize(post.content_html, {
    ADD_ATTR: ["target", "rel", "loading"],
  });

  // Replace <pre><code class="language-xxx">...</code></pre> blocks with highlighted versions
  const sanitized = clean.replace(
    /<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
    (_match, attrs: string, raw: string) => {
      // Decode HTML entities so hljs sees plain text
      const text = raw
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      const langMatch = attrs.match(/language-([a-zA-Z0-9_+-]+)/);
      const lang = langMatch?.[1];
      const result =
        lang && hljs.getLanguage(lang)
          ? hljs.highlight(text, { language: lang })
          : hljs.highlightAuto(text);
      const detectedLang = result.language ?? lang ?? "";
      return `<pre><code class="hljs language-${detectedLang}"${attrs}>${result.value}</code></pre>`;
    }
  );
  const date = new Date(post.published_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <PageShell>
      <BlogReadTracker slug={post.slug} title={post.title} />

      <article className="px-5 md:px-8 lg:px-10 pt-10 pb-24">
        <div className="mb-8">
          <BackLink href="/blog" label="all posts" />
        </div>

        {/* Header */}
        <header className="max-w-[720px] mx-auto text-center mb-10">
          <div
            className="flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] uppercase mb-5 font-bold"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
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
                  className="px-2 py-0.5 text-[10px] tracking-wide font-semibold"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "#ffffff",
                    border: "1px solid #ffffff",
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
        <div className="max-w-[720px] mx-auto hashnode-body">
          <div dangerouslySetInnerHTML={{ __html: sanitized }} />
        </div>
      </article>
    </PageShell>
  );
}
