import type {
  AlgorithmModule,
  LinkedListSnapshot,
  ListNodeSnap,
  Step,
} from "@/lib/types";

export type ReverseListInput = { values: number[] };

const CODE = `def reverse_list(head):
    prev = None
    curr = head
    while curr is not None:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`

function fromValues(values: number[]): {
  nodes: ListNodeSnap[];
  head: string | null;
} {
  const nodes: ListNodeSnap[] = values.map((value, i) => ({
    id: `n${i}`,
    value,
    next: i < values.length - 1 ? `n${i + 1}` : null,
  }));
  return { nodes, head: nodes[0]?.id ?? null };
}

function cloneNodes(nodes: ListNodeSnap[]): ListNodeSnap[] {
  return nodes.map((n) => ({ ...n }));
}

function snap(
  nodes: ListNodeSnap[],
  head: string | null,
  pointers?: Record<string, string | null>,
): LinkedListSnapshot {
  return {
    nodes: cloneNodes(nodes),
    head,
    pointers: pointers ? { ...pointers } : undefined,
  };
}

export const reverseList: AlgorithmModule<ReverseListInput, LinkedListSnapshot> =
  {
    id: "reverse-list",
    engine: "linked-list",
    title: "Reverse Linked List",
    description: "Iteratively reverse next pointers using prev/curr/next.",
    complexity: { time: "O(n)", space: "O(1)" },
    defaultInput: { values: [1, 2, 3, 4, 5] },
    validateInput: (input) => {
      if (!input.values || input.values.length < 1) {
        return "Provide at least 1 node value.";
      }
      if (input.values.length > 12) return "Keep lists to 12 nodes or fewer.";
      return null;
    },
    code: CODE,
    run: (input) => {
      const steps: Step<LinkedListSnapshot>[] = [];
      const { nodes, head: initialHead } = fromValues(input.values);
      let prev: string | null = null;
      let curr: string | null = initialHead;
      let head = initialHead;
      let stepId = 0;

      const byId = () => Object.fromEntries(nodes.map((n) => [n.id, n]));

      steps.push({
        id: `s${stepId++}`,
        caption: "Initialize prev = null and curr = head.",
        highlights: { lines: [2, 3], nodes: curr ? [curr] : [] },
        snapshot: snap(nodes, head, { prev, curr }),
      });

      while (curr !== null) {
        const map = byId();
        const next = map[curr].next;

        steps.push({
          id: `s${stepId++}`,
          caption: `Save next = ${next ?? "null"}, then rewire curr.next → prev.`,
          highlights: { lines: [4, 5, 6], nodes: [curr, ...(prev ? [prev] : [])] },
          snapshot: snap(nodes, head, { prev, curr, next }),
        });

        map[curr].next = prev;
        prev = curr;
        curr = next;
        head = prev;

        steps.push({
          id: `s${stepId++}`,
          caption: `Advance: prev = ${prev}, curr = ${curr ?? "null"}.`,
          highlights: { lines: [7, 8], nodes: [prev, ...(curr ? [curr] : [])] },
          snapshot: snap(nodes, head, { prev, curr }),
        });
      }

      steps.push({
        id: `s${stepId++}`,
        caption: "Done — prev is the new head of the reversed list.",
        highlights: { lines: [9], nodes: prev ? [prev] : [] },
        snapshot: snap(nodes, head, { prev, curr }),
      });

      return steps;
    },
  };
