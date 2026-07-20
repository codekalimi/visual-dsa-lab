import type { AlgorithmModule, ArraySnapshot, Step } from "@/lib/types";

export type TwoPointersInput = { values: number[]; target: number };

const CODE = `def two_sum_sorted(arr, target):
    left = 0
    right = len(arr) - 1
    while left < right:
        total = arr[left] + arr[right]
        if total == target:
            return [left, right]
        if total < target:
            left += 1
        else:
            right -= 1
    return None`

function snap(
  values: number[],
  pointers: Record<string, number>,
): ArraySnapshot {
  return { values: [...values], pointers: { ...pointers } };
}

export const twoPointers: AlgorithmModule<TwoPointersInput, ArraySnapshot> = {
  id: "two-pointers",
  engine: "arrays",
  title: "Two Pointers (Pair Sum)",
  description:
    "On a sorted array, move left/right pointers to find a pair that sums to target.",
  complexity: { time: "O(n)", space: "O(1)" },
  defaultInput: { values: [1, 2, 4, 7, 11, 15], target: 15 },
  validateInput: (input) => {
    if (!input.values || input.values.length < 2) {
      return "Provide at least 2 integers (sorted ascending).";
    }
    if (input.values.length > 20) return "Keep arrays to 20 elements or fewer.";
    for (let i = 1; i < input.values.length; i++) {
      if (input.values[i] < input.values[i - 1]) {
        return "Array must be sorted in non-decreasing order.";
      }
    }
    if (!Number.isFinite(input.target)) return "Target must be a number.";
    return null;
  },
  code: CODE,
  run: (input) => {
    const steps: Step<ArraySnapshot>[] = [];
    const arr = [...input.values];
    const target = input.target;
    let left = 0;
    let right = arr.length - 1;
    let stepId = 0;

    steps.push({
      id: `s${stepId++}`,
      caption: `Sorted array ready. Looking for two numbers that sum to ${target}.`,
      highlights: { lines: [2, 3], indices: [left, right] },
      snapshot: snap(arr, { left, right }),
    });

    while (left < right) {
      const sum = arr[left] + arr[right];
      steps.push({
        id: `s${stepId++}`,
        caption: `Sum = ${arr[left]} + ${arr[right]} = ${sum} (target ${target}).`,
        highlights: { lines: [4, 5], indices: [left, right] },
        snapshot: snap(arr, { left, right }),
      });

      if (sum === target) {
        steps.push({
          id: `s${stepId++}`,
          caption: `Found pair at indices ${left} and ${right}.`,
          highlights: { lines: [6, 7], indices: [left, right] },
          snapshot: snap(arr, { left, right }),
        });
        return steps;
      }

      if (sum < target) {
        left++;
        steps.push({
          id: `s${stepId++}`,
          caption: `Sum too small — advance left pointer to index ${left}.`,
          highlights: { lines: [8, 9], indices: [left, right] },
          snapshot: snap(arr, { left, right }),
        });
      } else {
        right--;
        steps.push({
          id: `s${stepId++}`,
          caption: `Sum too large — move right pointer to index ${right}.`,
          highlights: { lines: [10, 11], indices: [left, right] },
          snapshot: snap(arr, { left, right }),
        });
      }
    }

    steps.push({
      id: `s${stepId++}`,
      caption: "Pointers crossed — no pair sums to the target.",
      highlights: { lines: [12] },
      snapshot: snap(arr, { left, right }),
    });

    return steps;
  },
};
