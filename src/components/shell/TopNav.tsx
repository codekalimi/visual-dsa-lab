"use client";

import Link from "next/link";

export function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-panel px-3 md:px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md border border-border px-2 py-1 text-xs text-muted lg:hidden"
          aria-label="Open curriculum"
        >
          Menu
        </button>
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-sm font-bold tracking-tight text-ink md:text-base">
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
