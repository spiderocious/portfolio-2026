"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import type { HashnodePost } from "@/lib/services/types";
import { SectionTitle } from "@/features/public/ui/section-title/section-title";
import { SectionLabel } from "@/features/public/ui/section-label/section-label";
import { ScrollReveal } from "@/features/public/ui/scroll-reveal/scroll-reveal";

interface BlogsSectionProps {
  posts: HashnodePost[];
}

export function BlogsSection({ posts }: BlogsSectionProps) {
  console.log("Rendering BlogsSection with posts:", posts);
  return (
    <section className="px-6 md:px-10 lg:px-12 pb-16">
      <SectionTitle label="/blogs" href="/blog" />

      <div className="pt-4 mb-8">
        <SectionLabel>featured writing</SectionLabel>
      </div>

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(posts ?? []).map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 0.06}>
              <BlogCard post={post} />
            </ScrollReveal>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-[13px] tracking-wide"
          style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}
        >
          view all posts
          <motion.span
            className="inline-block"
            initial={false}
            whileHover={{ x: 4 }}
          >
            →
          </motion.span>
        </Link>
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: HashnodePost }) {
  const date = new Date(post.published_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative overflow-hidden h-full"
      style={{
        border: "1px dashed var(--border)",
        borderRadius: 2,
        background: "var(--bg-raised)",
      }}
    >
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        {post.cover_image_url && (
          <div
            className="relative w-full h-44 md:h-48 overflow-hidden"
            style={{ borderBottom: "1px dashed var(--border)" }}
          >
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)",
              }}
            />
          </div>
        )}

        <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
          <div
            className="flex items-center gap-3 text-[12px] tracking-[0.15em] uppercase"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)", fontWeight: 600 }}
          >
            <span>{date}</span>
            <span>·</span>
            <span>{post.read_time_minutes} min read</span>
          </div>

          <h3
            className="text-[19px] md:text-[21px] leading-[1.3] transition-colors"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", fontWeight: 600 }}
          >
            {post.title}
          </h3>

          <p
            className="text-[15px] leading-[1.65] line-clamp-3"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontWeight: 500 }}
          >
            {post.brief}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto pt-2">
              {post.tags.slice(0, 3).map((t) => (
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
        </div>
      </Link>
    </motion.article>
  );
}

function EmptyState() {
  return (
    <div
      className="p-8 text-center border border-dashed"
      style={{
        borderColor: "var(--border)",
        borderRadius: 2,
        fontFamily: "var(--font-mono)",
        color: "var(--ink-4)",
        fontSize: 13,
      }}
    >
      $ cat /blog — no posts published yet.
    </div>
  );
}
