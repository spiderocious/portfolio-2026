"use client";

import { useState, useEffect } from "react";
import { SetTopbarActions } from "../../_components/set-topbar-actions";
import type { AnalyticsRange } from "@/lib/services/types";

type RangeData = {
  total_views: number;
  unique_pages: number;
  project_interactions: number;
  blog_reads: number;
  page_views_over_time: Array<{ date: string; count: number }>;
  top_pages: Array<{ page: string; count: number }>;
  project_stats: Array<{
    project_slug: string;
    views: number;
    link_clicks: number;
    github_clicks: number;
    live_clicks: number;
    total: number;
  }>;
  blog_reads_by_post: Array<{
    post_slug: string;
    post_title: string;
    count: number;
  }>;
  referrers: Array<{ referrer: string; count: number }>;
};

export function AnalyticsClient() {
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [data, setData] = useState<RangeData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchAnalyticsData(range: AnalyticsRange) {
    fetch(`/api/admin/analytics?range=${range}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    fetchAnalyticsData(range);
  }, [range]);

  const rangeLabel =
    range === "7d"
      ? "last 7 days"
      : range === "30d"
        ? "last 30 days"
        : "last 90 days";

  return (
    <>
      <SetTopbarActions>
        <div className="flex items-center gap-1">
          {(["7d", "30d", "90d"] as AnalyticsRange[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={[
                "h-8 px-3.5 font-mono text-[11px] rounded transition-colors duration-150 border cursor-pointer",
                range === r
                  ? "bg-black text-black border-transparent"
                  : "bg-transparent text-[#666] border-[#d0d0d0] hover:border-[#aaa] hover:text-black",
              ].join(" ")}
            >
              {r}
            </button>
          ))}
        </div>
      </SetTopbarActions>

      {loading || !data ? (
        <div className="flex items-center justify-center h-40">
          <p className="font-mono text-[11px] text-[#666]">
            loading analytics...
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "total views", value: data.total_views },
              { label: "unique pages", value: data.unique_pages },
              {
                label: "project interactions",
                value: data.project_interactions,
              },
              { label: "blog reads", value: data.blog_reads },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border border-[#d0d0d0] rounded-md px-5 pt-5 pb-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-black mb-3">
                  {s.label}
                </p>
                <p className="font-mono text-[28px] font-bold text-black leading-none mb-2">
                  {s.value.toLocaleString()}
                </p>
                <p className="font-mono text-[10px] text-[#666]">
                  {rangeLabel}
                </p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white border border-[#d0d0d0] rounded-md p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-black mb-5">
              page views over time
            </p>
            <LineChart data={data.page_views_over_time} height={180} />
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-2 gap-4">
            <DataTable
              title="top pages"
              cols={["page", "views"]}
              rows={data.top_pages
                .slice(0, 10)
                .map((r) => [r.page, r.count.toString()])}
            />
            <DataTable
              title="project interactions"
              cols={["project", "views", "clicks", "github"]}
              rows={data.project_stats
                .slice(0, 10)
                .map((r) => [
                  r.project_slug,
                  r.views.toString(),
                  r.link_clicks.toString(),
                  r.github_clicks.toString(),
                ])}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DataTable
              title="blog reads"
              cols={["post", "reads"]}
              rows={data.blog_reads_by_post
                .slice(0, 10)
                .map((r) => [r.post_title || r.post_slug, r.count.toString()])}
            />
            <DataTable
              title="referrers"
              cols={["source", "visits"]}
              rows={data.referrers
                .slice(0, 10)
                .map((r) => [r.referrer, r.count.toString()])}
            />
          </div>
        </div>
      )}
    </>
  );
}

function LineChart({
  data,
  height,
}: {
  data: Array<{ date: string; count: number }>;
  height: number;
}) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="font-mono text-[11px] text-[#666]">
          no data for this range.
        </p>
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.count));
  const min = 0;
  const w = 100;
  const h = height - 24;

  const points = data.map((d, i) => {
    const x = data.length === 1 ? 50 : (i / (data.length - 1)) * 100;
    const y = max === 0 ? h : h - ((d.count - min) / (max - min)) * h;
    return { x, y, date: d.date, count: d.count };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath = `M${points[0].x},${h} L${points.map((p) => `${p.x},${p.y}`).join(" L")} L${points[points.length - 1].x},${h} Z`;

  const gridLines = [0, 1, 2, 3].map((i) => ({
    y: (h / 3) * i,
    value: Math.round(max - (max / 3) * i),
  }));

  return (
    <div style={{ height }}>
      <svg
        viewBox={`0 0 100 ${h}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: h }}
      >
        {/* Grid lines */}
        {gridLines.map((g) => (
          <line
            key={g.y}
            x1="0"
            y1={g.y}
            x2="100"
            y2={g.y}
            stroke="#e8e8e8"
            strokeWidth="0.3"
          />
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="rgba(74,222,128,0.1)" />

        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke="#4ade80"
          strokeWidth="0.8"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-1 overflow-hidden">
        {[data[0], data[Math.floor(data.length / 2)], data[data.length - 1]]
          .filter(Boolean)
          .map((d) => (
            <span key={d.date} className="font-mono text-[9px] text-[#666]">
              {new Date(d.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </span>
          ))}
      </div>
    </div>
  );
}

function DataTable({
  title,
  cols,
  rows,
}: {
  title: string;
  cols: string[];
  rows: string[][];
}) {
  return (
    <div className="bg-white border border-[#d0d0d0] rounded-md overflow-hidden">
      <div className="h-11 flex items-center px-5 border-b border-[#d0d0d0]">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black">
          {title}
        </span>
      </div>
      {rows.length === 0 ? (
        <div className="flex items-center justify-center h-20">
          <p className="font-mono text-[11px] text-[#888]">no data.</p>
        </div>
      ) : (
        <table className="w-full border-collapse">
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="h-10 border-b border-[#e8e8e8] last:border-b-0 hover:bg-white transition-colors duration-100"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={[
                      "font-mono text-[11px] px-5",
                      j === 0
                        ? "text-black truncate max-w-0"
                        : "text-black text-right font-bold w-20",
                    ].join(" ")}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
