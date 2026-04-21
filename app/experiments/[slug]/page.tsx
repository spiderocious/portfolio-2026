import type { Metadata } from "next";
import { getExperimentBySlug, getAllExperimentSlugsForBuild } from "@/lib/services/experiments";
import { ExperimentDetailScreen } from "@/features/public/features/experiments/screen/experiment-detail-screen";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildProjectSchema, buildBreadcrumbSchema } from "@/lib/seo/jsonld";
import { JsonLdScript } from "@/lib/seo/json-ld-script";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllExperimentSlugsForBuild();
}

function firstParagraph(md: string): string {
  return (md ?? "")
    .split("\n")
    .find((l) => l.trim() && !l.trim().startsWith("#"))
    ?.replace(/[*_`#>[\]()]/g, "")
    .slice(0, 160) ?? "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperimentBySlug(slug);
  if (!exp) return { title: "Experiment not found", robots: { index: false, follow: false } };

  const description = firstParagraph(exp.description) || exp.title;
  return buildPageMetadata({
    title: exp.title,
    description,
    path: `/experiments/${exp.slug}`,
    image: exp.cover_image ?? null,
    tags: exp.stack ?? [],
  });
}

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exp = await getExperimentBySlug(slug);

  const jsonLd = exp
    ? [
        buildProjectSchema({
          title: exp.title,
          description: firstParagraph(exp.description),
          url: `/experiments/${exp.slug}`,
          image: exp.cover_image,
          repo: exp.links?.github ?? null,
          deployedUrl: exp.links?.deployed ?? null,
          datePublished: exp.created_at,
          dateModified: exp.updated_at,
          programmingLanguage: exp.stack,
        }),
        buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Experiments", url: "/experiments" },
          { name: exp.title, url: `/experiments/${exp.slug}` },
        ]),
      ]
    : null;

  return (
    <>
      {jsonLd && <JsonLdScript data={jsonLd} />}
      <ExperimentDetailScreen slug={slug} />
    </>
  );
}
