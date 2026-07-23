"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { AlgorithmModule, EngineId } from "@/lib/types";
import { ENGINE_META } from "@/lib/types";
import { usePlayerStore, selectCurrentStep } from "@/lib/player/store";
import { StepPlayer } from "@/components/lab/StepPlayer";
import { LabSideRail } from "@/components/lab/LabSideRail";
import { renderTeachPanel } from "@/lib/teach/registry";
import { renderVisualizer } from "@/lib/viz/registry";

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
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col xl:flex-row">
        <div className="mx-auto flex min-w-0 flex-1 flex-col gap-4 px-4 py-5 md:px-6">
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
                <p className="mt-1 max-w-2xl text-sm text-muted">
                  {algo.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge label={`Time ${algo.complexity.time}`} />
                <Badge label={`Space ${algo.complexity.space}`} />
              </div>
            </div>
          </header>

          {renderVisualizer(algo.id, algo.engine as EngineId, current)}
          <StepPlayer />
        </div>

        <LabSideRail
          code={algo.code}
          activeLines={current?.highlights.lines}
          engine={algo.engine as EngineId}
          algoId={algo.id}
          defaultInput={algo.defaultInput}
          onRun={onRun}
          error={error}
        />
      </div>

      {renderTeachPanel(algo.id)}
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-border bg-cyan-soft px-2.5 py-1 font-mono text-xs font-medium text-cyan">
      {label}
    </span>
  );
}
