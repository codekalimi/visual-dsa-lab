import type { AlgorithmModule, ArraySnapshot, Step } from "@/lib/types";

export type BubbleSortInput = { values: number[] };

const CODE = `def bubble_sort(arr):
    a = list(arr)
    n = len(a)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                tmp = a[j]
                a[j] = a[j + 1]
                a[j + 1] = tmp
    return a`

function snap(
  values: number[],
  sortedUpTo: number | undefined,
  pointers: Record<string, number> | undefined,
): ArraySnapshot {
  return {
    values: [...values],
    sortedUpTo,
    pointers: pointers ? { ...pointers } : undefined,
  };
}

export const bubbleSort: AlgorithmModule<BubbleSortInput, ArraySnapshot> = {
  id: "bubble-sort",
  engine: "arrays",
  title: "Bubble Sort",
  description: "Repeatedly swap adjacent out-of-order pairs until the array is sorted.",
  complexity: { time: "O(n²)", space: "O(1)" },
  defaultInput: { values: [5, 3, 8, 4, 2] },
  validateInput: (input) => {
    if (!input.values || input.values.length < 2) {
      return "Provide at least 2 integers.";
    }
    if (input.values.length > 16) return "Keep arrays to 16 elements or fewer.";
    return null;
  },
  code: CODE,
  run: (input) => {
    const steps: Step<ArraySnapshot>[] = [];
    const a = [...input.values];
    const n = a.length;
    let stepId = 0;

    steps.push({
      id: `s${stepId++}`,
      caption: "Start with the input array. We will bubble larger values right.",
      highlights: { lines: [2] },
      snapshot: snap(a, undefined, undefined),
    });

    for (let i = 0; i < n - 1; i++) {
      steps.push({
        id: `s${stepId++}`,
        caption: `Pass ${i + 1}: the last ${i} element(s) are already in final place.`,
        highlights: { lines: [4], indices: [] },
        snapshot: snap(a, i === 0 ? undefined : n - i, { i }),
      });

      for (let j = 0; j < n - 1 - i; j++) {
        steps.push({
          id: `s${stepId++}`,
          caption: `Compare indices ${j} and ${j + 1} (${a[j]} vs ${a[j + 1]}).`,
          highlights: { lines: [5, 6], indices: [j, j + 1] },
          snapshot: snap(a, i === 0 ? undefined : n - i, { i, j, j1: j + 1 }),
        });

        if (a[j] > a[j + 1]) {
          const tmp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = tmp;
          steps.push({
            id: `s${stepId++}`,
            caption: `Swap — ${a[j + 1]} was larger, so it moves right.`,
            highlights: { lines: [7, 8, 9], indices: [j, j + 1] },
            snapshot: snap(a, i === 0 ? undefined : n - i, { i, j, j1: j + 1 }),
          });
        }
      }
    }

    steps.push({
      id: `s${stepId++}`,
      caption: "Array is fully sorted.",
      highlights: { lines: [10] },
      snapshot: snap(a, 0, undefined),
    });

    return steps;
  },
};
