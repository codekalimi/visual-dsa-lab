"use client";

import { useEffect, useRef } from "react";
import { motion, LayoutGroup } from "motion/react";
import gsap from "gsap";
import type { ArraySnapshot, StepHighlights } from "@/lib/types";
import { beatDuration, diffArray } from "@/lib/animation/diff";
import { StageCanvas, StageEmpty } from "@/components/stage/StageCanvas";
import { usePlayerStore } from "@/lib/player/store";

type Props = {
  snapshot: ArraySnapshot | null;
  highlights?: StepHighlights;
};

const POINTER_LABEL: Record<string, string> = {
  left: "L",
  right: "R",
  j: "j",
  j1: "j+1",
  i: "i",
  cs: "cs",
};

function inRange(
  i: number,
  range: { start: number; end: number } | undefined,
): boolean {
  if (!range) return false;
  return i >= range.start && i <= range.end;
}

export function ArrayVisualizer({ snapshot, highlights }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const prevSnap = useRef<ArraySnapshot | null>(null);
  const speed = usePlayerStore((s) => s.speed);

  useEffect(() => {
    if (!snapshot || !rowRef.current) return;
    const duration = beatDuration(speed);
    const diff = diffArray(prevSnap.current, snapshot);
    const hi = new Set(highlights?.indices ?? []);

    const getCell = (i: number) =>
      rowRef.current?.querySelector<HTMLElement>(`[data-cell="${i}"]`);

    if (diff.swapped) {
      const [a, b] = diff.swapped;
      const elA = getCell(a);
      const elB = getCell(b);
      if (elA && elB) {
        const dx =
          elB.getBoundingClientRect().left - elA.getBoundingClientRect().left;
        gsap.killTweensOf([elA, elB]);
        gsap
          .timeline()
          .to(elA, { x: dx, duration: duration * 0.7, ease: "power2.inOut" }, 0)
          .to(elB, { x: -dx, duration: duration * 0.7, ease: "power2.inOut" }, 0)
          .set([elA, elB], { x: 0 });
      }
    } else {
      snapshot.values.forEach((_, i) => {
        const el = getCell(i);
        if (!el) return;
        gsap.killTweensOf(el);
        const active = hi.has(i);
        gsap.to(el, {
          duration: duration * 0.4,
          scale: active ? 1.1 : 1,
          y: active ? -10 : 0,
          ease: "power2.out",
        });
      });

      diff.changedIndices.forEach((i) => {
        const el = getCell(i);
        if (!el) return;
        gsap.fromTo(
          el,
          { y: -18 },
          {
            y: hi.has(i) ? -10 : 0,
            duration: duration * 0.45,
            ease: "back.out(1.6)",
          },
        );
      });
    }

    prevSnap.current = {
      values: [...snapshot.values],
      sortedUpTo: snapshot.sortedUpTo,
      pointers: snapshot.pointers ? { ...snapshot.pointers } : undefined,
      window: snapshot.window ? { ...snapshot.window } : undefined,
      currentWindow: snapshot.currentWindow
        ? { ...snapshot.currentWindow }
        : undefined,
      metrics: snapshot.metrics ? { ...snapshot.metrics } : undefined,
    };
  }, [snapshot, highlights, speed]);

  if (!snapshot) {
    return <StageEmpty label="Run to visualize the array" />;
  }

  const metrics = snapshot.metrics;

  return (
    <StageCanvas minHeight="min-h-[300px]">
      {metrics && (
        <div className="flex flex-wrap gap-4 border-b border-border/60 px-4 py-2 font-mono text-xs">
          <span className="text-muted">
            cur{" "}
            <motion.span
              key={`cur-${metrics.currentSum}`}
              initial={{ opacity: 0.4, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-bold text-cyan"
            >
              {metrics.currentSum}
            </motion.span>
          </span>
          <span className="text-muted">
            best{" "}
            <motion.span
              key={`best-${metrics.bestSum}`}
              initial={{ opacity: 0.4, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-bold text-emerald"
            >
              {metrics.bestSum}
            </motion.span>
          </span>
          {snapshot.currentWindow && (
            <span className="text-muted">
              current window{" "}
              <span className="text-cyan">
                [{snapshot.currentWindow.start}…{snapshot.currentWindow.end}]
              </span>
            </span>
          )}
          {snapshot.window && (
            <span className="text-muted">
              best window{" "}
              <span className="text-emerald">
                [{snapshot.window.start}…{snapshot.window.end}]
              </span>
            </span>
          )}
        </div>
      )}
      <LayoutGroup>
        <motion.div
          layout
          ref={rowRef}
          className="flex h-full min-h-[260px] items-center justify-center gap-3 overflow-x-auto px-6 py-10"
        >
          {snapshot.values.map((v, i) => {
            const active = highlights?.indices?.includes(i);
            const sorted =
              snapshot.sortedUpTo !== undefined && i >= snapshot.sortedUpTo;
            const inCurrent = inRange(i, snapshot.currentWindow);
            const inBest = inRange(i, snapshot.window);
            const pointers = Object.entries(snapshot.pointers ?? {}).filter(
              ([, idx]) => idx === i,
            );

            let fill = "rgba(34,211,238,0.12)";
            let stroke = "#2a313c";
            if (sorted) {
              fill = "rgba(52,211,153,0.2)";
              stroke = "#34d399";
            }
            if (inCurrent) {
              fill = "rgba(34,211,238,0.22)";
              stroke = "#22d3ee";
            }
            if (inBest) {
              fill = "rgba(52,211,153,0.25)";
              stroke = "#34d399";
            }
            if (inCurrent && inBest) {
              fill = "rgba(52,211,153,0.3)";
              stroke = "#34d399";
            }
            if (active) {
              fill = "rgba(251,146,60,0.28)";
              stroke = "#fb923c";
            }

            return (
              <motion.div
                layout
                key={i}
                data-cell={i}
                className="relative flex flex-col items-center gap-2 will-change-transform"
              >
                <span className="font-mono text-[10px] text-muted">{i}</span>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-sm font-bold text-ink shadow-[0_0_20px_rgba(34,211,238,0.08)]"
                  style={{ background: fill, borderColor: stroke }}
                >
                  {v}
                </div>
                <div className="flex min-h-[16px] gap-1 font-mono text-[11px] font-bold text-emerald">
                  {pointers.map(([name]) => (
                    <motion.span
                      key={name}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    >
                      {POINTER_LABEL[name] ?? name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </LayoutGroup>
      {(metrics ||
        snapshot.currentWindow ||
        snapshot.window ||
        highlights?.indices?.length) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border/60 px-4 py-2.5 font-mono text-[10px] text-muted">
          <LegendSwatch color="#fb923c" label="current index" />
          <LegendSwatch color="#22d3ee" label="current window" />
          <LegendSwatch color="#34d399" label="best window" />
          {snapshot.pointers && Object.keys(snapshot.pointers).length > 0 && (
            <span className="text-muted/80">pointer labels under cells</span>
          )}
        </div>
      )}
    </StageCanvas>
  );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-sm border"
        style={{ background: `${color}44`, borderColor: color }}
      />
      {label}
    </span>
  );
}
