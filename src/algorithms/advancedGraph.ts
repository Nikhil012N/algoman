import { DisjointSet } from '../structures/AdvancedStructures';

export interface WeightedEdge {
  u: string;
  v: string;
  weight: number;
}

/**
 * Kruskal's Minimum Spanning Tree (MST) Algorithm.
 * - Time: O(E log E)
 * - Returns the edges forming the MST and total cost.
 */
export function kruskalMST(edges: readonly WeightedEdge[]): { mst: WeightedEdge[]; totalWeight: number } {
  if (!Array.isArray(edges) || edges.length === 0) {
    return { mst: [], totalWeight: 0 };
  }

  // Sort edges by weight in ascending order
  const sorted = [...edges].sort((a, b) => a.weight - b.weight);
  const dsu = new DisjointSet<string>();
  const mst: WeightedEdge[] = [];
  let totalWeight = 0;

  for (const edge of sorted) {
    if (dsu.union(edge.u, edge.v)) {
      mst.push(edge);
      totalWeight += edge.weight;
    }
  }

  return { mst, totalWeight };
}

/**
 * Bellman-Ford Shortest Path Algorithm.
 * - Time: O(V * E)
 * - Supports negative edge weights.
 * - Detects negative weight cycles.
 */
export function bellmanFord(
  vertices: readonly string[],
  edges: readonly WeightedEdge[],
  source: string,
): { distances: Record<string, number>; hasNegativeCycle: boolean } {
  const distances: Record<string, number> = {};

  for (const v of vertices) {
    distances[v] = Infinity;
  }
  distances[source] = 0;

  // Relax edges |V| - 1 times
  const vCount = vertices.length;
  for (let i = 1; i <= vCount - 1; i++) {
    for (const edge of edges) {
      if (distances[edge.u] !== Infinity && distances[edge.u]! + edge.weight < distances[edge.v]!) {
        distances[edge.v] = distances[edge.u]! + edge.weight;
      }
    }
  }

  // Check for negative-weight cycles
  let hasNegativeCycle = false;
  for (const edge of edges) {
    if (distances[edge.u] !== Infinity && distances[edge.u]! + edge.weight < distances[edge.v]!) {
      hasNegativeCycle = true;
      break;
    }
  }

  return { distances, hasNegativeCycle };
}

/**
 * Floyd-Warshall All-Pairs Shortest Path Algorithm.
 * - Time: O(V^3)
 * - Space: O(V^2)
 */
export function floydWarshall(
  vertices: readonly string[],
  edges: readonly WeightedEdge[],
): Record<string, Record<string, number>> {
  const dist: Record<string, Record<string, number>> = {};

  for (const u of vertices) {
    dist[u] = {};
    for (const v of vertices) {
      dist[u]![v] = u === v ? 0 : Infinity;
    }
  }

  for (const edge of edges) {
    dist[edge.u]![edge.v] = Math.min(dist[edge.u]![edge.v]!, edge.weight);
  }

  for (const k of vertices) {
    for (const i of vertices) {
      for (const j of vertices) {
        if (dist[i]![k]! + dist[k]![j]! < dist[i]![j]!) {
          dist[i]![j] = dist[i]![k]! + dist[k]![j]!;
        }
      }
    }
  }

  return dist;
}

