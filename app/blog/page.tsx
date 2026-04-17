import type { Metadata } from "next";
import { BlogScreen } from "@/features/public/features/blog/screen/blog-screen";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Blog — Feranmi Adeniji",
  description: "Essays and notes on fintech, dev tools, and AI.",
};

export default function BlogPage() {
  return <BlogScreen />;
}
