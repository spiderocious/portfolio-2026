import Link from "next/link";
import {
  getDashboardStats,
  getRecentPageViews,
} from "@/lib/services/analytics";
import { getRecentActivity } from "@/lib/services/activity";
import { StatCard } from "../_components/stat-card";
import {
  AdminCard,
  CardHeader,
  CardTitle,
  CardBadge,
} from "../_components/admin-card";
import { SectionLabel } from "../_components/section-label";

type ActivityType =
  | "commit"
  | "blog_post"
  | "project_update"
  | "experiment"
  | "note";

const activityDot: Record<ActivityType, string> = {
  commit: "bg-[#4ade80]",
  blog_post: "bg-[#2563eb]",
  project_update: "bg-[#7c3aed]",
  experiment: "bg-[#ea580c]",
  note: "bg-[#aaa]",
};

export default async function DashboardPage() {
  const [stats, pageViews, activity] = await Promise.all([
    getDashboardStats(),
    getRecentPageViews(50),
    getRecentActivity(10),
  ]);

  const statCards = [
    {
      label: "total visits",
      value: stats.total_visits.toLocaleString(),
      sub: "all time",
    },
    {
      label: "blog reads",
      value: stats.total_blog_reads.toLocaleString(),
      sub: "all time",
    },
    {
      label: "project interactions",
      value: stats.total_project_interactions.toLocaleString(),
      sub: "all time",
    },
    {
      label: "active chats",
      value: stats.total_conversations.toLocaleString(),
      sub: "stored",
    },
  ];

  const quickNav = [
    {
      label: "projects",
      sub: `${stats.project_count} projects`,
      route: "/admin/projects",
    },
    {
      label: "experience",
      sub: `${stats.experience_count} entries`,
      route: "/admin/experience",
    },
    {
      label: "experiments",
      sub: `${stats.experiment_count} items`,
      route: "/admin/experiments",
    },
    {
      label: "awards",
      sub: `${stats.award_count} awards`,
      route: "/admin/awards",
    },
    {
      label: "board",
      sub: `${stats.board_item_count} items`,
      route: "/admin/board",
    },
    { label: "analytics", sub: "page views", route: "/admin/analytics" },
    {
      label: "chats",
      sub: `${stats.total_conversations} sessions`,
      route: "/admin/chats",
    },
    {
      label: "system context",
      sub: `${stats.context_entry_count} entries`,
      route: "/admin/system-context",
    },
    {
      label: "activity",
      sub: `${stats.activity_count} events`,
      route: "/admin/activity",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Stats ── */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} />
        ))}
      </div>

      {/* ── Page Views + Activity ── */}
      <div className="grid gap-4 [grid-template-columns:1fr_380px]">
        <AdminCard>
          <CardHeader>
            <CardTitle>recent page views</CardTitle>
            <CardBadge>last 50</CardBadge>
          </CardHeader>
          {pageViews.length === 0 ? (
            <div className="flex items-center justify-center h-[120px]">
              <p className="font-mono text-[11px] font-medium text-[#999]">
                no page views yet.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="h-9 border-b border-[#e0e0e0]">
                  {["page", "referrer", "country", "time"].map((h) => (
                    <th
                      key={h}
                      className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-black text-left px-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageViews.map((row, i) => (
                  <tr
                    key={i}
                    className="h-10 border-b border-[#efefef] last:border-b-0 hover:bg-[#f9f9f9] transition-colors duration-100"
                  >
                    <td className="font-mono text-[11px] font-semibold text-black px-4">
                      {row.page}
                    </td>
                    <td className="font-mono text-[11px] text-[#666] px-4">
                      {row.referrer ?? "—"}
                    </td>
                    <td className="font-mono text-[11px] text-[#666] px-4">
                      {row.country ?? "—"}
                    </td>
                    <td className="font-mono text-[11px] text-[#666] px-4 whitespace-nowrap">
                      {new Date(row.visited_at).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminCard>

        <AdminCard>
          <CardHeader>
            <CardTitle>recent activity</CardTitle>
            <CardBadge>last 10</CardBadge>
          </CardHeader>
          {activity.length === 0 ? (
            <div className="flex items-center justify-center h-[120px]">
              <p className="font-mono text-[11px] font-medium text-[#999]">
                no activity yet.
              </p>
            </div>
          ) : (
            <ul>
              {activity.map((item) => {
                const type = item.type as ActivityType;
                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 px-5 py-3.5 border-b border-[#efefef] last:border-b-0 hover:bg-[#f9f9f9] transition-colors duration-100"
                  >
                    <span
                      className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${activityDot[type] ?? "bg-[#ccc]"}`}
                    />
                    <div className="min-w-0">
                      <p className="font-mono text-[12px] font-semibold text-black truncate mb-0.5">
                        {item.title}
                      </p>
                      <p className="font-mono text-[10px] text-[#888]">
                        {item.type.replace(/_/g, " ")} ·{" "}
                        {formatTimeAgo(item.created_at)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </AdminCard>
      </div>

      {/* ── Quick Nav ── */}
      <SectionLabel>quick nav</SectionLabel>
      <div className="grid grid-cols-5 gap-3">
        {quickNav.map((card) => (
          <Link
            key={card.route}
            href={card.route}
            className="bg-white border-2 border-black rounded-md p-4 hover:bg-[#4ade80] transition-colors duration-150 group"
          >
            <p className="font-mono text-[11px] font-black text-black mb-1 uppercase tracking-[0.08em]">
              {card.label}
            </p>
            <p className="font-mono text-[10px] text-[#666] group-hover:text-black transition-colors duration-150">
              {card.sub}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
