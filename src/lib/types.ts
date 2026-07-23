/** Line numbers in highlights.lines are 1-based (Monaco convention). */

export type EngineId = "arrays" | "linked-list" | "trees" | "graphs";

export type StepHighlights = {
  /** 1-based line numbers for Monaco */
  lines?: number[];
  indices?: number[];
  nodes?: string[];
  edges?: string[];
};

export type Step<TSnapshot = unknown> = {
  id: string;
  caption: string;
  highlights: StepHighlights;
  snapshot: TSnapshot;
};

export type AlgorithmModule<TInput = unknown, TSnapshot = unknown> = {
  id: string;
  engine: EngineId;
  title: string;
  description: string;
  complexity: { time: string; space: string };
  defaultInput: TInput;
  validateInput: (input: TInput) => string | null;
  code: string;
  run: (input: TInput) => Step<TSnapshot>[];
};

export type ArraySnapshot = {
  values: number[];
  sortedUpTo?: number;
  pointers?: Record<string, number>;
  /** Best-known or current candidate subarray range (inclusive). */
  window?: { start: number; end: number };
  /** Optional second range (e.g. current window while window = best). */
  currentWindow?: { start: number; end: number };
  metrics?: { currentSum: number; bestSum: number };
};

/** Kadane-only snapshot for the per-index cur/best live visualization. */
export type KadaneSnapshot = {
  values: number[];
  /** cur after processing index i; null = not yet visited */
  curAt: (number | null)[];
  bestAt: (number | null)[];
  /** Active loop index (null on empty / final done-only frames) */
  i: number | null;
  start: number;
  end: number;
  currentSum: number;
  bestSum: number;
  showCurrentBracket: boolean;
};

export type ListNodeSnap = {
  id: string;
  value: number;
  next: string | null;
};

export type LinkedListSnapshot = {
  nodes: ListNodeSnap[];
  head: string | null;
  pointers?: Record<string, string | null>;
};

export type TreeNodeSnap = {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
};

export type TreeSnapshot = {
  nodes: Record<string, TreeNodeSnap>;
  root: string | null;
  visitOrder?: string[];
};

export type GraphSnapshot = {
  n: number;
  nodes: number[];
  edges: { id: string; source: number; target: number }[];
  visited: number[];
  queue: number[];
  current: number | null;
  source: number;
  destination: number;
  activeEdge?: string | null;
  found?: boolean | null;
};

export const ENGINE_META: Record<
  EngineId,
  { label: string; href: string; blurb: string }
> = {
  arrays: {
    label: "Arrays",
    href: "/arrays",
    blurb: "Sorting, pointers, and in-place mutations on linear memory.",
  },
  "linked-list": {
    label: "Linked List",
    href: "/linked-list",
    blurb: "Pointer rewiring, reversal, and positional inserts.",
  },
  trees: {
    label: "Trees",
    href: "/trees",
    blurb: "BST growth and recursive traversals.",
  },
  graphs: {
    label: "Graphs",
    href: "/graphs",
    blurb: "Connectivity, BFS frontiers, and path existence.",
  },
};

export const ENGINE_ORDER: EngineId[] = [
  "arrays",
  "linked-list",
  "trees",
  "graphs",
];
