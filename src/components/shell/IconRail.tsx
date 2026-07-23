"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  Brackets,
  GitBranch,
  Home,
  Link2,
  PanelLeft,
  Share2,
} from "lucide-react";
import { ENGINE_META, type EngineId } from "@/lib/types";

const ENGINE_ICONS: Record<
  EngineId,
  ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  arrays: Brackets,
  "linked-list": Link2,
  trees: GitBranch,
  graphs: Share2,
};

const ENGINES: EngineId[] = ["arrays", "linked-list", "trees", "graphs"];

type Props = {
  curriculumOpen: boolean;
  onToggleCurriculum: () => void;
};

export function IconRail({ curriculumOpen, onToggleCurriculum }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className="flex w-14 shrink-0 flex-col items-center border-r border-border bg-panel py-3"
      aria-label="Engine navigation"
    >
      <button
        type="button"
        onClick={onToggleCurriculum}
        aria-expanded={curriculumOpen}
        aria-controls="floating-curriculum"
        aria-label={curriculumOpen ? "Close curriculum" : "Open curriculum"}
        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
          curriculumOpen
            ? "bg-cyan-soft text-cyan"
            : "text-muted hover:bg-panel-2 hover:text-ink"
        }`}
      >
        <PanelLeft className="h-5 w-5" strokeWidth={1.75} />
      </button>

      <div className="mt-4 flex flex-1 flex-col items-center gap-1">
        <RailLink
          href="/"
          label="Home"
          active={pathname === "/"}
          icon={Home}
        />
        {ENGINES.map((engine) => {
          const meta = ENGINE_META[engine];
          const Icon = ENGINE_ICONS[engine];
          const active =
            pathname === meta.href || pathname.startsWith(`${meta.href}/`);
          return (
            <RailLink
              key={engine}
              href={meta.href}
              label={meta.label}
              active={active}
              icon={Icon}
            />
          );
        })}
      </div>
    </aside>
  );
}

function RailLink({
  href,
  label,
  active,
  icon: Icon,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
        active
          ? "bg-cyan-soft text-cyan"
          : "text-muted hover:bg-panel-2 hover:text-ink"
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </Link>
  );
}
