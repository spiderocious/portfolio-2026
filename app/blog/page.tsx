import type { Metadata } from "next";
import { BlogScreen } from "@/features/public/features/blog/screen/blog-screen";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 1800;

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description:
    "Essays, notes, and write-ups by Feranmi Adeniji — battle-tested coding patterns, JavaScript deep dives, system design, product engineering, and architecture.",
  path: "/blog",
  tags: [
    "blog",
    "software engineering",
    "javascript",
    "system design",
    "product engineering",
    "architecture",
    "hashnode",
  ],
});

export default function BlogPage() {
  return <BlogScreen />;
}
