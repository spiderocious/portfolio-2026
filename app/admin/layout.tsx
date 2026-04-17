"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const segments = pathname.replace("/admin/", "").split("/").filter(Boolean);
  const breadcrumb = ["admin", ...segments];

  // Auto-close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar open
  useEffect(() => {
    if (!sidebarOpen) return;
    // only lock on small screens — desktop always shows sidebar
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={[
          "fixed top-0 left-0 h-screen w-[240px] bg-white border-r-2 border-black z-50 flex flex-col overflow-y-auto",
          "transition-transform duration-250 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        {/* Identity */}
        <div className="px-6 py-3 border-b-2 border-black h-14 flex items-center justify-between">
          <div>
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
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-md border border-[#d0d0d0] text-[#666] hover:text-black hover:border-black transition-colors cursor-pointer"
          >
            ✕
          </button>
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
      <header
        className={[
          "fixed top-0 right-0 h-[56px] bg-white border-b-2 border-black z-40 flex items-center justify-between gap-2",
          "left-0 md:left-[240px] px-4 md:px-8",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-md border border-[#d0d0d0] text-black hover:border-black transition-colors cursor-pointer shrink-0"
          >
            <HamburgerIcon />
          </button>

          <div className="flex items-center gap-1.5 font-mono text-[12px] font-bold tracking-tight min-w-0 overflow-hidden">
            {breadcrumb.map((seg, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 shrink-0 last:truncate"
              >
                {i > 0 && <span className="text-[#ccc] font-normal">/</span>}
                <span
                  className={
                    i === breadcrumb.length - 1
                      ? "text-black"
                      : "text-[#999] font-semibold hidden sm:inline"
                  }
                >
                  {seg.replace(/-/g, " ")}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          <div className="hidden sm:flex items-center gap-3 md:gap-5">
            {actions}
          </div>
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
      <main className="pt-[56px] md:pl-[240px] min-h-screen">
        {/* Small-screen topbar actions row (so they're not hidden on mobile) */}
        {actions && (
          <div className="sm:hidden border-b-2 border-black bg-white px-4 py-2 flex items-center gap-2 overflow-x-auto">
            {actions}
          </div>
        )}
        <div className="p-4 md:p-8 max-w-[1400px]">{children}</div>
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
function HamburgerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8" y="1" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="8" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8" y="8" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 3.5C1 2.948 1.448 2.5 2 2.5h3l1.5 1.5H12c.552 0 1 .448 1 1v5.5c0 .552-.448 1-1 1H2c-.552 0-1-.448-1-1V3.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="4.5" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 4.5V3a1 1 0 011-1h3a1 1 0 011 1v1.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="1" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function FlaskIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 1v5L1.5 12a1 1 0 00.9 1.5h9.2a1 1 0 00.9-1.5L9 6V1" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="4" y1="1" x2="10" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function AwardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 9l-2 4h9l-2-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function KanbanIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="3.5" height="9" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5.25" y="1" width="3.5" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9.5" y="1" width="3.5" height="7.5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <line x1="2" y1="12" x2="2" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3.5" y="7" width="2" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="6.5" y="4" width="2" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9.5" y="5.5" width="2" height="6.5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function MessageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 2.5C1 1.948 1.448 1.5 2 1.5h10c.552 0 1 .448 1 1V9c0 .552-.448 1-1 1H5L1 12.5V2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function CpuIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5" y="5" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="5" y1="1" x2="5" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="1" x2="9" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="11" x2="5" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="11" x2="9" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="5" x2="3" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="9" x2="3" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <polyline points="1,7 3.5,7 5,3 7,11 9,5 10.5,7 13,7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
    </svg>
  );
}
