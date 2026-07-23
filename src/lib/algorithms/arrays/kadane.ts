import type { AlgorithmModule, ArraySnapshot, Step } from "@/lib/types";

export type KadaneInput = { values: number[] };

/**
 * Line map (1-based) for Monaco:
 * 1 def
 * 2 best = cur = ...
 * 3 start = end = cur_start = 0
 * 4 for i ...
 * 5 if cur + nums[i] < nums[i]:
 * 6     cur = nums[i]
 * 7     cur_start = i
 * 8 else:
 * 9     cur += nums[i]
 * 10 if cur > best:
 * 11    best = cur
 * 12    start, end = cur_start, i
 * 13 return best
 */
const CODE = `def max_subarray(nums):
    best = cur = nums[0]
    start = end = cur_start = 0
    for i in range(1, len(nums)):
        if cur + nums[i] < nums[i]:
            cur = nums[i]
            cur_start = i
        else:
            cur += nums[i]
        if cur > best:
            best = cur
            start, end = cur_start, i
    return best`;

function snap(
  values: number[],
  pointers: Record<string, number> | undefined,
  currentWindow: { start: number; end: number } | undefined,
  bestWindow: { start: number; end: number } | undefined,
  metrics: { currentSum: number; bestSum: number } | undefined,
): ArraySnapshot {
  return {
    values: [...values],
    pointers: pointers ? { ...pointers } : undefined,
    currentWindow: currentWindow ? { ...currentWindow } : undefined,
    window: bestWindow ? { ...bestWindow } : undefined,
    metrics: metrics ? { ...metrics } : undefined,
  };
}

export const kadane: AlgorithmModule<KadaneInput, ArraySnapshot> = {
  id: "kadane",
  engine: "arrays",
  title: "Kadane (Max Subarray)",
  description:
    "Find a contiguous subarray with the largest sum in one left-to-right pass.",
  complexity: { time: "O(n)", space: "O(1)" },
  defaultInput: { values: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
  validateInput: (input) => {
    if (!input.values || input.values.length < 1) {
      return "Provide at least 1 integer.";
    }
    if (input.values.length > 16) return "Keep arrays to 16 elements or fewer.";
    return null;
  },
  code: CODE,
  run: (input) => {
    const steps: Step<ArraySnapshot>[] = [];
    const nums = [...input.values];
    let stepId = 0;

    if (nums.length === 0) {
      steps.push({
        id: `s${stepId++}`,
        caption: "Empty array — nothing to scan.",
        highlights: { lines: [1] },
        snapshot: snap([], undefined, undefined, undefined, undefined),
      });
      return steps;
    }

    let best = nums[0];
    let cur = nums[0];
    let start = 0;
    let end = 0;
    let curStart = 0;

    steps.push({
      id: `s${stepId++}`,
      caption: `Seed: cur = best = ${nums[0]} at index 0. Window is just [0].`,
      highlights: { lines: [2, 3], indices: [0] },
      snapshot: snap(
        nums,
        { i: 0, cs: 0 },
        { start: 0, end: 0 },
        { start: 0, end: 0 },
        { currentSum: cur, bestSum: best },
      ),
    });

    for (let i = 1; i < nums.length; i++) {
      const extend = cur + nums[i];
      const alone = nums[i];

      steps.push({
        id: `s${stepId++}`,
        caption: `At i=${i} (value ${nums[i]}): compare extend ${extend} vs restart ${alone}.`,
        highlights: { lines: [4, 5], indices: [i] },
        snapshot: snap(
          nums,
          { i, cs: curStart },
          { start: curStart, end: i - 1 },
          { start, end },
          { currentSum: cur, bestSum: best },
        ),
      });

      if (extend < alone) {
        cur = alone;
        curStart = i;
        steps.push({
          id: `s${stepId++}`,
          caption: `Restart at i=${i} — starting fresh beats extending (${alone} > ${extend}).`,
          highlights: { lines: [5, 6, 7], indices: [i] },
          snapshot: snap(
            nums,
            { i, cs: curStart },
            { start: curStart, end: i },
            { start, end },
            { currentSum: cur, bestSum: best },
          ),
        });
      } else {
        cur = extend;
        steps.push({
          id: `s${stepId++}`,
          caption: `Extend window — cur becomes ${cur}.`,
          highlights: { lines: [8, 9], indices: [i] },
          snapshot: snap(
            nums,
            { i, cs: curStart },
            { start: curStart, end: i },
            { start, end },
            { currentSum: cur, bestSum: best },
          ),
        });
      }

      if (cur > best) {
        best = cur;
        start = curStart;
        end = i;
        steps.push({
          id: `s${stepId++}`,
          caption: `New best ${best} — best window is [${start}…${end}].`,
          highlights: { lines: [10, 11, 12], indices: [i] },
          snapshot: snap(
            nums,
            { i, cs: curStart },
            { start: curStart, end: i },
            { start, end },
            { currentSum: cur, bestSum: best },
          ),
        });
      }
    }

    steps.push({
      id: `s${stepId++}`,
      caption: `Done. Max subarray sum = ${best} on indices [${start}…${end}].`,
      highlights: { lines: [13] },
      snapshot: snap(
        nums,
        undefined,
        undefined,
        { start, end },
        { currentSum: cur, bestSum: best },
      ),
    });

    return steps;
  },
};
