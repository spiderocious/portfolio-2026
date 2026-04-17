import Image from "next/image";
import { notFound } from "next/navigation";
import { getExperimentBySlug } from "@/lib/services/experiments";
import { PageShell } from "@/features/public/ui/page-shell/page-shell";
import { BackLink } from "@/features/public/ui/back-link/back-link";
import { TagBadge } from "@/features/public/ui/tag-badge/tag-badge";
import { MarkdownRenderer } from "@/features/public/ui/markdown-renderer/markdown-renderer";

const STATUS_COLORS: Record<string, string> = {
  live: "#4ade80",
  wip: "#f59e0b",
  idea: "#c084fc",
  archived: "var(--ink-4)",
};

export async function ExperimentDetailScreen({ slug }: { slug: string }) {
  const experiment = await getExperimentBySlug(slug);
  if (!experiment) notFound();

  const color = STATUS_COLORS[experiment.status] ?? "var(--ink-3)";
  const links = Object.entries(experiment.links ?? {}).filter(([, v]) => !!v) as [string, string][];

  return (
    <PageShell>
      <article className="px-6 md:px-10 lg:px-12 pt-10 pb-16">
        <div className="mb-8">
          <BackLink href="/experiments" label="all experiments" />
        </div>

        <header className="max-w-[720px] mx-auto text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              color,
              border: `1px solid ${color}40`,
              borderRadius: 2,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            {experiment.status}
          </div>

          <h1
            className="text-[clamp(1.75rem,4.5vw,2.5rem)] leading-[1.1] tracking-tight mb-5"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {experiment.title}
          </h1>

          {experiment.stack.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {experiment.stack.map((tag) => (
                <TagBadge key={tag}>{tag}</TagBadge>
              ))}
            </div>
          )}

          {links.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {links.map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 px-3 py-2 text-[12px] tracking-wide transition-colors hover:text-[var(--ink)]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--ink-2)",
                    background: "var(--bg-raised)",
                    border: "1px dashed var(--border)",
                    borderRadius: 2,
                  }}
                >
                  {key} ↗
                </a>
              ))}
            </div>
          )}
        </header>

        {experiment.cover_image && (
          <div
            className="relative w-full mb-10 overflow-hidden max-w-[960px] mx-auto"
            style={{ border: "1px dashed var(--border)", borderRadius: 2, aspectRatio: "16/9" }}
          >
            <Image
              src={experiment.cover_image}
              alt={experiment.title}
              fill
              priority
              sizes="(max-width: 960px) 100vw, 960px"
              className="object-cover"
            />
          </div>
        )}

        <section className="max-w-[680px] mx-auto">
          <MarkdownRenderer content={experiment.description} />
        </section>
      </article>
    </PageShell>
  );
}
