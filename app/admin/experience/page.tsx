import Link from "next/link";
import { getAllExperience } from "@/lib/services/experience";
import { SetTopbarActions } from "../_components/set-topbar-actions";
import { AdminTable, Tr, Td } from "../_components/admin-table";
import { SectionLabel } from "../_components/section-label";
import { ExperienceRowActions } from "./_components/row-actions";

const COLS = "1fr 160px 180px 120px 80px";

function formatDateRange(start: string, end: string | null) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  return `${fmt(start)} — ${end ? fmt(end) : "present"}`;
}

export default async function ExperiencePage() {
  const entries = await getAllExperience();

  return (
    <div className="flex flex-col gap-4">
      <SetTopbarActions>
        <Link
          href="/admin/experience/new"
          className="h-8 px-4 font-mono text-[11px] font-bold bg-[#4ade80] text-black hover:bg-[#22c55e] transition-colors duration-150 rounded flex items-center"
        >
          new entry +
        </Link>
      </SetTopbarActions>

      <SectionLabel>all experience</SectionLabel>

      <AdminTable
        columns={[
          { label: "role" },
          { label: "company" },
          { label: "dates" },
          { label: "location" },
          { label: "actions", align: "right" },
        ]}
        columnWidths={COLS}
        isEmpty={entries.length === 0}
        emptyText="no experience entries yet."
      >
        {entries.map((entry) => (
          <Tr key={entry.id} columnWidths={COLS}>
            <Td>
              <span className="font-mono text-[12px] font-semibold text-black">{entry.role}</span>
            </Td>
            <Td>
              <span className="font-mono text-[11px] font-medium text-black">{entry.company}</span>
            </Td>
            <Td>
              <span className="font-mono text-[11px] text-[#666]">{formatDateRange(entry.start_date, entry.end_date)}</span>
            </Td>
            <Td>
              <span className="font-mono text-[11px] text-[#666]">{entry.location ?? "—"}</span>
            </Td>
            <Td align="right">
              <ExperienceRowActions entryId={entry.id} role={entry.role} />
            </Td>
          </Tr>
        ))}
      </AdminTable>
    </div>
  );
}
