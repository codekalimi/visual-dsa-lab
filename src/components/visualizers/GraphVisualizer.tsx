"use client";

import { useMemo } from "react";
import type { GraphSnapshot, StepHighlights } from "@/lib/types";
import { graphToFlow } from "@/lib/flow/toFlow";
import { FlowStage } from "@/components/stage/FlowStage";
import { StageEmpty } from "@/components/stage/StageCanvas";

type Props = {
  snapshot: GraphSnapshot | null;
  highlights?: StepHighlights;
};

export function GraphVisualizer({ snapshot, highlights }: Props) {
  const { nodes, edges } = useMemo(() => {
    if (!snapshot) return { nodes: [], edges: [] };
    return graphToFlow(snapshot, highlights);
  }, [snapshot, highlights]);

  const fitKey = useMemo(() => {
    if (!snapshot) return "empty";
    return `${snapshot.n}-${snapshot.edges.map((e) => e.id).join(",")}-${snapshot.source}-${snapshot.destination}`;
  }, [snapshot]);

  if (!snapshot) {
    return <StageEmpty label="Run to visualize the graph" />;
  }

  return (
    <FlowStage
      nodes={nodes}
      edges={edges}
      fitKey={fitKey}
      heightClass="h-[320px]"
      status={
        <>
          <span>
            queue:{" "}
            <span className="text-cyan">
              [{snapshot.queue.join(", ") || "∅"}]
            </span>
          </span>
          <span>
            visited:{" "}
            <span className="text-emerald">
              {"{" + snapshot.visited.join(", ") + "}"}
            </span>
          </span>
          {snapshot.found === true && (
            <span className="text-emerald">path found</span>
          )}
          {snapshot.found === false && (
            <span className="text-rose">no path</span>
          )}
        </>
      }
    />
  );
}
