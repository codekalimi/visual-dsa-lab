"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useMemo,
  useState,
  type ComponentType,
  type RefObject,
} from "react";
import {
  Brackets,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Link2,
  Share2,
  X,
} from "lucide-react";
import { listAlgorithms } from "@/lib/catalog";
import { ENGINE_META, type EngineId } from "@/lib/types";

const CHAPTERS: EngineId[] = ["arrays", "linked-list", "trees", "graphs"];

const CHAPTER_ICONS: Record<
  EngineId,
  ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  arrays: Brackets,
  "linked-list": Link2,
  trees: GitBranch,
  graphs: Share2,
};

type Props = {
  open: boolean;
  onClose: () => void;
  closeRef?: RefObject<HTMLButtonElement | null>;
};

export function CurriculumSidebar({ onClose, closeRef }: Props) {
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
    <aside className="flex h-full w-full flex-col border-r border-border bg-panel">
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-ink">
              Data Structures and Algorithms
            </h2>
            <p className="mt-1 font-mono text-[11px] text-muted">
              0 / {totalAlgos} labs
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close curriculum"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-panel-2 hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
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
          const Icon = CHAPTER_ICONS[engine];
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
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span className="flex-1 font-medium">{meta.label}</span>
                <span className="font-mono text-[10px] text-muted">
                  0/{algos.length}
                </span>
                {isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted" />
                )}
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
  );
}
