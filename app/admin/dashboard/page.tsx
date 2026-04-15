import Link from "next/link";
import { getDashboardStats } from "@/lib/services/analytics";
import { getRecentPageViews } from "@/lib/services/analytics";
import { getRecentActivity } from "@/lib/services/activity";

type ActivityType = "commit" | "blog_post" | "project_update" | "experiment" | "note";

const activityColors: Record<ActivityType, string> = {
  commit:         "text-a-green",
  blog_post:      "text-a-blue",
  project_update: "text-a-purple",
  experiment:     "text-a-orange",
  note:           "text-a-ink-3",
};

export default async function DashboardPage() {
  const [stats, pageViews, activity] = await Promise.all([
    getDashboardStats(),
    getRecentPageViews(50),
    getRecentActivity(10),
  ]);

  const statCards = [
    { label: "total visits",          value: stats.total_visits.toLocaleString(),          sub: "all time" },
    { label: "blog reads",            value: stats.total_blog_reads.toLocaleString(),       sub: "all time" },
    { label: "project interactions",  value: stats.total_project_interactions.toLocaleString(), sub: "all time" },
    { label: "active chats",          value: stats.total_conversations.toLocaleString(),   sub: "stored"   },
  ];

  const quickNav = [
    { label: "projects",       sub: `${stats.project_count} projects`,      route: "/admin/projects"       },
    { label: "experience",     sub: `${stats.experience_count} entries`,     route: "/admin/experience"     },
    { label: "experiments",    sub: `${stats.experiment_count} items`,       route: "/admin/experiments"    },
    { label: "awards",         sub: `${stats.award_count} awards`,           route: "/admin/awards"         },
    { label: "board",          sub: `${stats.board_item_count} items`,       route: "/admin/board"          },
    { label: "analytics",      sub: "page views",                            route: "/admin/analytics"      },
    { label: "chats",          sub: `${stats.total_conversations} sessions`, route: "/admin/chats"          },
    { label: "system context", sub: `${stats.context_entry_count} entries`,  route: "/admin/system-context" },
    { label: "activity",       sub: `${stats.activity_count} events`,        route: "/admin/activity"       },
  ];

  return (
    <div>
      {/* ── Stats Row ── */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-a-card border border-a-border rounded-md px-5 pt-5 pb-4 hover:border-a-border-hov transition-colors duration-150"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-a-ink-4 mb-3">
              {s.label}
            </p>
            <p className="font-mono text-[28px] font-bold text-white leading-none mb-2">
              {s.value}
            </p>
            <p className="font-mono text-[10px] text-a-ink-5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Two-column: Page Views + Activity Feed ── */}
      <div className="grid gap-3 mb-8 [grid-template-columns:1fr_380px]">

        {/* Recent Page Views */}
        <div className="bg-a-card border border-a-border rounded-md overflow-hidden">
          <div className="h-11 flex items-center justify-between px-5 border-b border-a-border">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-a-ink-4">
              recent page views
            </span>
            <span className="font-mono text-[10px] text-a-ink-4 bg-a-raised border border-a-border rounded px-2 py-0.5">
              last 50
            </span>
          </div>
          {pageViews.length === 0 ? (
            <div className="flex items-center justify-center h-[120px]">
              <p className="font-mono text-[11px] text-a-ink-7">no page views yet.</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-a-surface h-8">
                  {["page", "referrer", "country", "time"].map((h) => (
                    <th
                      key={h}
                      className="font-mono text-[9px] uppercase tracking-[0.14em] text-a-ink-4 text-left px-4 font-medium"
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
                    className="h-10 border-b border-a-border-sub hover:bg-white/[0.02] transition-colors duration-100"
                  >
                    <td className="font-mono text-[11px] text-white px-4">{row.page}</td>
                    <td className="font-mono text-[11px] text-a-ink-3 px-4">{row.referrer ?? "—"}</td>
                    <td className="font-mono text-[11px] text-a-ink-4 px-4">{row.country ?? "—"}</td>
                    <td className="font-mono text-[11px] text-a-ink-4 px-4 whitespace-nowrap">
                      {new Date(row.visited_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-a-card border border-a-border rounded-md overflow-hidden">
          <div className="h-11 flex items-center justify-between px-5 border-b border-a-border">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-a-ink-4">
              recent activity
            </span>
            <span className="font-mono text-[10px] text-a-ink-4 bg-a-raised border border-a-border rounded px-2 py-0.5">
              last 10
            </span>
          </div>
          {activity.length === 0 ? (
            <div className="flex items-center justify-center h-[120px]">
              <p className="font-mono text-[11px] text-a-ink-7">no activity yet.</p>
            </div>
          ) : (
            <ul>
              {activity.map((item) => {
                const type = item.type as ActivityType;
                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 px-5 py-3.5 border-b border-a-border-sub last:border-b-0 hover:bg-white/[0.02] transition-colors duration-100"
                  >
                    <span className={`mt-0.5 flex-shrink-0 ${activityColors[type] ?? "text-a-ink-4"}`}>
                      <ActivityDot />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] text-white truncate mb-0.5">
                        {item.title}
                      </p>
                      <p className="font-mono text-[10px] text-a-ink-4">
                        {item.type.replace(/_/g, " ")} · {formatTimeAgo(item.created_at)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ── Quick Nav ── */}
      <div>
        <div className="mb-3 pb-2 border-b border-a-border">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-a-ink-4">
            quick nav
          </p>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {quickNav.map((card) => (
            <Link
              key={card.route}
              href={card.route}
              className="bg-a-surface border border-a-border rounded-md p-4 hover:bg-a-raised hover:border-a-border-hov transition-colors duration-150 group"
            >
              <p className="font-mono text-[11px] text-a-ink-3 group-hover:text-white mb-1 transition-colors duration-150">
                {card.label}
              </p>
              <p className="font-mono text-[10px] text-a-ink-4">{card.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityDot() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="3" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
