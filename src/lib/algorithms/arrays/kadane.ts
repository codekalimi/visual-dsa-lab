import type { AlgorithmModule, KadaneSnapshot, Step } from "@/lib/types";

export type KadaneInput = { values: number[] };

/**
 * Line map (1-based) for Monaco — matches CODE below:
 * 1  def slidingWindow(nums):
 * 2      maxSum = nums[0]
 * 3      curSum = 0
 * 4      maxL, maxR = 0, 0
 * 5      L = 0
 * 6      (blank)
 * 7      for R in range(len(nums)):
 * 8          if curSum < 0:
 * 9              curSum = 0
 * 10             L = R
 * 11         (blank)
 * 12         curSum += nums[R]
 * 13         if curSum > maxSum:
 * 14             maxSum = curSum
 * 15             maxL, maxR = L, R
 * 16         (blank)
 * 17     return [maxL, maxR]
 */
const CODE = `def slidingWindow(nums):
    maxSum = nums[0]
    curSum = 0
    maxL, maxR = 0, 0
    L = 0

    for R in range(len(nums)):
        if curSum < 0:
            curSum = 0
            L = R

        curSum += nums[R]
        if curSum > maxSum:
            maxSum = curSum
            maxL, maxR = L, R

    return [maxL, maxR]`;

function emptyHistory(n: number): (number | null)[] {
  return Array.from({ length: n }, () => null);
}

function snap(opts: {
  values: number[];
  curAt: (number | null)[];
  bestAt: (number | null)[];
  i: number | null;
  start: number;
  end: number;
  currentSum: number;
  bestSum: number;
  showCurrentBracket: boolean;
}): KadaneSnapshot {
  return {
    values: [...opts.values],
    curAt: [...opts.curAt],
    bestAt: [...opts.bestAt],
    i: opts.i,
    start: opts.start,
    end: opts.end,
    currentSum: opts.currentSum,
    bestSum: opts.bestSum,
    showCurrentBracket: opts.showCurrentBracket,
  };
}

export const kadane: AlgorithmModule<KadaneInput, KadaneSnapshot> = {
  id: "kadane",
  engine: "arrays",
  title: "Kadane (Max Subarray)",
  description:
    "Find a contiguous subarray with the largest sum using a sliding window (L / R).",
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
    const steps: Step<KadaneSnapshot>[] = [];
    const nums = [...input.values];
    const n = nums.length;
    let stepId = 0;

    if (n === 0) {
      steps.push({
        id: `s${stepId++}`,
        caption: "Empty array — nothing to scan.",
        highlights: { lines: [1] },
        snapshot: snap({
          values: [],
          curAt: [],
          bestAt: [],
          i: null,
          start: 0,
          end: 0,
          currentSum: 0,
          bestSum: 0,
          showCurrentBracket: false,
        }),
      });
      return steps;
    }

    let maxSum = nums[0];
    let curSum = 0;
    let maxL = 0;
    let maxR = 0;
    let L = 0;
    const curAt = emptyHistory(n);
    const bestAt = emptyHistory(n);

    steps.push({
      id: `s${stepId++}`,
      caption: `Init: maxSum = ${maxSum}, curSum = 0, L = maxL = maxR = 0.`,
      highlights: { lines: [2, 3, 4, 5], indices: [0] },
      snapshot: snap({
        values: nums,
        curAt,
        bestAt,
        i: null,
        start: 0,
        end: 0,
        currentSum: curSum,
        bestSum: maxSum,
        showCurrentBracket: true,
      }),
    });

    for (let R = 0; R < n; R++) {
      if (curSum < 0) {
        curSum = 0;
        L = R;
        steps.push({
          id: `s${stepId++}`,
          caption: `curSum was negative — reset curSum = 0 and move L to ${L}.`,
          highlights: { lines: [8, 9, 10], indices: [R] },
          snapshot: snap({
            values: nums,
            curAt,
            bestAt,
            i: R,
            start: L,
            end: Math.max(L, R - 1),
            currentSum: curSum,
            bestSum: maxSum,
            showCurrentBracket: true,
          }),
        });
      }

      curSum += nums[R];
      curAt[R] = curSum;
      bestAt[R] = maxSum;

      steps.push({
        id: `s${stepId++}`,
        caption: `R = ${R}: add nums[${R}] = ${nums[R]} → curSum = ${curSum}. Window [${L}…${R}].`,
        highlights: { lines: [7, 12], indices: [R] },
        snapshot: snap({
          values: nums,
          curAt,
          bestAt,
          i: R,
          start: L,
          end: R,
          currentSum: curSum,
          bestSum: maxSum,
          showCurrentBracket: true,
        }),
      });

      if (curSum > maxSum) {
        maxSum = curSum;
        maxL = L;
        maxR = R;
        bestAt[R] = maxSum;
        steps.push({
          id: `s${stepId++}`,
          caption: `New maxSum = ${maxSum}. Best window maxL…maxR = [${maxL}…${maxR}].`,
          highlights: { lines: [13, 14, 15], indices: [R] },
          snapshot: snap({
            values: nums,
            curAt,
            bestAt,
            i: R,
            start: maxL,
            end: maxR,
            currentSum: curSum,
            bestSum: maxSum,
            showCurrentBracket: true,
          }),
        });
      }
    }

    steps.push({
      id: `s${stepId++}`,
      caption: `Done. Return [maxL, maxR] = [${maxL}, ${maxR}] (maxSum = ${maxSum}).`,
      highlights: { lines: [17] },
      snapshot: snap({
        values: nums,
        curAt,
        bestAt,
        i: null,
        start: maxL,
        end: maxR,
        currentSum: curSum,
        bestSum: maxSum,
        showCurrentBracket: true,
      }),
    });

    return steps;
  },
};
