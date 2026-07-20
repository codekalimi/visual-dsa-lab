import type { AlgorithmModule, GraphSnapshot, Step } from "@/lib/types";

export type ValidPathInput = {
  n: number;
  edges: [number, number][];
  source: number;
  destination: number;
};

const CODE = `from collections import defaultdict, deque


def valid_path(
    n: int,
    edges: list[list[int]],
    source: int,
    destination: int,
) -> bool:
    # Build an undirected adjacency list.
    graph = defaultdict(list)

    for node_a, node_b in edges:
        graph[node_a].append(node_b)
        graph[node_b].append(node_a)

    # BFS from the source.
    queue = deque([source])
    visited = {source}

    while queue:
        node = queue.popleft()

        if node == destination:
            return True

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return False`;

function edgeId(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function buildEdges(edges: [number, number][]) {
  const unique = new Map<string, { id: string; source: number; target: number }>();
  for (const [a, b] of edges) {
    const id = edgeId(a, b);
    if (!unique.has(id)) unique.set(id, { id, source: a, target: b });
  }
  return [...unique.values()];
}

function snap(partial: Omit<GraphSnapshot, "nodes" | "edges"> & {
  edges: GraphSnapshot["edges"];
  n: number;
}): GraphSnapshot {
  return {
    ...partial,
    nodes: Array.from({ length: partial.n }, (_, i) => i),
  };
}

export const validPath: AlgorithmModule<ValidPathInput, GraphSnapshot> = {
  id: "valid-path",
  engine: "graphs",
  title: "Valid Path (BFS)",
  description:
    "Find whether an undirected path exists from source to destination using BFS.",
  complexity: { time: "O(n + e)", space: "O(n + e)" },
  defaultInput: {
    n: 6,
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
    source: 0,
    destination: 5,
  },
  validateInput: (input) => {
    if (!Number.isInteger(input.n) || input.n < 1) {
      return "n must be a positive integer.";
    }
    if (input.n > 16) return "Keep n to 16 or fewer for clarity.";
    if (!input.edges || input.edges.length < 1) {
      return "Provide at least one edge.";
    }
    if (input.edges.length > 40) return "Keep edge lists to 40 or fewer.";
    for (const e of input.edges) {
      if (
        !Array.isArray(e) ||
        e.length !== 2 ||
        !Number.isInteger(e[0]) ||
        !Number.isInteger(e[1])
      ) {
        return "Each edge must be two integers.";
      }
      if (e[0] < 0 || e[0] >= input.n || e[1] < 0 || e[1] >= input.n) {
        return `Edge [${e[0]}, ${e[1]}] is outside 0…${input.n - 1}.`;
      }
    }
    if (
      !Number.isInteger(input.source) ||
      input.source < 0 ||
      input.source >= input.n
    ) {
      return "source must be a node in 0…n-1.";
    }
    if (
      !Number.isInteger(input.destination) ||
      input.destination < 0 ||
      input.destination >= input.n
    ) {
      return "destination must be a node in 0…n-1.";
    }
    return null;
  },
  code: CODE,
  run: (input) => {
    const steps: Step<GraphSnapshot>[] = [];
    const { n, source, destination } = input;
    const edgeSnaps = buildEdges(input.edges);
    const graph: Record<number, number[]> = {};
    for (let i = 0; i < n; i++) graph[i] = [];

    let stepId = 0;
    const base = () =>
      snap({
        n,
        edges: edgeSnaps,
        visited: [],
        queue: [],
        current: null,
        source,
        destination,
        activeEdge: null,
        found: null,
      });

    steps.push({
      id: `s${stepId++}`,
      caption: `Build undirected adjacency for n=${n}. Looking for path ${source} → ${destination}.`,
      highlights: { lines: [10, 11] },
      snapshot: base(),
    });

    for (const [a, b] of input.edges) {
      graph[a].push(b);
      graph[b].push(a);
      steps.push({
        id: `s${stepId++}`,
        caption: `Add undirected edge ${a} ↔ ${b}.`,
        highlights: { lines: [13, 14, 15], edges: [edgeId(a, b)], nodes: [String(a), String(b)] },
        snapshot: snap({
          n,
          edges: edgeSnaps,
          visited: [],
          queue: [],
          current: null,
          source,
          destination,
          activeEdge: edgeId(a, b),
          found: null,
        }),
      });
    }

    const queue: number[] = [source];
    const visited = new Set<number>([source]);
    const visitedArr = () => [...visited];

    steps.push({
      id: `s${stepId++}`,
      caption: `BFS start: enqueue source ${source}, mark visited.`,
      highlights: { lines: [18, 19], nodes: [String(source)] },
      snapshot: snap({
        n,
        edges: edgeSnaps,
        visited: visitedArr(),
        queue: [...queue],
        current: source,
        source,
        destination,
        activeEdge: null,
        found: null,
      }),
    });

    while (queue.length) {
      const node = queue.shift()!;
      steps.push({
        id: `s${stepId++}`,
        caption: `Dequeue ${node}. Check if it is the destination.`,
        highlights: { lines: [21, 22, 24], nodes: [String(node)] },
        snapshot: snap({
          n,
          edges: edgeSnaps,
          visited: visitedArr(),
          queue: [...queue],
          current: node,
          source,
          destination,
          activeEdge: null,
          found: null,
        }),
      });

      if (node === destination) {
        steps.push({
          id: `s${stepId++}`,
          caption: `Reached destination ${destination} — path exists.`,
          highlights: { lines: [24, 25], nodes: [String(node)] },
          snapshot: snap({
            n,
            edges: edgeSnaps,
            visited: visitedArr(),
            queue: [...queue],
            current: node,
            source,
            destination,
            activeEdge: null,
            found: true,
          }),
        });
        return steps;
      }

      for (const neighbor of graph[node] ?? []) {
        const eid = edgeId(node, neighbor);
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          steps.push({
            id: `s${stepId++}`,
            caption: `${neighbor} unseen — visit and enqueue.`,
            highlights: {
              lines: [27, 28, 29, 30],
              nodes: [String(node), String(neighbor)],
              edges: [eid],
            },
            snapshot: snap({
              n,
              edges: edgeSnaps,
              visited: visitedArr(),
              queue: [...queue],
              current: node,
              source,
              destination,
              activeEdge: eid,
              found: null,
            }),
          });
        } else {
          steps.push({
            id: `s${stepId++}`,
            caption: `${neighbor} already visited — skip.`,
            highlights: {
              lines: [27, 28],
              nodes: [String(node), String(neighbor)],
              edges: [eid],
            },
            snapshot: snap({
              n,
              edges: edgeSnaps,
              visited: visitedArr(),
              queue: [...queue],
              current: node,
              source,
              destination,
              activeEdge: eid,
              found: null,
            }),
          });
        }
      }
    }

    steps.push({
      id: `s${stepId++}`,
      caption: `Queue empty — no path from ${source} to ${destination}.`,
      highlights: { lines: [32] },
      snapshot: snap({
        n,
        edges: edgeSnaps,
        visited: visitedArr(),
        queue: [],
        current: null,
        source,
        destination,
        activeEdge: null,
        found: false,
      }),
    });

    return steps;
  },
};
