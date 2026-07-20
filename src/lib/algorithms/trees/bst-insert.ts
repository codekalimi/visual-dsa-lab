import type { AlgorithmModule, Step, TreeNodeSnap, TreeSnapshot } from "@/lib/types";

export type BstInsertInput = { values: number[] };

const CODE = `def bst_insert(root, value):
    if root is None:
        return Node(value)
    if value < root.value:
        root.left = bst_insert(root.left, value)
    else:
        root.right = bst_insert(root.right, value)
    return root`

type Mutable = TreeNodeSnap;

function cloneTree(nodes: Record<string, Mutable>, root: string | null): TreeSnapshot {
  const copy: Record<string, TreeNodeSnap> = {};
  for (const [id, n] of Object.entries(nodes)) {
    copy[id] = { ...n };
  }
  return { nodes: copy, root };
}

export const bstInsert: AlgorithmModule<BstInsertInput, TreeSnapshot> = {
  id: "bst-insert",
  engine: "trees",
  title: "BST Insert",
  description: "Walk left/right by comparison, then attach a new leaf.",
  complexity: { time: "O(h)", space: "O(h)" },
  defaultInput: { values: [8, 3, 10, 1, 6, 14] },
  validateInput: (input) => {
    if (!input.values || input.values.length < 1) {
      return "Provide at least 1 value to insert.";
    }
    if (input.values.length > 12) return "Keep insert sequences to 12 or fewer.";
    return null;
  },
  code: CODE,
  run: (input) => {
    const steps: Step<TreeSnapshot>[] = [];
    const nodes: Record<string, Mutable> = {};
    let root: string | null = null;
    let nextId = 0;
    let stepId = 0;

    steps.push({
      id: `s${stepId++}`,
      caption: "Empty tree. Insert values one by one.",
      highlights: { lines: [2] },
      snapshot: cloneTree(nodes, root),
    });

    for (const value of input.values) {
      if (root === null) {
        const id = `t${nextId++}`;
        nodes[id] = { id, value, left: null, right: null };
        root = id;
        steps.push({
          id: `s${stepId++}`,
          caption: `Root is null — create node ${value} as root.`,
          highlights: { lines: [2, 3], nodes: [id] },
          snapshot: cloneTree(nodes, root),
        });
        continue;
      }

      let curr: string | null = root;
      const path: string[] = [];

      while (curr !== null) {
        path.push(curr);
        const node: Mutable = nodes[curr]!;
        steps.push({
          id: `s${stepId++}`,
          caption: `Compare ${value} with ${node.value} at node ${node.value}.`,
          highlights: { lines: [4], nodes: [...path] },
          snapshot: cloneTree(nodes, root),
        });

        if (value < node.value) {
          if (node.left === null) {
            const id = `t${nextId++}`;
            nodes[id] = { id, value, left: null, right: null };
            node.left = id;
            steps.push({
              id: `s${stepId++}`,
              caption: `${value} < ${node.value} — attach as left child.`,
              highlights: { lines: [5], nodes: [...path, id] },
              snapshot: cloneTree(nodes, root),
            });
            curr = null;
          } else {
            steps.push({
              id: `s${stepId++}`,
              caption: `${value} < ${node.value} — go left.`,
              highlights: { lines: [5], nodes: [...path] },
              snapshot: cloneTree(nodes, root),
            });
            curr = node.left;
          }
        } else {
          if (node.right === null) {
            const id = `t${nextId++}`;
            nodes[id] = { id, value, left: null, right: null };
            node.right = id;
            steps.push({
              id: `s${stepId++}`,
              caption: `${value} ≥ ${node.value} — attach as right child.`,
              highlights: { lines: [7], nodes: [...path, id] },
              snapshot: cloneTree(nodes, root),
            });
            curr = null;
          } else {
            steps.push({
              id: `s${stepId++}`,
              caption: `${value} ≥ ${node.value} — go right.`,
              highlights: { lines: [7], nodes: [...path] },
              snapshot: cloneTree(nodes, root),
            });
            curr = node.right;
          }
        }
      }
    }

    steps.push({
      id: `s${stepId++}`,
      caption: "All values inserted into the BST.",
      highlights: { lines: [8] },
      snapshot: cloneTree(nodes, root),
    });

    return steps;
  },
};
