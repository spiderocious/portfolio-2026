"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "./login/actions";

const navItems = [
  { label: "dashboard",      route: "/admin/dashboard",      icon: <GridIcon /> },
  { label: "projects",       route: "/admin/projects",       icon: <FolderIcon /> },
  { label: "experience",     route: "/admin/experience",     icon: <BriefcaseIcon /> },
  { label: "experiments",    route: "/admin/experiments",    icon: <FlaskIcon /> },
  { label: "awards",         route: "/admin/awards",         icon: <AwardIcon /> },
  { label: "board",          route: "/admin/board",          icon: <KanbanIcon /> },
  { label: "analytics",      route: "/admin/analytics",      icon: <ChartIcon /> },
  { label: "chats",          route: "/admin/chats",          icon: <MessageIcon /> },
  { label: "system context", route: "/admin/system-context", icon: <CpuIcon /> },
  { label: "activity",       route: "/admin/activity",       icon: <ActivityIcon /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  const pageLabel = navItems.find((n) => n.route === pathname)?.label ?? "admin";

  return (
    <div className="min-h-screen bg-a-base admin-grain">

      {/* ── Sidebar ── */}
      <aside className="fixed top-0 left-0 h-screen w-[220px] bg-a-surface border-r border-a-border z-50 flex flex-col overflow-y-auto">

        {/* Identity */}
        <div className="px-5 pt-6 pb-5 border-b border-a-border">
          <p className="font-mono text-[11px] text-a-green mb-1">feranmi@admin</p>
          <p className="font-mono text-[10px] text-a-ink-4 uppercase tracking-[0.1em]">admin panel</p>
        </div>

        {/* Nav section label */}
        <p className="font-mono text-[9px] text-a-ink-5 uppercase tracking-[0.18em] px-5 pt-4 pb-2">
          navigation
        </p>

        {/* Nav items */}
        <nav className="flex flex-col flex-1">
          {navItems.map((item, i) => {
            const isActive = pathname === item.route;
            return (
              <div key={item.route}>
                {i === 1 && <div className="mx-5 my-2 border-t border-a-border" />}
                <Link
                  href={item.route}
                  className={[
                    "flex items-center gap-2.5 h-9 px-5 border-l-2 transition-colors duration-150",
                    isActive
                      ? "border-l-white bg-white/[0.06] text-white"
                      : "border-l-transparent text-a-ink-3 hover:bg-white/[0.03] hover:border-l-a-ink-5 hover:text-a-ink-2",
                  ].join(" ")}
                >
                  <span className={isActive ? "text-white" : "text-a-ink-4"}>
                    {item.icon}
                  </span>
                  <span className="font-mono text-[12px] font-medium capitalize">
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Back to site */}
        <div className="border-t border-a-border px-5 py-4">
          <Link
            href="/"
            className="font-mono text-[11px] text-a-ink-4 hover:text-a-ink-2 transition-colors duration-150"
          >
            ← back to site
          </Link>
        </div>
      </aside>

      {/* ── Top Bar ── */}
      <header className="fixed top-0 left-[220px] right-0 h-[52px] bg-a-base border-b border-a-border z-40 flex items-center justify-between px-8">
        <p className="font-mono text-[12px] font-medium tracking-[0.08em]">
          <span className="text-a-ink-4">admin / </span>
          <span className="text-white">{pageLabel}</span>
        </p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="font-mono text-[11px] text-a-ink-3 hover:text-a-red transition-colors duration-150 cursor-pointer bg-transparent border-none"
          >
            logout →
          </button>
        </form>
      </header>

      {/* ── Main Content ── */}
      <main className="pl-[220px] pt-[52px] min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

/* ── Icons ── */
function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
      <rect x="8" y="1" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
      <rect x="1" y="8" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
      <rect x="8" y="8" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 3.5C1 2.948 1.448 2.5 2 2.5h3l1.5 1.5H12c.552 0 1 .448 1 1v5.5c0 .552-.448 1-1 1H2c-.552 0-1-.448-1-1V3.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="4.5" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4.5 4.5V3a1 1 0 011-1h3a1 1 0 011 1v1.5" stroke="currentColor" strokeWidth="1.1" />
      <line x1="1" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.1" />
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
function AwardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4.5 9l-2 4h9l-2-4" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}
function KanbanIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="3.5" height="9" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
      <rect x="5.25" y="1" width="3.5" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
      <rect x="9.5" y="1" width="3.5" height="7.5" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <line x1="2" y1="12" x2="2" y2="2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="2" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <rect x="3.5" y="7" width="2" height="5" rx="0.5" stroke="currentColor" strokeWidth="1" />
      <rect x="6.5" y="4" width="2" height="8" rx="0.5" stroke="currentColor" strokeWidth="1" />
      <rect x="9.5" y="5.5" width="2" height="6.5" rx="0.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
function MessageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 2.5C1 1.948 1.448 1.5 2 1.5h10c.552 0 1 .448 1 1V9c0 .552-.448 1-1 1H5L1 12.5V2.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}
function CpuIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <rect x="5" y="5" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1" />
      <line x1="5" y1="1" x2="5" y2="3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="9" y1="1" x2="9" y2="3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="5" y1="11" x2="5" y2="13" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="9" y1="11" x2="9" y2="13" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="1" y1="5" x2="3" y2="5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="1" y1="9" x2="3" y2="9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="11" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="11" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <polyline points="1,7 3.5,7 5,3 7,11 9,5 10.5,7 13,7" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round" fill="none" />
    </svg>
  );
}
