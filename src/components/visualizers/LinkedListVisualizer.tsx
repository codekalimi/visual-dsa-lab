"use client";

import { useMemo } from "react";
import type { LinkedListSnapshot, StepHighlights } from "@/lib/types";
import { linkedListToFlow } from "@/lib/flow/toFlow";
import { FlowStage } from "@/components/stage/FlowStage";
import { StageEmpty } from "@/components/stage/StageCanvas";

type Props = {
  snapshot: LinkedListSnapshot | null;
  highlights?: StepHighlights;
};

export function LinkedListVisualizer({ snapshot, highlights }: Props) {
  const { nodes, edges } = useMemo(() => {
    if (!snapshot) return { nodes: [], edges: [] };
    return linkedListToFlow(snapshot, highlights);
  }, [snapshot, highlights]);

  const fitKey = useMemo(() => {
    if (!snapshot) return "empty";
    return snapshot.nodes
      .map((n) => n.id)
      .sort()
      .join(",");
  }, [snapshot]);

  if (!snapshot) {
    return <StageEmpty label="Run to visualize the linked list" />;
  }

  if (snapshot.nodes.length === 0) {
    return <StageEmpty label="Empty list (head = null)" />;
  }

  return (
    <FlowStage
      nodes={nodes}
      edges={edges}
      fitKey={fitKey}
      heightClass="h-[260px]"
      status={
        <span>
          head:{" "}
          <span className="text-cyan">{snapshot.head ?? "null"}</span>
        </span>
      }
    />
  );
}
