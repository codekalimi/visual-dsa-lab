"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { motion } from "motion/react";

export type DsaNodeData = {
  label: string | number;
  badges?: string[];
  variant?:
    | "default"
    | "current"
    | "visited"
    | "frontier"
    | "source"
    | "dest"
    | "head"
    | "root"
    | "entering";
  shape?: "circle" | "rounded";
};

export type DsaFlowNode = Node<DsaNodeData, "dsa">;

const VARIANT_STYLE: Record<
  NonNullable<DsaNodeData["variant"]>,
  { fill: string; stroke: string; scale: number }
> = {
  default: {
    fill: "rgba(34,211,238,0.12)",
    stroke: "#2a313c",
    scale: 1,
  },
  current: {
    fill: "rgba(251,146,60,0.28)",
    stroke: "#fb923c",
    scale: 1.08,
  },
  visited: {
    fill: "rgba(52,211,153,0.22)",
    stroke: "#34d399",
    scale: 1,
  },
  frontier: {
    fill: "rgba(34,211,238,0.22)",
    stroke: "#22d3ee",
    scale: 1.04,
  },
  source: {
    fill: "rgba(34,211,238,0.2)",
    stroke: "#22d3ee",
    scale: 1,
  },
  dest: {
    fill: "rgba(251,113,133,0.2)",
    stroke: "#fb7185",
    scale: 1,
  },
  head: {
    fill: "rgba(34,211,238,0.2)",
    stroke: "#22d3ee",
    scale: 1,
  },
  root: {
    fill: "rgba(52,211,153,0.22)",
    stroke: "#34d399",
    scale: 1,
  },
  entering: {
    fill: "rgba(251,146,60,0.25)",
    stroke: "#fb923c",
    scale: 1.12,
  },
};

function DsaNodeComponent({ data }: NodeProps<DsaFlowNode>) {
  const variant = data.variant ?? "default";
  const style = VARIANT_STYLE[variant];
  const isCircle = data.shape !== "rounded";
  const badges = data.badges ?? [];

  return (
    <div className="relative flex flex-col items-center">
      {badges.length > 0 && (
        <div className="absolute -top-5 flex gap-1 font-mono text-[10px] font-bold text-cyan">
          {badges.map((b) => (
            <motion.span
              key={b}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={
                b === "dest" || b === "tail"
                  ? "text-rose"
                  : b === "root" || b === "visited"
                    ? "text-emerald"
                    : "text-cyan"
              }
            >
              {b}
            </motion.span>
          ))}
        </div>
      )}
      <motion.div
        layout
        initial={{ scale: 0.55, opacity: 0 }}
        animate={{
          scale: style.scale,
          opacity: 1,
          backgroundColor: style.fill,
          borderColor: style.stroke,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className={`flex items-center justify-center border-2 font-mono text-sm font-bold text-ink shadow-[0_0_18px_rgba(34,211,238,0.08)] ${
          isCircle ? "h-11 w-11 rounded-full" : "h-11 w-11 rounded-lg"
        }`}
      >
        {data.label}
      </motion.div>
      <Handle
        type="target"
        position={Position.Left}
        className="!h-1.5 !w-1.5 !border-0 !bg-transparent"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-1.5 !w-1.5 !border-0 !bg-transparent"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!h-1.5 !w-1.5 !border-0 !bg-transparent"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!h-1.5 !w-1.5 !border-0 !bg-transparent"
      />
    </div>
  );
}

export const DsaNode = memo(DsaNodeComponent);

export const dsaNodeTypes = {
  dsa: DsaNode,
};
