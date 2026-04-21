import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/config";
import { getAllProjectSlugsForBuild } from "@/lib/services/projects";
import { getAllExperimentSlugsForBuild } from "@/lib/services/experiments";
import { getAllPostSlugs } from "@/lib/services/hashnode";

export const revalidate = 3600;

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/experience", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "daily", priority: 0.9 },
  { path: "/experiments", changeFrequency: "weekly", priority: 0.7 },
  { path: "/awards", changeFrequency: "monthly", priority: 0.6 },
  { path: "/board", changeFrequency: "daily", priority: 0.6 },
  { path: "/activity", changeFrequency: "daily", priority: 0.6 },
];

async function safeSlugs<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [projectSlugs, experimentSlugs, blogSlugs] = await Promise.all([
    safeSlugs(getAllProjectSlugsForBuild),
    safeSlugs(getAllExperimentSlugsForBuild),
    process.env.HASHNODE_PUBLICATION_HOST
      ? safeSlugs(getAllPostSlugs)
      : Promise.resolve([] as Array<{ slug: string }>),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const projectEntries: MetadataRoute.Sitemap = projectSlugs.map((p) => ({
    url: absoluteUrl(`/projects/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const experimentEntries: MetadataRoute.Sitemap = experimentSlugs.map((e) => ({
    url: absoluteUrl(`/experiments/${e.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((b) => ({
    url: absoluteUrl(`/blog/${b.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [
    ...staticEntries,
    ...projectEntries,
    ...experimentEntries,
    ...blogEntries,
  ];
}
