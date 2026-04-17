"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import type { HashnodePost } from "@/lib/services/types";

export function BlogListCard({ post, index }: { post: HashnodePost; index: number }) {
  const date = new Date(post.published_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
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
            className="relative w-full h-48 md:h-56 overflow-hidden"
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
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
              }}
            />
          </div>
        )}

        <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
          <div
            className="flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)", fontWeight: 600 }}
          >
            <span>{date}</span>
            <span>·</span>
            <span>{post.read_time_minutes} min read</span>
          </div>

          <h3
            className="text-[20px] md:text-[22px] leading-[1.3]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", fontWeight: 600 }}
          >
            {post.title}
          </h3>

          <p
            className="text-[15px] md:text-[16px] leading-[1.7] line-clamp-3"
            style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", fontWeight: 500 }}
          >
            {post.brief}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto pt-2">
              {post.tags.slice(0, 4).map((t) => (
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
