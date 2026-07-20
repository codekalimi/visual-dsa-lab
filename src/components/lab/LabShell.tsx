"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import type { AlgorithmModule, EngineId } from "@/lib/types";
import { ENGINE_META } from "@/lib/types";
import { usePlayerStore, selectCurrentStep } from "@/lib/player/store";
import { StepPlayer } from "@/components/lab/StepPlayer";
import { EngineInputPanel } from "@/components/lab/InputPanel";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { LinkedListVisualizer } from "@/components/visualizers/LinkedListVisualizer";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";
import { GraphVisualizer } from "@/components/visualizers/GraphVisualizer";
import type {
  ArraySnapshot,
  GraphSnapshot,
  LinkedListSnapshot,
  TreeSnapshot,
} from "@/lib/types";

const MonacoCodePanel = dynamic(
  () =>
    import("@/components/lab/MonacoCodePanel").then((m) => m.MonacoCodePanel),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-border bg-panel text-sm text-muted">
        Loading editor…
      </div>
    ),
  },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAlgo = AlgorithmModule<any, any>;

type Props = {
  algo: AnyAlgo;
};

export function LabShell({ algo }: Props) {
  const setSteps = usePlayerStore((s) => s.setSteps);
  const reset = usePlayerStore((s) => s.reset);
  const current = usePlayerStore(selectCurrentStep);
  const [error, setError] = useState<string | null>(null);
  const [toolsOpen, setToolsOpen] = useState(true);

  useEffect(() => {
    const steps = algo.run(algo.defaultInput);
    setSteps(steps);
    return () => reset();
  }, [algo, reset, setSteps]);

  const onRun = useCallback(
    (input: unknown) => {
      const maybe = input as { __parseError?: string };
      if (maybe?.__parseError) {
        setError(maybe.__parseError);
        return;
      }
      const validation = algo.validateInput(input);
      if (validation) {
        setError(validation);
        return;
      }
      setError(null);
      setSteps(algo.run(input));
    },
    [algo, setSteps],
  );

  const meta = ENGINE_META[algo.engine as EngineId];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 md:px-6">
      <header className="flex flex-col gap-2">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-cyan">
            Lab
          </Link>
          <span>/</span>
          <Link href={meta.href} className="hover:text-cyan">
            {meta.label}
          </Link>
          <span>/</span>
          <span className="text-ink">{algo.title}</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
              {algo.title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted">{algo.description}</p>
          </div>
          <div className="flex gap-2">
            <Badge label={`Time ${algo.complexity.time}`} />
            <Badge label={`Space ${algo.complexity.space}`} />
          </div>
        </div>
      </header>

      {/* Hero stage */}
      <Visualizer engine={algo.engine} step={current} />
      <StepPlayer />

      {/* Secondary: inputs + code */}
      <div className="rounded-xl border border-border bg-panel">
        <button
          type="button"
          onClick={() => setToolsOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-ink"
        >
          <span>Input &amp; code</span>
          <span className="text-muted">{toolsOpen ? "▾" : "▸"}</span>
        </button>
        {toolsOpen && (
          <div className="grid gap-4 border-t border-border p-4 lg:grid-cols-2">
            <EngineInputPanel
              engine={algo.engine}
              algoId={algo.id}
              defaultInput={algo.defaultInput}
              onRun={onRun}
              error={error}
            />
            <div className="min-h-[260px]">
              <MonacoCodePanel
                code={algo.code}
                activeLines={current?.highlights.lines}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border bg-cyan-soft px-3 py-1 font-mono text-xs font-medium text-cyan">
      {label}
    </span>
  );
}

function Visualizer({
  engine,
  step,
}: {
  engine: EngineId;
  step: ReturnType<typeof selectCurrentStep>;
}) {
  const highlights = step?.highlights;
  if (engine === "arrays") {
    return (
      <ArrayVisualizer
        snapshot={(step?.snapshot as ArraySnapshot) ?? null}
        highlights={highlights}
      />
    );
  }
  if (engine === "linked-list") {
    return (
      <LinkedListVisualizer
        snapshot={(step?.snapshot as LinkedListSnapshot) ?? null}
        highlights={highlights}
      />
    );
  }
  if (engine === "trees") {
    return (
      <TreeVisualizer
        snapshot={(step?.snapshot as TreeSnapshot) ?? null}
        highlights={highlights}
      />
    );
  }
  return (
    <GraphVisualizer
      snapshot={(step?.snapshot as GraphSnapshot) ?? null}
      highlights={highlights}
    />
  );
}
