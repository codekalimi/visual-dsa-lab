import type {
  AlgorithmModule,
  LinkedListSnapshot,
  ListNodeSnap,
  Step,
} from "@/lib/types";

export type InsertListInput = {
  values: number[];
  value: number;
  index: number;
};

const CODE = `def insert_at(head, value, index):
    node = Node(value)
    if index == 0:
        node.next = head
        return node
    curr = head
    for i in range(index - 1):
        curr = curr.next
    node.next = curr.next
    curr.next = node
    return head`

function fromValues(values: number[]): ListNodeSnap[] {
  return values.map((value, i) => ({
    id: `n${i}`,
    value,
    next: i < values.length - 1 ? `n${i + 1}` : null,
  }));
}

function snap(
  nodes: ListNodeSnap[],
  head: string | null,
  pointers?: Record<string, string | null>,
): LinkedListSnapshot {
  return {
    nodes: nodes.map((n) => ({ ...n })),
    head,
    pointers: pointers ? { ...pointers } : undefined,
  };
}

export const insertList: AlgorithmModule<InsertListInput, LinkedListSnapshot> = {
  id: "insert-list",
  engine: "linked-list",
  title: "Insert at Position",
  description: "Walk to index − 1, then splice a new node into the chain.",
  complexity: { time: "O(n)", space: "O(1)" },
  defaultInput: { values: [10, 20, 30, 40], value: 25, index: 2 },
  validateInput: (input) => {
    if (!input.values) return "Provide node values.";
    if (input.values.length > 12) return "Keep lists to 12 nodes or fewer.";
    if (!Number.isInteger(input.index) || input.index < 0) {
      return "Index must be a non-negative integer.";
    }
    if (input.index > input.values.length) {
      return `Index must be between 0 and ${input.values.length}.`;
    }
    if (!Number.isFinite(input.value)) return "Insert value must be a number.";
    return null;
  },
  code: CODE,
  run: (input) => {
    const steps: Step<LinkedListSnapshot>[] = [];
    const nodes = fromValues(input.values);
    let head: string | null = nodes[0]?.id ?? null;
    const newId = `n${nodes.length}`;
    let stepId = 0;

    steps.push({
      id: `s${stepId++}`,
      caption: `Create new node ${input.value}. Insert at index ${input.index}.`,
      highlights: { lines: [2], nodes: head ? [head] : [] },
      snapshot: snap(nodes, head),
    });

    if (input.index === 0) {
      nodes.push({ id: newId, value: input.value, next: head });
      head = newId;
      steps.push({
        id: `s${stepId++}`,
        caption: "Index 0 — new node becomes head.",
        highlights: { lines: [3, 4, 5], nodes: [newId] },
        snapshot: snap(nodes, head, { node: newId }),
      });
      return steps;
    }

    let curr: string | null = head;
    steps.push({
      id: `s${stepId++}`,
      caption: "Start at head; walk to the node before the insert point.",
      highlights: { lines: [6], nodes: curr ? [curr] : [] },
      snapshot: snap(nodes, head, { curr }),
    });

    for (let i = 0; i < input.index - 1; i++) {
      const map = Object.fromEntries(nodes.map((n) => [n.id, n]));
      if (!curr || !map[curr]) break;
      curr = map[curr].next;
      steps.push({
        id: `s${stepId++}`,
        caption: `Move curr forward (step ${i + 1} of ${input.index - 1}).`,
        highlights: { lines: [7, 8], nodes: curr ? [curr] : [] },
        snapshot: snap(nodes, head, { curr }),
      });
    }

    if (!curr) {
      steps.push({
        id: `s${stepId++}`,
        caption: "Could not reach insert position.",
        highlights: { lines: [7] },
        snapshot: snap(nodes, head),
      });
      return steps;
    }

    const map = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const oldNext = map[curr].next;
    nodes.push({ id: newId, value: input.value, next: oldNext });
    map[curr].next = newId;

    steps.push({
      id: `s${stepId++}`,
      caption: `Splice: node.next = curr.next, then curr.next = node.`,
      highlights: { lines: [9, 10], nodes: [curr, newId] },
      snapshot: snap(nodes, head, { curr, node: newId }),
    });

    steps.push({
      id: `s${stepId++}`,
      caption: "Insert complete — list structure updated.",
      highlights: { lines: [11], nodes: [newId] },
      snapshot: snap(nodes, head),
    });

    return steps;
  },
};
