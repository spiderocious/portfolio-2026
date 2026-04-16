"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "./login/actions";
import {
  TopbarActionsProvider,
  useTopbarActions,
} from "./_components/topbar-context";

const navItems = [
  { label: "dashboard", route: "/admin/dashboard", icon: <GridIcon /> },
  { label: "projects", route: "/admin/projects", icon: <FolderIcon /> },
  { label: "experience", route: "/admin/experience", icon: <BriefcaseIcon /> },
  { label: "experiments", route: "/admin/experiments", icon: <FlaskIcon /> },
  { label: "awards", route: "/admin/awards", icon: <AwardIcon /> },
  { label: "board", route: "/admin/board", icon: <KanbanIcon /> },
  { label: "analytics", route: "/admin/analytics", icon: <ChartIcon /> },
  { label: "chats", route: "/admin/chats", icon: <MessageIcon /> },
  {
    label: "system context",
    route: "/admin/system-context",
    icon: <CpuIcon />,
  },
  { label: "activity", route: "/admin/activity", icon: <ActivityIcon /> },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { actions } = useTopbarActions();

  const segments = pathname.replace("/admin/", "").split("/").filter(Boolean);
  const breadcrumb = ["admin", ...segments];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* ── Sidebar ── */}
      <aside className="fixed top-0 left-0 h-screen w-[240px] bg-white border-r-2 border-black z-50 flex flex-col overflow-y-auto">
        {/* Identity */}
        <div className="px-6 py-3 border-b-2 border-black h-14">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#4ade80] flex-shrink-0 border border-black" />
            <p className="font-mono text-[13px] font-black text-black tracking-tight">
              feranmi
            </p>
          </div>
          <p className="font-mono text-[10px] font-bold text-[#666] uppercase tracking-[0.15em]">
            admin panel
          </p>
        </div>

        {/* Nav section label */}
        <p className="font-mono text-[9px] font-black text-[#999] uppercase tracking-[0.2em] px-6 pt-5 pb-2">
          navigation
        </p>

        {/* Nav items */}
        <nav className="flex flex-col flex-1 px-3 pb-3 gap-0.5">
          {navItems.map((item, i) => {
            const isActive = pathname.startsWith(item.route);
            return (
              <div key={item.route}>
                {i === 1 && (
                  <div className="my-3 mx-3 border-t border-[#e4e4e4]" />
                )}
                <Link
                  href={item.route}
                  className={[
                    "flex items-center gap-3 h-9 px-3 rounded-md font-mono text-[12px] font-semibold transition-all duration-100",
                    isActive
                      ? "bg-[#4ade80] text-black"
                      : "text-[#444] hover:bg-[#f0f0f0] hover:text-black",
                  ].join(" ")}
                >
                  <span className={isActive ? "text-black" : "text-[#888]"}>
                    {item.icon}
                  </span>
                  <span className="capitalize">{item.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Back to site */}
        <div className="border-t-2 border-black px-6 py-4">
          <Link
            href="/"
            className="font-mono text-[11px] font-bold text-[#666] hover:text-black transition-colors duration-150"
          >
            ← back to site
          </Link>
        </div>
      </aside>

      {/* ── Top Bar ── */}
      <header className="fixed top-0 left-[240px] right-0 h-[56px] bg-white border-b-2 border-black z-40 flex items-center justify-between px-8">
        <div className="flex items-center gap-1.5 font-mono text-[12px] font-bold tracking-tight">
          {breadcrumb.map((seg, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-[#ccc] font-normal">/</span>}
              <span
                className={
                  i === breadcrumb.length - 1
                    ? "text-black"
                    : "text-[#999] font-semibold"
                }
              >
                {seg.replace(/-/g, " ")}
              </span>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-5">
          {actions}
          <form action={logoutAction}>
            <button
              type="submit"
              className="font-mono text-[12px] font-bold text-[#999] hover:text-[#ef4444] transition-colors duration-150 cursor-pointer bg-transparent border-none"
            >
              logout →
            </button>
          </form>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="pl-[240px] pt-[56px] min-h-screen">
        <div className="p-8 max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <TopbarActionsProvider>
      <AdminShell>{children}</AdminShell>
    </TopbarActionsProvider>
  );
}

/* ── Icons ── */
function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect
        x="1"
        y="1"
        width="5"
        height="5"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="8"
        y="1"
        width="5"
        height="5"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="1"
        y="8"
        width="5"
        height="5"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="8"
        y="8"
        width="5"
        height="5"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1 3.5C1 2.948 1.448 2.5 2 2.5h3l1.5 1.5H12c.552 0 1 .448 1 1v5.5c0 .552-.448 1-1 1H2c-.552 0-1-.448-1-1V3.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect
        x="1"
        y="4.5"
        width="12"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4.5 4.5V3a1 1 0 011-1h3a1 1 0 011 1v1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="1"
        y1="8"
        x2="13"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function FlaskIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M5 1v5L1.5 12a1 1 0 00.9 1.5h9.2a1 1 0 00.9-1.5L9 6V1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line
        x1="4"
        y1="1"
        x2="10"
        y2="1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function AwardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 9l-2 4h9l-2-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function KanbanIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect
        x="1"
        y="1"
        width="3.5"
        height="9"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="5.25"
        y="1"
        width="3.5"
        height="6"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="9.5"
        y="1"
        width="3.5"
        height="7.5"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <line
        x1="2"
        y1="12"
        x2="2"
        y2="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="2"
        y1="12"
        x2="13"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="3.5"
        y="7"
        width="2"
        height="5"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="6.5"
        y="4"
        width="2"
        height="8"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="9.5"
        y="5.5"
        width="2"
        height="6.5"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function MessageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1 2.5C1 1.948 1.448 1.5 2 1.5h10c.552 0 1 .448 1 1V9c0 .552-.448 1-1 1H5L1 12.5V2.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CpuIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect
        x="3"
        y="3"
        width="8"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="5"
        y="5"
        width="4"
        height="4"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="5"
        y1="1"
        x2="5"
        y2="3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="1"
        x2="9"
        y2="3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="11"
        x2="5"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="11"
        x2="9"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="5"
        x2="3"
        y2="5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="9"
        x2="3"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="5"
        x2="13"
        y2="5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="9"
        x2="13"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <polyline
        points="1,7 3.5,7 5,3 7,11 9,5 10.5,7 13,7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
