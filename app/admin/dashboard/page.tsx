import Link from "next/link";

/* ── Static placeholder data (replace with real queries later) ── */

const stats = [
  { label: "total visits", value: "12,441", sub: "all time" },
  { label: "blog reads", value: "3,820", sub: "all time" },
  { label: "project interactions", value: "6,104", sub: "all time" },
  { label: "active chats", value: "77", sub: "stored" },
];

const pageViews = [
  { page: "/projects/monolith", referrer: "google.com", country: "NG", time: "2m ago" },
  { page: "/blog/the-acid-philosophy", referrer: "twitter.com", country: "US", time: "14m ago" },
  { page: "/blog/crystal-ui", referrer: "—", country: "GB", time: "31m ago" },
  { page: "/", referrer: "direct", country: "NG", time: "45m ago" },
  { page: "/experience", referrer: "linkedin.com", country: "Germany", time: "1h ago" },
  { page: "/projects/yearnings", referrer: "—", country: "US", time: "1h ago" },
  { page: "/experiments", referrer: "google.com", country: "CA", time: "2h ago" },
];

type ActivityType = "commit" | "blog_post" | "project_update" | "experiment" | "note";

const activityFeed: {
  type: ActivityType;
  title: string;
  time: string;
}[] = [
  { type: "commit", title: "feat: admin dashboard scaffold", time: "5m ago" },
  { type: "blog_post", title: 'Draft published: "The Acid Philosophy"', time: "2h ago" },
  { type: "project_update", title: 'Project "Zion" moved to Completed', time: "6h ago" },
  { type: "experiment", title: "New experiment: crystalline-ui", time: "1d ago" },
  { type: "note", title: "Unauthorized login attempt blocked", time: "2d ago" },
  { type: "commit", title: "fix: middleware redirect loop on /admin", time: "2d ago" },
  { type: "blog_post", title: 'Draft saved: "On building slow"', time: "3d ago" },
];

const quickNav = [
  { label: "projects", sub: "5 projects", route: "/admin/projects" },
  { label: "experience", sub: "3 entries", route: "/admin/experience" },
  { label: "experiments", sub: "12 items", route: "/admin/experiments" },
  { label: "awards", sub: "8 awards", route: "/admin/awards" },
  { label: "board", sub: "14 items", route: "/admin/board" },
  { label: "analytics", sub: "page views", route: "/admin/analytics" },
  { label: "chats", sub: "77 sessions", route: "/admin/chats" },
  { label: "system context", sub: "6 entries", route: "/admin/system-context" },
  { label: "activity", sub: "203 events", route: "/admin/activity" },
];

const activityColors: Record<ActivityType, string> = {
  commit: "text-a-green",
  blog_post: "text-a-blue",
  project_update: "text-a-purple",
  experiment: "text-a-orange",
  note: "text-a-ink-4",
};

const activityIcons: Record<ActivityType, React.ReactNode> = {
  commit: <CommitIcon />,
  blog_post: <FileIcon />,
  project_update: <BoxIcon />,
  experiment: <FlaskIcon />,
  note: <AlertIcon />,
};

export default function DashboardPage() {
  return (
    <div>
      {/* ── Stats Row ── */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-a-card border border-a-border rounded-md px-5 pt-5 pb-4 hover:border-a-border-hov transition-colors duration-150"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-a-ink-6 mb-3">
              {s.label}
            </p>
            <p className="font-mono text-[28px] font-bold text-a-ink leading-none mb-2">
              {s.value}
            </p>
            <p className="font-mono text-[10px] text-a-ink-8">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Two-column: Page Views + Activity Feed ── */}
      <div className="grid gap-3 mb-8 [grid-template-columns:1fr_380px]">

        {/* Recent Page Views */}
        <div className="bg-a-card border border-a-border rounded-md overflow-hidden">
          <div className="h-11 flex items-center justify-between px-5 border-b border-a-border-sub">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-a-ink-6">
              recent page views
            </span>
            <span className="font-mono text-[10px] text-a-ink-8 bg-a-border-sub border border-[#252525] rounded px-2 py-0.5">
              last 50
            </span>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-a-surface h-8">
                {["page", "referrer", "country", "time"].map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[9px] uppercase tracking-[0.14em] text-a-ink-7 text-left px-4 font-medium"
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
                  className="h-10 border-b border-[#191919] hover:bg-white/[0.02] transition-colors duration-100"
                >
                  <td className="font-mono text-[11px] text-a-ink-3 px-4">{row.page}</td>
                  <td className="font-mono text-[11px] text-a-ink-5 px-4">{row.referrer}</td>
                  <td className="font-mono text-[11px] text-a-ink-6 px-4">{row.country}</td>
                  <td className="font-mono text-[11px] text-a-ink-7 px-4">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-a-card border border-a-border rounded-md overflow-hidden">
          <div className="h-11 flex items-center justify-between px-5 border-b border-a-border-sub">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-a-ink-6">
              recent activity
            </span>
            <span className="font-mono text-[10px] text-a-ink-8 bg-a-border-sub border border-[#252525] rounded px-2 py-0.5">
              last 10
            </span>
          </div>
          <ul>
            {activityFeed.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 px-5 py-3.5 border-b border-[#191919] last:border-b-0 hover:bg-white/[0.02] transition-colors duration-100"
              >
                <span className={`mt-0.5 flex-shrink-0 ${activityColors[item.type]}`}>
                  {activityIcons[item.type]}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-a-ink-3 truncate mb-0.5">
                    {item.title}
                  </p>
                  <p className="font-mono text-[10px] text-a-ink-7">
                    {item.type.replace("_", " ")} · {item.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Quick Nav ── */}
      <div>
        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-a-border-sub">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-a-ink-8">
            quick nav
          </p>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {quickNav.map((card) => (
            <Link
              key={card.route}
              href={card.route}
              className="bg-a-surface border border-a-border rounded-md p-4 cursor-pointer hover:bg-a-raised hover:border-a-border-hov transition-colors duration-150 group"
            >
              <p className="font-mono text-[11px] text-a-ink-5 group-hover:text-a-ink-4 mb-1">
                {card.label}
              </p>
              <p className="font-mono text-[10px] text-a-ink-8">{card.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Inline icons for activity feed ── */
function CommitIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.1" />
      <line x1="1" y1="7" x2="4.5" y2="7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="9.5" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 1.5h5.5L11 4v8.5H3V1.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M8.5 1.5V4H11" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1L12.5 4v6L7 13 1.5 10V4L7 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <line x1="7" y1="7" x2="7" y2="13" stroke="currentColor" strokeWidth="1.1" />
      <line x1="1.5" y1="4" x2="7" y2="7" stroke="currentColor" strokeWidth="1.1" />
      <line x1="12.5" y1="4" x2="7" y2="7" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 1v5L1.5 12a1 1 0 00.9 1.5h9.2a1 1 0 00.9-1.5L9 6V1" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <line x1="4" y1="1" x2="10" y2="1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5L12.5 11.5H1.5L7 1.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <line x1="7" y1="6" x2="7" y2="8.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="7" cy="10" r="0.5" fill="currentColor" />
    </svg>
  );
}
