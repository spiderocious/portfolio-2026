import type { Metadata } from "next";
import { getExperimentBySlug, getAllExperiments } from "@/lib/services/experiments";
import { ExperimentDetailScreen } from "@/features/public/features/experiments/screen/experiment-detail-screen";

export const revalidate = 3600;

export async function generateStaticParams() {
  const experiments = await getAllExperiments();
  return experiments.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperimentBySlug(slug);
  if (!exp) return { title: "Experiment not found" };
  const firstLine = (exp.description ?? "").split("\n").find((l) => l.trim())?.slice(0, 160);
  return {
    title: `${exp.title} — Experiments`,
    description: firstLine,
    openGraph: {
      title: exp.title,
      description: firstLine,
      images: exp.cover_image ? [{ url: exp.cover_image }] : undefined,
    },
  };
}

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ExperimentDetailScreen slug={slug} />;
}
