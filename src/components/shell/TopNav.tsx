"use client";

import Link from "next/link";
import { PanelLeft } from "lucide-react";

type Props = {
  curriculumOpen?: boolean;
  onMenuClick?: () => void;
  onToggleCurriculum?: () => void;
};

export function TopNav({
  curriculumOpen = false,
  onMenuClick,
  onToggleCurriculum,
}: Props) {
  return (
    <header className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-panel px-3 md:px-4">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onMenuClick ?? onToggleCurriculum}
          aria-expanded={curriculumOpen}
          aria-controls="floating-curriculum"
          aria-label={curriculumOpen ? "Close curriculum" : "Open curriculum"}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted hover:bg-panel-2 hover:text-ink sm:hidden"
        >
          <PanelLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-sm font-bold tracking-tight text-ink">
            Visual DSA Lab
          </span>
          <span className="hidden text-[11px] text-muted sm:inline">
            interview walkthroughs
          </span>
        </Link>
      </div>
      <nav className="hidden items-center gap-4 text-xs text-muted sm:flex">
        <Link href="/arrays" className="hover:text-cyan">
          Arrays
        </Link>
        <Link href="/linked-list" className="hover:text-cyan">
          Lists
        </Link>
        <Link href="/trees" className="hover:text-cyan">
          Trees
        </Link>
        <Link href="/graphs" className="hover:text-cyan">
          Graphs
        </Link>
      </nav>
    </header>
  );
}
