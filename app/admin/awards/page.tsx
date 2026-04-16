import Link from "next/link";
import { getAllAwards } from "@/lib/services/awards";
import { SetTopbarActions } from "../_components/set-topbar-actions";
import { AdminTable, Tr, Td } from "../_components/admin-table";
import { SectionLabel } from "../_components/section-label";
import { AwardRowActions } from "./_components/row-actions";

const COLS = "1fr 200px 110px 80px";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default async function AwardsPage() {
  const awards = await getAllAwards();

  return (
    <div className="flex flex-col gap-4">
      <SetTopbarActions>
        <Link
          href="/admin/awards/new"
          className="h-8 px-4 font-mono text-[11px] font-bold bg-[#4ade80] text-black hover:bg-[#22c55e] transition-colors duration-150 rounded flex items-center"
        >
          new award +
        </Link>
      </SetTopbarActions>

      <SectionLabel>all awards</SectionLabel>

      <AdminTable
        columns={[
          { label: "title" },
          { label: "issuer" },
          { label: "date" },
          { label: "actions", align: "right" },
        ]}
        columnWidths={COLS}
        isEmpty={awards.length === 0}
        emptyText="no awards yet."
      >
        {awards.map((award) => (
          <Tr key={award.id} columnWidths={COLS} height="h-[52px]">
            <Td>
              <span className="font-mono text-[12px] font-semibold text-black">{award.title}</span>
            </Td>
            <Td>
              <span className="font-mono text-[11px] font-medium text-black">{award.issuer}</span>
            </Td>
            <Td>
              <span className="font-mono text-[11px] text-[#666]">{formatDate(award.date)}</span>
            </Td>
            <Td align="right">
              <AwardRowActions awardId={award.id} title={award.title} />
            </Td>
          </Tr>
        ))}
      </AdminTable>
    </div>
  );
}
