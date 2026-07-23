import type { AlgorithmModule, EngineId } from "@/lib/types";
import { bubbleSort } from "@/lib/algorithms/arrays/bubble-sort";
import { twoPointers } from "@/lib/algorithms/arrays/two-pointers";
import { kadane } from "@/lib/algorithms/arrays/kadane";
import { reverseList } from "@/lib/algorithms/linked-list/reverse-list";
import { insertList } from "@/lib/algorithms/linked-list/insert-list";
import { bstInsert } from "@/lib/algorithms/trees/bst-insert";
import { inorderTraversal } from "@/lib/algorithms/trees/inorder";
import { validPath } from "@/lib/algorithms/graphs/valid-path";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAlgo = AlgorithmModule<any, any>;

const ALL: AnyAlgo[] = [
  bubbleSort,
  twoPointers,
  kadane,
  reverseList,
  insertList,
  bstInsert,
  inorderTraversal,
  validPath,
];

const byEngine = ALL.reduce(
  (acc, algo) => {
    if (!acc[algo.engine]) acc[algo.engine] = [];
    acc[algo.engine].push(algo);
    return acc;
  },
  {} as Record<EngineId, AnyAlgo[]>,
);

export function listAlgorithms(engine: EngineId): AnyAlgo[] {
  return byEngine[engine] ?? [];
}

export function getAlgorithm(engine: EngineId, id: string): AnyAlgo | null {
  return listAlgorithms(engine).find((a) => a.id === id) ?? null;
}

export function getAllAlgorithms(): AnyAlgo[] {
  return ALL;
}
