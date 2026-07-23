"use client";

import type { ComponentType, ReactNode } from "react";

type Props = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export function TeachRail({
  title = "Learn DSA Visually",
  subtitle,
  children,
}: Props) {
  return (
    <aside
      className="flex w-full shrink-0 flex-col border-t border-border bg-panel xl:sticky xl:top-0 xl:h-[calc(100dvh-2.75rem)] xl:w-[340px] xl:border-t-0 xl:border-l xl:self-start"
      aria-label="Teaching guide"
    >
      <div className="border-b border-border px-4 py-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald">
          {title}
        </p>
        {subtitle && (
          <p className="mt-1 text-sm font-medium text-ink">{subtitle}</p>
        )}
      </div>
      <div className="sidebar-scroll flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {children}
      </div>
    </aside>
  );
}

export type TeachAccent =
  | "blue"
  | "cyan"
  | "emerald"
  | "amber"
  | "violet"
  | "teal"
  | "green"
  | "purple"
  | "pink"
  | "rose"
  | "orange";

const ACCENT: Record<TeachAccent, { box: string; icon: string }> = {
  blue: {
    box: "border-sky-500/40 bg-sky-500/10",
    icon: "text-sky-400",
  },
  cyan: {
    box: "border-cyan/40 bg-cyan-soft",
    icon: "text-cyan",
  },
  emerald: {
    box: "border-emerald/40 bg-emerald-soft",
    icon: "text-emerald",
  },
  amber: {
    box: "border-amber-400/40 bg-amber-400/10",
    icon: "text-amber-400",
  },
  violet: {
    box: "border-violet-400/40 bg-violet-400/10",
    icon: "text-violet-400",
  },
  teal: {
    box: "border-teal-400/40 bg-teal-400/10",
    icon: "text-teal-400",
  },
  green: {
    box: "border-lime-500/40 bg-lime-500/10",
    icon: "text-lime-400",
  },
  purple: {
    box: "border-fuchsia-400/40 bg-fuchsia-400/10",
    icon: "text-fuchsia-400",
  },
  pink: {
    box: "border-pink-400/40 bg-pink-400/10",
    icon: "text-pink-400",
  },
  rose: {
    box: "border-rose/40 bg-rose-soft",
    icon: "text-rose",
  },
  orange: {
    box: "border-tangerine/40 bg-tangerine-soft",
    icon: "text-tangerine",
  },
};

export function TeachCard({
  icon: Icon,
  accent = "cyan",
  title,
  children,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  accent?: TeachAccent;
  title: string;
  children: ReactNode;
}) {
  const tone = ACCENT[accent];
  return (
    <article className="rounded-lg border border-border bg-panel-2/60 px-3 py-3">
      <header className="mb-2 flex items-start gap-2.5">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${tone.box}`}
          aria-hidden
        >
          <Icon className={`h-3.5 w-3.5 ${tone.icon}`} strokeWidth={2} />
        </span>
        <h3 className="pt-1 text-[13px] font-semibold leading-snug text-ink">
          {title}
        </h3>
      </header>
      <div className="space-y-2.5 pl-[2.375rem] text-[13px] leading-relaxed text-muted">
        {children}
      </div>
    </article>
  );
}
