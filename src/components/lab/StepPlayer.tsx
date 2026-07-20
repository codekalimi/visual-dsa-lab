"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/lib/player/store";
import { usePlaybackBeat } from "@/lib/animation/useStepTimeline";

export function StepPlayer() {
  usePlaybackBeat();

  const steps = usePlayerStore((s) => s.steps);
  const index = usePlayerStore((s) => s.index);
  const playing = usePlayerStore((s) => s.playing);
  const speed = usePlayerStore((s) => s.speed);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const toggle = usePlayerStore((s) => s.toggle);
  const setIndex = usePlayerStore((s) => s.setIndex);
  const setSpeed = usePlayerStore((s) => s.setSpeed);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, next, prev]);

  const disabled = steps.length === 0;
  const caption = steps[index]?.caption ?? "Run the algorithm to generate steps.";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-panel-2 p-3">
      <p className="min-h-[2.5rem] text-sm leading-relaxed text-ink">
        <span className="mr-2 font-mono text-xs text-cyan">
          {disabled ? "—" : `${index + 1}/${steps.length}`}
        </span>
        <span className="text-muted">{caption}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={prev}
          className="rounded-lg border border-border bg-panel px-3 py-1.5 text-sm font-medium text-ink disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={toggle}
          className="rounded-lg bg-cyan px-4 py-1.5 text-sm font-semibold text-background disabled:opacity-40"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={next}
          className="rounded-lg border border-border bg-panel px-3 py-1.5 text-sm font-medium text-ink disabled:opacity-40"
        >
          Next
        </button>

        <label className="ml-auto flex items-center gap-2 text-xs text-muted">
          Speed
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded-md border border-border bg-panel px-2 py-1 text-ink"
          >
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
            <option value={1.5}>1.5×</option>
            <option value={2}>2×</option>
            <option value={3}>3×</option>
          </select>
        </label>
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(0, steps.length - 1)}
        value={disabled ? 0 : index}
        disabled={disabled}
        onChange={(e) => setIndex(Number(e.target.value))}
        className="w-full accent-[var(--cyan)]"
        aria-label="Step scrubber"
      />
      <p className="text-[11px] text-muted">
        Shortcuts: Space play/pause · ← → step
      </p>
    </div>
  );
}
