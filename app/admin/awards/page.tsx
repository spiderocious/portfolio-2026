import Link from "next/link";
import { getAllAwards } from "@/lib/services/awards";
import { SetTopbarActions } from "../_components/set-topbar-actions";
import { AwardRowActions } from "./_components/row-actions";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default async function AwardsPage() {
  const awards = await getAllAwards();

  return (
    <>
      <SetTopbarActions>
        <Link
          href="/admin/awards/new"
          className="h-8 px-3.5 font-mono text-[11px] font-medium bg-a-btn text-a-base hover:bg-a-btn-hov transition-colors duration-150 rounded flex items-center"
        >
          new award +
        </Link>
      </SetTopbarActions>

      <div className="mb-3 pb-2 border-b border-a-border-sub">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-a-ink-8">all awards</p>
      </div>

      <div className="bg-a-card border border-a-border rounded-md overflow-hidden">
        <div className="grid bg-a-surface h-9 border-b border-a-border-sub" style={{ gridTemplateColumns: "1fr 180px 100px 80px" }}>
          {["title", "issuer", "date", "actions"].map((h, i) => (
            <div
              key={h}
              className={[
                "font-mono text-[9px] uppercase tracking-[0.14em] text-a-ink-7 font-medium flex items-center px-4",
                i === 3 ? "justify-end" : "",
              ].join(" ")}
            >
              {h}
            </div>
          ))}
        </div>

        {awards.length === 0 ? (
          <div className="flex items-center justify-center h-[120px]">
            <p className="font-mono text-[11px] text-a-ink-7">no awards yet.</p>
          </div>
        ) : (
          awards.map((award) => (
            <div
              key={award.id}
              className="grid h-12 border-b border-[#191919] last:border-b-0 hover:bg-white/[0.02] transition-colors duration-100 items-center"
              style={{ gridTemplateColumns: "1fr 180px 100px 80px" }}
            >
              <div className="px-4">
                <span className="font-mono text-[12px] text-a-ink-3 font-medium">{award.title}</span>
              </div>
              <div className="px-4">
                <span className="font-mono text-[11px] text-a-ink-4">{award.issuer}</span>
              </div>
              <div className="px-4">
                <span className="font-mono text-[11px] text-a-ink-6">{formatDate(award.date)}</span>
              </div>
              <div className="px-4">
                <AwardRowActions awardId={award.id} title={award.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
