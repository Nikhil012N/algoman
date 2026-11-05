import { PriorityQueue } from '../structures/PriorityQueue';

export interface GraphEdge {
  to: string;
  weight: number;
}

export type AdjacencyList = Record<string, GraphEdge[]>;

export interface DijkstraResult {
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  path: (destination: string) => string[];
}

/**
 * Breadth-First Search (BFS) Traversal
 * Traverses reachable nodes level-by-level.
 */
export function bfs(graph: Record<string, string[]>, startNode: string): string[] {
  if (!graph || !startNode || !(startNode in graph)) return [];

  const visited = new Set<string>();
  const queue: string[] = [startNode];
  const order: string[] = [];

  visited.add(startNode);

  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);

    const neighbors = graph[current] ?? [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return order;
}

/**
 * Depth-First Search (DFS) Traversal
 * Iterative DFS with visited tracker.
 */
export function dfs(graph: Record<string, string[]>, startNode: string): string[] {
  if (!graph || !startNode || !(startNode in graph)) return [];

  const visited = new Set<string>();
  const stack: string[] = [startNode];
  const order: string[] = [];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (!visited.has(current)) {
      visited.add(current);
      order.push(current);

      const neighbors = graph[current] ?? [];
      // Push in reverse to maintain left-to-right natural exploration
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i]!;
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }

  return order;
}

/**
 * Dijkstra's Shortest Path Algorithm
 * Finds shortest paths from startNode to all reachable vertices in a weighted graph.
 * - Time: O((V + E) log V) via Min-Heap
 */
export function dijkstra(graph: AdjacencyList, startNode: string): DijkstraResult {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};

  if (!graph || !startNode || !(startNode in graph)) {
    return {
      distances,
      previous,
      path: () => [],
    };
  }

  for (const node of Object.keys(graph)) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[startNode] = 0;

  interface NodeDistance {
    node: string;
    distance: number;
  }

  const pq = new PriorityQueue<NodeDistance>((a, b) => a.distance - b.distance);
  pq.push({ node: startNode, distance: 0 });

  while (!pq.isEmpty()) {
    const { node: u, distance: currentDist } = pq.pop()!;

    if (currentDist > (distances[u] ?? Infinity)) continue;

    const neighbors = graph[u] ?? [];
    for (const edge of neighbors) {
      const v = edge.to;
      const weight = edge.weight;
      const newDist = currentDist + weight;

      if (newDist < (distances[v] ?? Infinity)) {
        distances[v] = newDist;
        previous[v] = u;
        pq.push({ node: v, distance: newDist });
      }
    }
  }

  return {
    distances,
    previous,
    path: (destination: string): string[] => {
      const pathList: string[] = [];
      let curr: string | null = destination;

      if (distances[destination] === undefined || distances[destination] === Infinity) {
        return [];
      }

      while (curr !== null) {
        pathList.unshift(curr);
        curr = previous[curr] ?? null;
      }

      return pathList[0] === startNode ? pathList : [];
    },
  };
}

/**
 * Topological Sort (Kahn's Algorithm via Indegrees)
 * Returns topological ordering for DAGs, or empty array if cycle detected.
 */
export function topologicalSort(graph: Record<string, string[]>): string[] {
  if (!graph) return [];

  const inDegree: Record<string, number> = {};
  const allNodes = new Set<string>();

  for (const [node, neighbors] of Object.entries(graph)) {
    allNodes.add(node);
    if (inDegree[node] === undefined) inDegree[node] = 0;
    for (const neighbor of neighbors) {
      allNodes.add(neighbor);
      inDegree[neighbor] = (inDegree[neighbor] ?? 0) + 1;
    }
  }

  const queue: string[] = [];
  for (const node of allNodes) {
    if ((inDegree[node] ?? 0) === 0) {
      queue.push(node);
    }
  }

  const order: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);

    const neighbors = graph[u] ?? [];
    for (const v of neighbors) {
      inDegree[v] = inDegree[v]! - 1;
      if (inDegree[v] === 0) {
        queue.push(v);
      }
    }
  }

  return order.length === allNodes.size ? order : []; // Empty if cycle exists
}

