"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Experiment, ExperimentStatus } from "@/lib/services/types";
import { EmptyState } from "@/features/public/ui/empty-state/empty-state";
import { ExperimentCard } from "./experiment-card";

const STATUSES: Array<{ value: ExperimentStatus | "all"; label: string }> = [
  { value: "all", label: "all" },
  { value: "live", label: "live" },
  { value: "wip", label: "wip" },
  { value: "idea", label: "idea" },
  { value: "archived", label: "archived" },
];

export function ExperimentsGrid({ experiments }: { experiments: Experiment[] }) {
  const [filter, setFilter] = useState<ExperimentStatus | "all">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return experiments;
    return experiments.filter((e) => e.status === filter);
  }, [experiments, filter]);

  return (
    <div className="px-6 md:px-10 lg:px-12 py-10">
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1">
        {STATUSES.map((s) => (
          <motion.button
            key={s.value}
            type="button"
            onClick={() => setFilter(s.value)}
            whileTap={{ scale: 0.96 }}
            className="px-3.5 py-2 text-[13px] tracking-wide whitespace-nowrap shrink-0 cursor-pointer"
            style={{
              fontFamily: "var(--font-mono)",
              color: filter === s.value ? "var(--bg)" : "var(--ink)",
              fontWeight: filter === s.value ? 600 : 500,
              background: filter === s.value ? "var(--ink)" : "transparent",
              border: `1px dashed ${filter === s.value ? "var(--ink)" : "var(--border)"}`,
              borderRadius: 2,
            }}
          >
            {s.label}
          </motion.button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState>$ no experiments in this bucket yet.</EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((exp, i) => (
              <motion.div
                key={exp.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ExperimentCard experiment={exp} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
