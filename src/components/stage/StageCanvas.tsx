"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  minHeight?: string;
};

export function StageCanvas({
  children,
  className = "",
  minHeight = "min-h-[280px]",
}: Props) {
  return (
    <div
      className={`stage-grid relative overflow-hidden rounded-xl border border-border bg-panel ${minHeight} ${className}`}
    >
      {children}
    </div>
  );
}

export function StageEmpty({ label }: { label: string }) {
  return (
    <StageCanvas>
      <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-muted">
        {label}
      </div>
    </StageCanvas>
  );
}
