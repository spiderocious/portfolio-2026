import { getFeaturedProjects } from "@/lib/services/projects";
import { getAllExperience } from "@/lib/services/experience";
import { getPublicStats } from "@/lib/services/stats";
import { getRecentActivity } from "@/lib/services/activity";
import { getBoardItems } from "@/lib/services/board";
import { getPosts } from "@/lib/services/hashnode";
import type { Project, HashnodePost } from "@/lib/services/types";
import { TerminalNav } from "@/features/public/ui/nav/terminal-nav";
import { Footer } from "@/features/public/ui/footer/footer";
import { PageViewTracker } from "@/features/public/shared/utils/page-view-tracker";
import { Hero } from "./parts/hero";
import { ProofOfWork } from "./parts/proof-of-work";
import { ExperienceSection } from "./parts/experience-section";
import { BlogsSection } from "./parts/blogs-section";
import { StatsSection } from "./parts/stats-section";
import { BoardSection } from "./parts/board-section";
import { ContactSection } from "./parts/contact-section";
import type { ProjectCardData } from "./parts/project-card";
import { SectionLabel } from "../../../ui/section-label/section-label";
import { SkillsGrid } from "../../about/screen/parts/skills-grid";

function toCardData(p: Project): ProjectCardData {
  const firstLine =
    (p.description ?? "").split("\n").find((l) => l.trim().length > 0) ?? "";
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.status === "active" ? "Featured Project" : p.status,
    excerpt: firstLine.replace(/^#+\s*/, "").slice(0, 220),
    stack: p.stack ?? [],
    links: {
      deployed: p.links?.deployed ?? null,
      github: p.links?.github ?? null,
    },
    featured: p.featured,
  };
}

async function safeGetPosts(): Promise<HashnodePost[]> {
  if (!process.env.HASHNODE_PUBLICATION_HOST) return [];
  try {
    const { posts } = await getPosts({ first: 4 });
    return posts;
  } catch {
    return [];
  }
}

export async function LandingScreen() {
  const [featured, experience, stats, board, posts] =
    await Promise.all([
      getFeaturedProjects(),
      getAllExperience(),
      getPublicStats(),
      getBoardItems({ includePrivate: false }),
      safeGetPosts(),
    ]);
  console.log("posts", posts);

  const cards = featured.map(toCardData);

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <PageViewTracker />
      {/* Outer dashed frame — sits inset from the viewport edges */}
      <div className="px-4 md:px-8 py-6 md:py-8 flex justify-center items-center">
        <div
          className="mx-auto max-w-400 border border-dashed w-full"
          style={{
            borderColor: "var(--border)",
            borderRadius: 2,
            background: "var(--bg)",
          }}
        >
          <TerminalNav />
          <Hero />
          <ProofOfWork projects={cards} />
          <ExperienceSection experience={experience} />
          {/* <BlogsSection posts={posts} /> */}
          <StatsSection stats={stats} />
          <BoardSection board={board} />
          <section className="px-6 md:px-10 lg:px-12 pb-16">
            <div className="mb-6">
              <SectionLabel>tech stack</SectionLabel>
            </div>
            <SkillsGrid />
          </section>
          <ContactSection />
          <Footer />
        </div>
      </div>
    </main>
  );
}
