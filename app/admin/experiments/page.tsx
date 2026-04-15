import Link from "next/link";
import { getAllExperiments } from "@/lib/services/experiments";
import type { Experiment, ExperimentStatus } from "@/lib/services/types";
import { SetTopbarActions } from "../_components/set-topbar-actions";
import { ExperimentRowActions } from "./_components/row-actions";

const statusBadge: Record<ExperimentStatus, string> = {
  live:     "bg-[#0e2a1a] border-[#1a5c30] text-a-green",
  wip:      "bg-[#1a1a0e] border-[#5c4a00] text-[#facc15]",
  idea:     "bg-[#0e0e1a] border-[#1a1a5c] text-[#93c5fd]",
  archived: "bg-[#1a1a1a] border-[#2a2a2a] text-a-ink-6",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function ExperimentsPage() {
  const experiments = await getAllExperiments();

  return (
    <>
      <SetTopbarActions>
        <Link
          href="/admin/experiments/new"
          className="h-8 px-3.5 font-mono text-[11px] font-medium bg-a-btn text-a-base hover:bg-a-btn-hov transition-colors duration-150 rounded flex items-center"
        >
          new experiment +
        </Link>
      </SetTopbarActions>

      <div className="mb-3 pb-2 border-b border-a-border-sub">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-a-ink-8">all experiments</p>
      </div>

      <div className="bg-a-card border border-a-border rounded-md overflow-hidden">
        <div className="grid bg-a-surface h-9 border-b border-a-border-sub" style={{ gridTemplateColumns: "1fr 100px 90px 200px 120px 80px" }}>
          {["title", "status", "featured", "stack", "created", "actions"].map((h, i) => (
            <div
              key={h}
              className={[
                "font-mono text-[9px] uppercase tracking-[0.14em] text-a-ink-7 font-medium flex items-center px-4",
                i === 5 ? "justify-end" : "",
              ].join(" ")}
            >
              {h}
            </div>
          ))}
        </div>

        {experiments.length === 0 ? (
          <div className="flex items-center justify-center h-[120px]">
            <p className="font-mono text-[11px] text-a-ink-7">no experiments yet. add your first one.</p>
          </div>
        ) : (
          experiments.map((exp) => (
            <div
              key={exp.id}
              className="grid h-[52px] border-b border-[#191919] last:border-b-0 hover:bg-white/[0.02] transition-colors duration-100 items-center"
              style={{ gridTemplateColumns: "1fr 100px 90px 200px 120px 80px" }}
            >
              <div className="px-4">
                <span className="font-mono text-[12px] text-a-ink-3 font-medium">{exp.title}</span>
              </div>
              <div className="px-4">
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${statusBadge[exp.status]}`}>
                  {exp.status}
                </span>
              </div>
              <div className="px-4">
                <div className={["relative inline-flex items-center rounded-full w-8 h-[18px]", exp.featured ? "bg-a-green" : "bg-a-border-hov"].join(" ")}>
                  <span className={["inline-block w-3.5 h-3.5 rounded-full transition-transform", exp.featured ? "translate-x-4 bg-white" : "translate-x-0.5 bg-a-ink-6"].join(" ")} />
                </div>
              </div>
              <div className="px-4 flex items-center gap-1 overflow-hidden">
                {exp.stack.slice(0, 3).map((tag) => (
                  <span key={tag} className="font-mono text-[10px] text-a-ink-4 bg-[#1a1a1a] border border-[#222] px-1.5 py-0.5 rounded whitespace-nowrap">
                    {tag}
                  </span>
                ))}
                {exp.stack.length > 3 && (
                  <span className="font-mono text-[10px] text-a-ink-7">+{exp.stack.length - 3}</span>
                )}
              </div>
              <div className="px-4">
                <span className="font-mono text-[11px] text-a-ink-6">{formatDate(exp.created_at)}</span>
              </div>
              <div className="px-4">
                <ExperimentRowActions experimentId={exp.id} title={exp.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
