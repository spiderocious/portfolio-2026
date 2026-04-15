import Link from "next/link";
import { getAllExperience } from "@/lib/services/experience";
import type { Experience } from "@/lib/services/types";
import { SetTopbarActions } from "../_components/set-topbar-actions";
import { ExperienceRowActions } from "./_components/row-actions";

function formatDateRange(startDate: string, endDate: string | null) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  return `${fmt(startDate)} — ${endDate ? fmt(endDate) : "present"}`;
}

export default async function ExperiencePage() {
  const entries = await getAllExperience();

  return (
    <>
      <SetTopbarActions>
        <Link
          href="/admin/experience/new"
          className="h-8 px-3.5 font-mono text-[11px] font-medium bg-a-btn text-a-base hover:bg-a-btn-hov transition-colors duration-150 rounded flex items-center"
        >
          new entry +
        </Link>
      </SetTopbarActions>

      <div className="mb-3 pb-2 border-b border-a-border-sub">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-a-ink-8">all experience</p>
      </div>

      <div className="bg-a-card border border-a-border rounded-md overflow-hidden">
        <div className="grid bg-a-surface h-9 border-b border-a-border-sub" style={{ gridTemplateColumns: "1fr 160px 160px 120px 80px" }}>
          {["role", "company", "dates", "location", "actions"].map((h, i) => (
            <div
              key={h}
              className={[
                "font-mono text-[9px] uppercase tracking-[0.14em] text-a-ink-7 font-medium flex items-center px-4",
                i === 4 ? "justify-end" : "",
              ].join(" ")}
            >
              {h}
            </div>
          ))}
        </div>

        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-[120px]">
            <p className="font-mono text-[11px] text-a-ink-7">no experience entries yet.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="grid h-[52px] border-b border-[#191919] last:border-b-0 hover:bg-white/[0.02] transition-colors duration-100 items-center"
              style={{ gridTemplateColumns: "1fr 160px 160px 120px 80px" }}
            >
              <div className="px-4">
                <span className="font-mono text-[12px] text-a-ink-3">{entry.role}</span>
              </div>
              <div className="px-4">
                <span className="font-mono text-[11px] text-a-ink-4">{entry.company}</span>
              </div>
              <div className="px-4">
                <span className="font-mono text-[11px] text-a-ink-6">{formatDateRange(entry.start_date, entry.end_date)}</span>
              </div>
              <div className="px-4">
                <span className="font-mono text-[10px] text-a-ink-7">{entry.location ?? "—"}</span>
              </div>
              <div className="px-4">
                <ExperienceRowActions entryId={entry.id} role={entry.role} />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
