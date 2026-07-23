"use client";

import dynamic from "next/dynamic";
import type { EngineId } from "@/lib/types";
import { EngineInputPanel } from "@/components/lab/InputPanel";

const MonacoCodePanel = dynamic(
  () =>
    import("@/components/lab/MonacoCodePanel").then((m) => m.MonacoCodePanel),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-muted">
        Loading editor…
      </div>
    ),
  },
);

type Props = {
  code: string;
  activeLines?: number[];
  engine: EngineId;
  algoId: string;
  defaultInput: unknown;
  onRun: (input: unknown) => void;
  error: string | null;
};

export function LabSideRail({
  code,
  activeLines,
  engine,
  algoId,
  defaultInput,
  onRun,
  error,
}: Props) {
  return (
    <aside
      className="flex w-full shrink-0 flex-col border-t border-border bg-panel xl:sticky xl:top-0 xl:h-[calc(100dvh-2.75rem)] xl:w-[420px] xl:border-t-0 xl:border-l xl:self-start"
      aria-label="Input and algorithm code"
    >
      <div className="shrink-0 border-b border-border">
        <div className="px-4 py-2.5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Input
          </p>
        </div>
        <div className="px-3 pb-3 [&_h3]:hidden">
          <EngineInputPanel
            engine={engine}
            algoId={algoId}
            defaultInput={defaultInput}
            onRun={onRun}
            error={error}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-border px-4 py-2.5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
            Code
          </p>
          <p className="mt-0.5 text-sm font-medium text-ink">algorithm.py</p>
        </div>
        <div className="min-h-[280px] flex-1 p-3 xl:min-h-0">
          <MonacoCodePanel code={code} activeLines={activeLines} fill />
        </div>
      </div>
    </aside>
  );
}
