import type { Edge, Node } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";
import type {
  GraphSnapshot,
  LinkedListSnapshot,
  StepHighlights,
  TreeSnapshot,
} from "@/lib/types";
import { listOrder } from "@/lib/animation/diff";
import type { DsaNodeData } from "@/components/flow/DsaNode";
import { hierarchy, tree as d3tree } from "d3";

const LIST_GAP = 120;
const LIST_Y = 80;

export function linkedListToFlow(
  snapshot: LinkedListSnapshot,
  highlights?: StepHighlights,
  enteringIds: string[] = [],
): { nodes: Node<DsaNodeData>[]; edges: Edge[] } {
  const order = listOrder(snapshot);
  const map = Object.fromEntries(snapshot.nodes.map((n) => [n.id, n]));
  const hi = new Set(highlights?.nodes ?? []);
  const pointers = snapshot.pointers ?? {};

  const nodes: Node<DsaNodeData>[] = order.map((id, i) => {
    const labels = Object.entries(pointers)
      .filter(([, pid]) => pid === id)
      .map(([name]) => name);
    if (snapshot.head === id && !labels.includes("head")) labels.unshift("head");

    let variant: DsaNodeData["variant"] = "default";
    if (enteringIds.includes(id)) variant = "entering";
    else if (hi.has(id)) variant = "current";
    else if (snapshot.head === id) variant = "head";

    return {
      id,
      type: "dsa",
      position: { x: 40 + i * LIST_GAP, y: LIST_Y },
      data: {
        label: map[id]?.value ?? id,
        badges: labels,
        variant,
        shape: "circle",
      },
      draggable: false,
      selectable: false,
    };
  });

  const edges: Edge[] = [];
  for (const id of order) {
    const next = map[id]?.next;
    if (!next || !order.includes(next)) continue;
    const active =
      highlights?.edges?.includes(`${id}->${next}`) ||
      highlights?.edges?.includes(id) ||
      (hi.has(id) && hi.has(next));
    edges.push({
      id: `${id}->${next}`,
      source: id,
      target: next,
      animated: Boolean(active),
      style: {
        stroke: active ? "#fb923c" : "#8b98a8",
        strokeWidth: active ? 2.5 : 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: active ? "#fb923c" : "#8b98a8",
        width: 16,
        height: 16,
      },
    });
  }

  return { nodes, edges };
}

type HDatum = { id: string; value: number; children?: HDatum[] };

export function treeToFlow(
  snapshot: TreeSnapshot,
  highlights?: StepHighlights,
): { nodes: Node<DsaNodeData>[]; edges: Edge[] } {
  if (!snapshot.root) return { nodes: [], edges: [] };

  const { nodes: nodeMap, root } = snapshot;
  const hi = new Set(highlights?.nodes ?? []);
  const visited = new Set(snapshot.visitOrder ?? []);
  const currentVisit =
    snapshot.visitOrder && snapshot.visitOrder.length > 0
      ? snapshot.visitOrder[snapshot.visitOrder.length - 1]
      : null;

  function toH(id: string): HDatum {
    const n = nodeMap[id];
    const children: HDatum[] = [];
    if (n.left) children.push(toH(n.left));
    if (n.right) children.push(toH(n.right));
    return {
      id,
      value: n.value,
      children: children.length ? children : undefined,
    };
  }

  const rootH = hierarchy(toH(root));
  d3tree<HDatum>().nodeSize([90, 90])(rootH);

  let minX = Infinity;
  rootH.each((d) => {
    minX = Math.min(minX, d.x!);
  });
  const pad = 40;

  const nodes: Node<DsaNodeData>[] = rootH.descendants().map((d) => {
    const id = d.data.id;
    const isRoot = id === root;
    const badges: string[] = [];
    if (isRoot) badges.push("root");

    let variant: DsaNodeData["variant"] = "default";
    if (hi.has(id) || id === currentVisit) variant = "current";
    else if (visited.has(id)) variant = "visited";
    else if (isRoot) variant = "root";

    return {
      id,
      type: "dsa",
      position: {
        x: d.x! - minX + pad,
        y: d.y! + pad,
      },
      data: {
        label: d.data.value,
        badges,
        variant,
        shape: "circle",
      },
      draggable: false,
      selectable: false,
    };
  });

  const edges: Edge[] = rootH.links().map((l) => {
    const active =
      hi.has(l.source.data.id) || hi.has(l.target.data.id);
    return {
      id: `${l.source.data.id}->${l.target.data.id}`,
      source: l.source.data.id,
      target: l.target.data.id,
      sourceHandle: "bottom",
      targetHandle: "top",
      animated: active,
      style: {
        stroke: active ? "#fb923c" : "#8b98a8",
        strokeWidth: active ? 2.5 : 2,
      },
    };
  });

  return { nodes, edges };
}

function layoutCircle(
  ids: number[],
  cx: number,
  cy: number,
  r: number,
): Record<number, { x: number; y: number }> {
  const list = Array.isArray(ids)
    ? ids
    : Array.from({ length: Number(ids) || 0 }, (_, i) => i);
  const pos: Record<number, { x: number; y: number }> = {};
  const n = list.length || 1;
  list.forEach((id, i) => {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    pos[id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  return pos;
}

export function graphToFlow(
  snapshot: GraphSnapshot,
  highlights?: StepHighlights,
): { nodes: Node<DsaNodeData>[]; edges: Edge[] } {
  const nodeIds: number[] = Array.isArray(snapshot.nodes)
    ? snapshot.nodes
    : Array.from({ length: snapshot.n }, (_, i) => i);
  const positions = layoutCircle(nodeIds, 0, 0, 140);
  const hi = new Set(
    (highlights?.nodes ?? []).map(Number).filter((x) => !Number.isNaN(x)),
  );
  const visited = new Set(snapshot.visited);
  const queue = new Set(snapshot.queue);
  const activeEdge = snapshot.activeEdge;

  const nodes: Node<DsaNodeData>[] = nodeIds.map((id) => {
    const badges: string[] = [];
    if (id === snapshot.source) badges.push("source");
    if (id === snapshot.destination) badges.push("dest");

    let variant: DsaNodeData["variant"] = "default";
    if (snapshot.current === id || hi.has(id)) variant = "current";
    else if (queue.has(id)) variant = "frontier";
    else if (visited.has(id)) variant = "visited";
    else if (id === snapshot.source) variant = "source";
    else if (id === snapshot.destination) variant = "dest";

    if (snapshot.found === true && id === snapshot.destination) {
      variant = "visited";
    }

    const p = positions[id];
    return {
      id: String(id),
      type: "dsa",
      position: { x: 220 + p.x, y: 140 + p.y },
      data: {
        label: id,
        badges,
        variant,
        shape: "circle",
      },
      draggable: false,
      selectable: false,
    };
  });

  const edges: Edge[] = snapshot.edges.map((e) => {
    const active =
      activeEdge === e.id || highlights?.edges?.includes(e.id);
    return {
      id: e.id,
      source: String(e.source),
      target: String(e.target),
      animated: Boolean(active),
      style: {
        stroke: active ? "#fb923c" : "#8b98a8",
        strokeWidth: active ? 3 : 2,
      },
    };
  });

  return { nodes, edges };
}
