"use client";

import { LabShell } from "@/components/lab/LabShell";
import { getAlgorithm } from "@/lib/catalog";
import type { EngineId } from "@/lib/types";
import { ENGINE_META } from "@/lib/types";
import Link from "next/link";

type Props = {
  engine: EngineId;
  algoId: string;
};

export function AlgorithmPage({ engine, algoId }: Props) {
  const algo = getAlgorithm(engine, algoId);
  if (!algo) {
    const meta = ENGINE_META[engine];
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-ink">Algorithm not found</h1>
        <p className="mt-2 text-sm text-muted">
          “{algoId}” is not available in the {meta.label} engine. Each engine
          only hosts problems for its own structure.
        </p>
        <Link
          href={meta.href}
          className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Back to {meta.label}
        </Link>
      </div>
    );
  }
  return <LabShell key={`${algo.engine}-${algo.id}`} algo={algo} />;
}
