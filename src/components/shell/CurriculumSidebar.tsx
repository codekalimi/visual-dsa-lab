"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { listAlgorithms } from "@/lib/catalog";
import { ENGINE_META, type EngineId } from "@/lib/types";

const CHAPTERS: EngineId[] = ["arrays", "linked-list", "trees", "graphs"];

const CHAPTER_ICONS: Record<EngineId, string> = {
  arrays: "[]",
  "linked-list": "○→",
  trees: "△",
  graphs: "◈",
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CurriculumSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    arrays: true,
    "linked-list": true,
    trees: true,
    graphs: true,
  });

  const chapters = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CHAPTERS.map((engine) => {
      const meta = ENGINE_META[engine];
      const algos = listAlgorithms(engine).filter((a) => {
        if (!q) return true;
        return (
          a.title.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          meta.label.toLowerCase().includes(q)
        );
      });
      return { engine, meta, algos };
    }).filter((c) => (q ? c.algos.length > 0 : true));
  }, [query]);

  const totalAlgos = CHAPTERS.reduce(
    (n, e) => n + listAlgorithms(e).length,
    0,
  );

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          aria-label="Close sidebar"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-border bg-panel transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-border px-4 py-4">
          <h2 className="text-sm font-semibold text-ink">
            Data Structures and Algorithms
          </h2>
          <p className="mt-1 font-mono text-[11px] text-muted">
            0% · 0/{totalAlgos} labs
          </p>
          <div className="mt-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chapters..."
              className="w-full rounded-md border border-border bg-panel-2 px-3 py-2 text-xs text-ink placeholder:text-muted/70 outline-none focus:border-cyan/50"
            />
          </div>
        </div>

        <nav className="sidebar-scroll flex-1 overflow-y-auto px-2 py-3">
          {chapters.map(({ engine, meta, algos }) => {
            const isOpen = expanded[engine] ?? true;
            const chapterActive =
              pathname === meta.href || pathname.startsWith(`${meta.href}/`);
            return (
              <div key={engine} className="mb-1">
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((s) => ({ ...s, [engine]: !isOpen }))
                  }
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm ${
                    chapterActive
                      ? "bg-cyan-soft text-cyan"
                      : "text-ink hover:bg-panel-2"
                  }`}
                >
                  <span className="w-6 font-mono text-[10px] text-muted">
                    {CHAPTER_ICONS[engine]}
                  </span>
                  <span className="flex-1 font-medium">{meta.label}</span>
                  <span className="font-mono text-[10px] text-muted">
                    0/{algos.length}
                  </span>
                  <span className="text-[10px] text-muted">
                    {isOpen ? "▾" : "▸"}
                  </span>
                </button>
                {isOpen && (
                  <ul className="ml-4 border-l border-border pl-2">
                    <li>
                      <Link
                        href={meta.href}
                        onClick={onClose}
                        className={`block rounded-md px-2 py-1.5 text-xs ${
                          pathname === meta.href
                            ? "text-cyan"
                            : "text-muted hover:text-ink"
                        }`}
                      >
                        Overview
                      </Link>
                    </li>
                    {algos.map((algo) => {
                      const href = `${meta.href}/${algo.id}`;
                      const active = pathname === href;
                      return (
                        <li key={algo.id}>
                          <Link
                            href={href}
                            onClick={onClose}
                            className={`block rounded-md px-2 py-1.5 text-xs ${
                              active
                                ? "bg-emerald-soft font-medium text-emerald"
                                : "text-muted hover:text-ink"
                            }`}
                          >
                            {algo.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
