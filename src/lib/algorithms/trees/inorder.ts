import type { AlgorithmModule, Step, TreeNodeSnap, TreeSnapshot } from "@/lib/types";

export type InorderInput = { values: number[] };

const CODE = `def inorder(root, visit):
    if root is None: return
    inorder(root.left, visit)
    visit(root)
    inorder(root.right, visit)`

type Mutable = TreeNodeSnap;

function buildBst(values: number[]): {
  nodes: Record<string, Mutable>;
  root: string | null;
} {
  const nodes: Record<string, Mutable> = {};
  let root: string | null = null;
  let nextId = 0;

  function insert(value: number) {
    if (root === null) {
      const id = `t${nextId++}`;
      nodes[id] = { id, value, left: null, right: null };
      root = id;
      return;
    }
    let curr: string | null = root;
    while (curr !== null) {
      const node: Mutable = nodes[curr]!;
      if (value < node.value) {
        if (node.left === null) {
          const id = `t${nextId++}`;
          nodes[id] = { id, value, left: null, right: null };
          node.left = id;
          return;
        }
        curr = node.left;
      } else {
        if (node.right === null) {
          const id = `t${nextId++}`;
          nodes[id] = { id, value, left: null, right: null };
          node.right = id;
          return;
        }
        curr = node.right;
      }
    }
  }

  for (const v of values) insert(v);
  return { nodes, root };
}

function clone(
  nodes: Record<string, Mutable>,
  root: string | null,
  visitOrder: string[],
): TreeSnapshot {
  const copy: Record<string, TreeNodeSnap> = {};
  for (const [id, n] of Object.entries(nodes)) copy[id] = { ...n };
  return { nodes: copy, root, visitOrder: [...visitOrder] };
}

export const inorderTraversal: AlgorithmModule<InorderInput, TreeSnapshot> = {
  id: "inorder",
  engine: "trees",
  title: "Inorder Traversal",
  description: "Left → node → right. On a BST this yields sorted order.",
  complexity: { time: "O(n)", space: "O(h)" },
  defaultInput: { values: [8, 3, 10, 1, 6, 14, 4, 7] },
  validateInput: (input) => {
    if (!input.values || input.values.length < 1) {
      return "Provide at least 1 value to build the BST.";
    }
    if (input.values.length > 12) return "Keep trees to 12 nodes or fewer.";
    return null;
  },
  code: CODE,
  run: (input) => {
    const steps: Step<TreeSnapshot>[] = [];
    const { nodes, root } = buildBst(input.values);
    const visitOrder: string[] = [];
    let stepId = 0;

    steps.push({
      id: `s${stepId++}`,
      caption: "BST built from insert sequence. Begin inorder (LNR).",
      highlights: { lines: [1] },
      snapshot: clone(nodes, root, visitOrder),
    });

    function walk(id: string | null) {
      if (id === null) {
        steps.push({
          id: `s${stepId++}`,
          caption: "Null child — return from this recursive call.",
          highlights: { lines: [2] },
          snapshot: clone(nodes, root, visitOrder),
        });
        return;
      }

      const node: Mutable = nodes[id]!;
      steps.push({
        id: `s${stepId++}`,
        caption: `At ${node.value} — recurse into left subtree.`,
        highlights: { lines: [3], nodes: [id] },
        snapshot: clone(nodes, root, visitOrder),
      });
      walk(node.left);

      visitOrder.push(id);
      steps.push({
        id: `s${stepId++}`,
        caption: `Visit ${node.value} (append to result).`,
        highlights: { lines: [4], nodes: [id], indices: [visitOrder.length - 1] },
        snapshot: clone(nodes, root, visitOrder),
      });

      steps.push({
        id: `s${stepId++}`,
        caption: `At ${node.value} — recurse into right subtree.`,
        highlights: { lines: [5], nodes: [id] },
        snapshot: clone(nodes, root, visitOrder),
      });
      walk(node.right);
    }

    walk(root);

    steps.push({
      id: `s${stepId++}`,
      caption: `Done. Visit order: ${visitOrder.map((id) => nodes[id].value).join(", ")}.`,
      highlights: { lines: [1] },
      snapshot: clone(nodes, root, visitOrder),
    });

    return steps;
  },
};
