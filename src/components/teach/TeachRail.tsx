"use client";

import type { ReactNode } from "react";

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

export function TeachCard({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-lg border border-border bg-panel-2/60 px-3 py-3">
      <header className="mb-2 flex items-start gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cyan-soft font-mono text-[11px] font-semibold text-cyan">
          {index}
        </span>
        <h3 className="pt-0.5 text-xs font-semibold uppercase tracking-[0.1em] text-ink">
          {title}
        </h3>
      </header>
      <div className="space-y-2.5 text-[13px] leading-relaxed text-muted">
        {children}
      </div>
    </article>
  );
}
