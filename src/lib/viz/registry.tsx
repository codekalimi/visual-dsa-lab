"use client";

import type { ReactNode } from "react";
import type {
  ArraySnapshot,
  EngineId,
  GraphSnapshot,
  KadaneSnapshot,
  LinkedListSnapshot,
  Step,
  TreeSnapshot,
} from "@/lib/types";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { KadaneVisualizer } from "@/components/visualizers/KadaneVisualizer";
import { LinkedListVisualizer } from "@/components/visualizers/LinkedListVisualizer";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";
import { GraphVisualizer } from "@/components/visualizers/GraphVisualizer";

type AnyStep = Step | undefined | null;

/** Per-algorithm visualizers first; otherwise fall back by engine. */
export function renderVisualizer(
  algoId: string,
  engine: EngineId,
  step: AnyStep,
): ReactNode {
  const highlights = step?.highlights;

  if (algoId === "kadane") {
    return (
      <KadaneVisualizer
        snapshot={(step?.snapshot as KadaneSnapshot) ?? null}
        highlights={highlights}
      />
    );
  }

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
