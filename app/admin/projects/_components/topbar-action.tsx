"use client";

import Link from "next/link";
import { SetTopbarActions } from "../../_components/set-topbar-actions";

export function ProjectsTopbarAction() {
  return (
    <SetTopbarActions>
      <Link
        href="/admin/projects/new"
        className="h-8 px-3.5 font-mono text-[11px] font-medium bg-a-btn text-a-base hover:bg-a-btn-hov transition-colors duration-150 rounded flex items-center"
      >
        new project +
      </Link>
    </SetTopbarActions>
  );
}
