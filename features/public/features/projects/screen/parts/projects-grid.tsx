"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/lib/services/types";
import { ProjectCard, type ProjectCardData } from "@/features/public/features/landing/screen/parts/project-card";
import { EmptyState } from "@/features/public/ui/empty-state/empty-state";
import { StackFilter } from "./stack-filter";

interface ProjectsGridProps {
  projects: Project[];
}

function toCardData(p: Project): ProjectCardData {
  const firstLine = (p.description ?? "").split("\n").find((l) => l.trim().length > 0) ?? "";
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.featured ? "Featured Project" : p.status,
    excerpt: firstLine.replace(/^#+\s*/, "").slice(0, 240),
    stack: p.stack ?? [],
    links: {
      deployed: p.links?.deployed ?? null,
      github: p.links?.github ?? null,
    },
    featured: p.featured,
  };
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [active, setActive] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) for (const t of p.stack ?? []) set.add(t);
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    if (!active) return projects;
    return projects.filter((p) => (p.stack ?? []).includes(active));
  }, [projects, active]);

  return (
    <div className="px-6 md:px-10 lg:px-12 py-10">
      <div className="mb-8">
        <StackFilter tags={allTags} active={active} onChange={setActive} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState>$ no projects match — try another filter.</EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <ProjectCard project={toCardData(p)} index={0} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
