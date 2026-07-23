"use client";

import { motion } from "motion/react";
import { ChevronUp, Sparkles } from "lucide-react";
import type { KadaneSnapshot, StepHighlights } from "@/lib/types";
import { StageCanvas, StageEmpty } from "@/components/stage/StageCanvas";
import { usePlayerStore } from "@/lib/player/store";

type Props = {
  snapshot: KadaneSnapshot | null;
  highlights?: StepHighlights;
};

const CELL = 48; // px cell size
const GAP = 12; // px between columns

export function KadaneVisualizer({ snapshot, highlights }: Props) {
  const index = usePlayerStore((s) => s.index);
  const steps = usePlayerStore((s) => s.steps);

  if (!snapshot || snapshot.values.length === 0) {
    return <StageEmpty label="Run to visualize Kadane" />;
  }

  const n = snapshot.values.length;
  const active = snapshot.i;
  const { start, end, showCurrentBracket } = snapshot;
  const colW = CELL + GAP;
  const bracketLeft = start * colW;
  const bracketWidth = Math.max(CELL, (end - start) * colW + CELL);

  return (
    <StageCanvas minHeight="min-h-[340px]">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Sparkles className="h-4 w-4 text-cyan" strokeWidth={1.75} />
          Live Visualization
        </div>
        <span className="font-mono text-xs font-medium text-cyan">
          Step {steps.length ? index + 1 : 0} / {steps.length || 0}
        </span>
      </div>

      <div className="overflow-x-auto px-4 py-6">
        <div
          className="mx-auto w-max"
          style={{ ["--col" as string]: `${colW}px` }}
        >
          {/* Array row */}
          <div className="flex" style={{ gap: GAP }}>
            {snapshot.values.map((v, i) => {
              const isStart = i === start && showCurrentBracket;
              const isActive =
                active !== null
                  ? i === active
                  : Boolean(highlights?.indices?.includes(i));
              const isEnd = i === end && showCurrentBracket && i !== start;

              let border = "border-border";
              let bg = "bg-panel-2";
              let text = "text-ink";
              let glow = "";

              if (isStart) {
                border = "border-tangerine";
                bg = "bg-tangerine-soft";
                text = "text-tangerine";
                glow = "shadow-[0_0_16px_rgba(251,146,60,0.35)]";
              } else if (isActive) {
                border = "border-cyan";
                bg = "bg-cyan-soft";
                text = "text-cyan";
                glow = "shadow-[0_0_16px_rgba(34,211,238,0.35)]";
              } else if (isEnd) {
                border = "border-emerald/60";
                bg = "bg-emerald-soft/50";
              }

              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5"
                  style={{ width: CELL }}
                >
                  <span className="font-mono text-[10px] text-muted">{i}</span>
                  <motion.div
                    layout
                    animate={{
                      scale: isActive || isStart ? 1.06 : 1,
                      y: isActive || isStart ? -2 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                    className={`relative flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-sm font-bold ${border} ${bg} ${text} ${glow}`}
                  >
                    {isStart && (
                      <>
                        <span className="absolute -top-1 left-1 h-1.5 w-1.5 rounded-full bg-tangerine" />
                        <span className="absolute -top-1 right-1 h-1.5 w-1.5 rounded-full bg-tangerine" />
                      </>
                    )}
                    {v}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* curSum row */}
          <MetricRow
            label="curSum"
            values={snapshot.curAt}
            active={active}
            tone="cyan"
            gap={GAP}
            cell={CELL}
          />

          {/* maxSum row */}
          <MetricRow
            label="maxSum"
            values={snapshot.bestAt}
            active={active}
            tone="emerald"
            gap={GAP}
            cell={CELL}
          />

          {/* Pointers + bracket */}
          {showCurrentBracket && n > 0 && (
            <div className="relative mt-4" style={{ width: n * colW - GAP }}>
              <div className="relative h-10">
                <PointerMark
                  left={start * colW + CELL / 2}
                  color="text-tangerine"
                  label={
                    active === null ? `maxL = ${start}` : `L = ${start}`
                  }
                />
                {end !== start && (
                  <PointerMark
                    left={end * colW + CELL / 2}
                    color="text-emerald"
                    label={
                      active === null ? `maxR = ${end}` : `R = ${end}`
                    }
                  />
                )}
              </div>

              {/* bracket bar */}
              <div
                className="relative mx-0 h-3"
                style={{ marginLeft: bracketLeft, width: bracketWidth }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, #fb923c 0%, #34d399 100%)",
                  }}
                />
                <div className="absolute left-0 top-0 h-2 w-px bg-tangerine" />
                <div className="absolute right-0 top-0 h-2 w-px bg-emerald" />
              </div>

              <div
                className="mt-2 flex justify-center"
                style={{ marginLeft: bracketLeft, width: bracketWidth }}
              >
                <span className="rounded-full border border-emerald/40 bg-emerald-soft px-3 py-1 font-mono text-[11px] font-medium text-emerald">
                  Current Subarray (sum = {snapshot.currentSum})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </StageCanvas>
  );
}

function MetricRow({
  label,
  values,
  active,
  tone,
  gap,
  cell,
}: {
  label: string;
  values: (number | null)[];
  active: number | null;
  tone: "cyan" | "emerald";
  gap: number;
  cell: number;
}) {
  const chip =
    tone === "cyan"
      ? "bg-cyan text-background"
      : "bg-emerald text-background";
  const muted = "text-muted";

  return (
    <div className="mt-3 flex items-center">
      <div
        className="mr-2 w-16 shrink-0 text-right font-mono text-[10px] text-muted"
        style={{ marginLeft: -72 }}
      >
        {label}
      </div>
      <div className="flex" style={{ gap }}>
        {values.map((v, i) => {
          const isActive = active !== null && i === active && v !== null;
          return (
            <div
              key={`${label}-${i}`}
              className="flex items-center justify-center"
              style={{ width: cell }}
            >
              {v === null ? (
                <span className="font-mono text-[11px] text-muted/30">·</span>
              ) : (
                <motion.span
                  key={`${label}-${i}-${v}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`inline-flex min-w-[1.75rem] items-center justify-center rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                    isActive ? chip : muted
                  }`}
                >
                  {v}
                </motion.span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PointerMark({
  left,
  color,
  label,
}: {
  left: number;
  color: string;
  label: string;
}) {
  return (
    <div
      className={`absolute top-0 flex -translate-x-1/2 flex-col items-center ${color}`}
      style={{ left }}
    >
      <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
      <span className="whitespace-nowrap font-mono text-[10px] font-semibold">
        {label}
      </span>
    </div>
  );
}
