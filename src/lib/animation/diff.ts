import type { ArraySnapshot, LinkedListSnapshot, TreeSnapshot } from "@/lib/types";

export type ArrayDiff = {
  swapped?: [number, number];
  changedIndices: number[];
  pointerMoves: { name: string; from?: number; to?: number }[];
};

export function diffArray(
  prev: ArraySnapshot | null,
  next: ArraySnapshot,
): ArrayDiff {
  const changedIndices: number[] = [];
  if (!prev) {
    return { changedIndices: next.values.map((_, i) => i), pointerMoves: [] };
  }

  let swapped: [number, number] | undefined;
  for (let i = 0; i < next.values.length; i++) {
    if (prev.values[i] !== next.values[i]) changedIndices.push(i);
  }
  if (changedIndices.length === 2) {
    const [a, b] = changedIndices;
    if (prev.values[a] === next.values[b] && prev.values[b] === next.values[a]) {
      swapped = [a, b];
    }
  }

  const pointerMoves: ArrayDiff["pointerMoves"] = [];
  const names = new Set([
    ...Object.keys(prev.pointers ?? {}),
    ...Object.keys(next.pointers ?? {}),
  ]);
  for (const name of names) {
    const from = prev.pointers?.[name];
    const to = next.pointers?.[name];
    if (from !== to) pointerMoves.push({ name, from, to });
  }

  return { swapped, changedIndices, pointerMoves };
}

export type ListDiff = {
  entered: string[];
  exited: string[];
  rewired: string[];
  orderChanged: boolean;
};

export function listOrder(snap: LinkedListSnapshot): string[] {
  if (!snap.head) return [];
  const map = Object.fromEntries(snap.nodes.map((n) => [n.id, n]));
  const ids: string[] = [];
  let cur: string | null = snap.head;
  const seen = new Set<string>();
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    ids.push(cur);
    cur = map[cur]?.next ?? null;
  }
  for (const n of snap.nodes) {
    if (!seen.has(n.id)) ids.push(n.id);
  }
  return ids;
}

export function diffList(
  prev: LinkedListSnapshot | null,
  next: LinkedListSnapshot,
): ListDiff {
  if (!prev) {
    return {
      entered: next.nodes.map((n) => n.id),
      exited: [],
      rewired: [],
      orderChanged: true,
    };
  }
  const prevIds = new Set(prev.nodes.map((n) => n.id));
  const nextIds = new Set(next.nodes.map((n) => n.id));
  const entered = [...nextIds].filter((id) => !prevIds.has(id));
  const exited = [...prevIds].filter((id) => !nextIds.has(id));
  const prevMap = Object.fromEntries(prev.nodes.map((n) => [n.id, n]));
  const nextMap = Object.fromEntries(next.nodes.map((n) => [n.id, n]));
  const rewired: string[] = [];
  for (const id of nextIds) {
    if (prevMap[id] && prevMap[id].next !== nextMap[id]?.next) {
      rewired.push(id);
    }
  }
  const orderChanged =
    listOrder(prev).join(",") !== listOrder(next).join(",");
  return { entered, exited, rewired, orderChanged };
}

export type TreeLayoutPos = Record<string, { x: number; y: number }>;

export type TreeDiff = {
  entered: string[];
  exited: string[];
  moved: string[];
};

export function diffTree(
  prevIds: Set<string>,
  nextIds: Set<string>,
  prevLayout: TreeLayoutPos,
  nextLayout: TreeLayoutPos,
): TreeDiff {
  const entered = [...nextIds].filter((id) => !prevIds.has(id));
  const exited = [...prevIds].filter((id) => !nextIds.has(id));
  const moved: string[] = [];
  for (const id of nextIds) {
    if (!prevLayout[id] || !nextLayout[id]) continue;
    const dx = Math.abs(prevLayout[id].x - nextLayout[id].x);
    const dy = Math.abs(prevLayout[id].y - nextLayout[id].y);
    if (dx > 0.5 || dy > 0.5) moved.push(id);
  }
  return { entered, exited, moved };
}

export function beatDuration(speed: number): number {
  return Math.max(0.25, 0.7 / speed);
}

export type { TreeSnapshot };
