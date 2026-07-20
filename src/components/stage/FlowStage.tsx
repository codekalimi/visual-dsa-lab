"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  ReactFlow,
  Background,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from "@xyflow/react";
import { dsaNodeTypes } from "@/components/flow/DsaNode";
import { StageCanvas } from "@/components/stage/StageCanvas";

type Props = {
  nodes: Node[];
  edges: Edge[];
  /** Change when a new Run happens to refit the camera once */
  fitKey?: string | number;
  heightClass?: string;
  status?: ReactNode;
};

export function FlowStage({
  nodes: incomingNodes,
  edges: incomingEdges,
  fitKey,
  heightClass = "h-[300px]",
  status,
}: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(incomingNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(incomingEdges);
  const instanceRef = useRef<ReactFlowInstance | null>(null);
  const lastFitKey = useRef<string | number | undefined>(undefined);

  useEffect(() => {
    setNodes(incomingNodes);
    setEdges(incomingEdges);
  }, [incomingNodes, incomingEdges, setNodes, setEdges]);

  useEffect(() => {
    if (fitKey === undefined || fitKey === lastFitKey.current) return;
    lastFitKey.current = fitKey;
    const t = window.setTimeout(() => {
      instanceRef.current?.fitView({ padding: 0.28, duration: 280 });
    }, 40);
    return () => window.clearTimeout(t);
  }, [fitKey, incomingNodes.length]);

  return (
    <StageCanvas minHeight="min-h-[320px]">
      {status && (
        <div className="flex flex-wrap gap-3 border-b border-border/60 px-3 py-2 font-mono text-[11px] text-muted">
          {status}
        </div>
      )}
      <div className={`rf-stage w-full ${heightClass}`}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={dsaNodeTypes}
          onInit={(inst) => {
            instanceRef.current = inst;
            inst.fitView({ padding: 0.28 });
          }}
          fitView
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag
          zoomOnScroll
          minZoom={0.4}
          maxZoom={1.8}
        >
          <Background gap={20} color="rgba(232,238,244,0.04)" />
        </ReactFlow>
      </div>
    </StageCanvas>
  );
}
