import Link from "next/link";
import { getAllExperiments } from "@/lib/services/experiments";
import type { ExperimentStatus } from "@/lib/services/types";
import { SetTopbarActions } from "../_components/set-topbar-actions";
import { AdminTable, Tr, Td } from "../_components/admin-table";
import { SectionLabel } from "../_components/section-label";
import { StatusBadge } from "../_components/status-badge";
import { ToggleDisplay } from "../_components/toggle-display";
import { StackTags } from "../_components/stack-tags";
import { ExperimentRowActions } from "./_components/row-actions";

const COLS = "1fr 110px 90px 200px 120px 80px";

const statusVariant: Record<ExperimentStatus, "green" | "yellow" | "blue" | "grey"> = {
  live:     "green",
  wip:      "yellow",
  idea:     "blue",
  archived: "grey",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function ExperimentsPage() {
  const experiments = await getAllExperiments();

  return (
    <div className="flex flex-col gap-4">
      <SetTopbarActions>
        <Link
          href="/admin/experiments/new"
          className="h-8 px-4 font-mono text-[11px] font-bold bg-[#4ade80] text-black hover:bg-[#22c55e] transition-colors duration-150 rounded flex items-center"
        >
          new experiment +
        </Link>
      </SetTopbarActions>

      <SectionLabel>all experiments</SectionLabel>

      <AdminTable
        columns={[
          { label: "title" },
          { label: "status" },
          { label: "featured" },
          { label: "stack" },
          { label: "created" },
          { label: "actions", align: "right" },
        ]}
        columnWidths={COLS}
        isEmpty={experiments.length === 0}
        emptyText="no experiments yet. add your first one."
      >
        {experiments.map((exp) => (
          <Tr key={exp.id} columnWidths={COLS}>
            <Td>
              <span className="font-mono text-[12px] font-semibold text-black">{exp.title}</span>
            </Td>
            <Td>
              <StatusBadge label={exp.status} variant={statusVariant[exp.status]} />
            </Td>
            <Td>
              <ToggleDisplay value={exp.featured} />
            </Td>
            <Td>
              <StackTags tags={exp.stack} />
            </Td>
            <Td>
              <span className="font-mono text-[11px] text-[#666]">{formatDate(exp.created_at)}</span>
            </Td>
            <Td align="right">
              <ExperimentRowActions experimentId={exp.id} title={exp.title} />
            </Td>
          </Tr>
        ))}
      </AdminTable>
    </div>
  );
}
