"use client";

import { useMemo } from "react";
import type { TreeSnapshot, StepHighlights } from "@/lib/types";
import { treeToFlow } from "@/lib/flow/toFlow";
import { FlowStage } from "@/components/stage/FlowStage";
import { StageEmpty } from "@/components/stage/StageCanvas";

type Props = {
  snapshot: TreeSnapshot | null;
  highlights?: StepHighlights;
};

export function TreeVisualizer({ snapshot, highlights }: Props) {
  const { nodes, edges } = useMemo(() => {
    if (!snapshot) return { nodes: [], edges: [] };
    return treeToFlow(snapshot, highlights);
  }, [snapshot, highlights]);

  const fitKey = useMemo(() => {
    if (!snapshot) return "empty";
    return Object.keys(snapshot.nodes).sort().join(",");
  }, [snapshot]);

  if (!snapshot) {
    return <StageEmpty label="Run to visualize the tree" />;
  }

  if (!snapshot.root) {
    return <StageEmpty label="Empty tree" />;
  }

  const visitOrder = snapshot.visitOrder ?? [];

  return (
    <div className="flex flex-col gap-0">
      <FlowStage
        nodes={nodes}
        edges={edges}
        fitKey={fitKey}
        heightClass="h-[300px]"
        status={
          visitOrder.length > 0 ? (
            <span>
              Visit:{" "}
              <span className="text-emerald">
                {visitOrder.map((id) => snapshot.nodes[id]?.value).join(" → ")}
              </span>
            </span>
          ) : (
            <span>BST structure</span>
          )
        }
      />
    </div>
  );
}
