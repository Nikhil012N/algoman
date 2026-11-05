export interface FlowEdge {
  from: string;
  to: string;
  capacity: number;
  flow: number;
}

/**
 * Edmonds-Karp Max Flow Algorithm (BFS implementation of Ford-Fulkerson).
 * Time: O(V * E^2)
 */
export function edmondsKarp(
  vertices: readonly string[],
  edges: readonly Omit<FlowEdge, 'flow'>[],
  source: string,
  sink: string,
): { maxFlow: number; flowEdges: FlowEdge[] } {
  if (source === sink || !vertices.includes(source) || !vertices.includes(sink)) {
    return { maxFlow: 0, flowEdges: [] };
  }

  // Build residual network
  const capacity: Record<string, Record<string, number>> = {};
  const residual: Record<string, Record<string, number>> = {};
  const adj: Record<string, string[]> = {};

  for (const v of vertices) {
    capacity[v] = {};
    residual[v] = {};
    adj[v] = [];
    for (const u of vertices) {
      capacity[v]![u] = 0;
      residual[v]![u] = 0;
    }
  }

  for (const e of edges) {
    capacity[e.from]![e.to] = (capacity[e.from]![e.to] ?? 0) + e.capacity;
    residual[e.from]![e.to] = capacity[e.from]![e.to]!;
    adj[e.from]!.push(e.to);
    adj[e.to]!.push(e.from);
  }

  let maxFlow = 0;

  // BFS to find augmenting path
  while (true) {
    const parent: Record<string, string | null> = {};
    for (const v of vertices) parent[v] = null;
    parent[source] = source;

    const queue: string[] = [source];

    while (queue.length > 0 && parent[sink] === null) {
      const u = queue.shift()!;
      for (const v of adj[u] ?? []) {
        if (parent[v] === null && residual[u]![v]! > 0) {
          parent[v] = u;
          queue.push(v);
        }
      }
    }

    if (parent[sink] === null) break; // No augmenting path found

    // Find bottleneck capacity along path
    let pathFlow = Infinity;
    let curr = sink;
    while (curr !== source) {
      const prev = parent[curr]!;
      pathFlow = Math.min(pathFlow, residual[prev]![curr]!);
      curr = prev;
    }

    // Update residual capacities
    curr = sink;
    while (curr !== source) {
      const prev = parent[curr]!;
      residual[prev]![curr] = residual[prev]![curr]! - pathFlow;
      residual[curr]![prev] = residual[curr]![prev]! + pathFlow;
      curr = prev;
    }

    maxFlow += pathFlow;
  }

  const flowEdges: FlowEdge[] = [];
  for (const e of edges) {
    const sentFlow = Math.max(0, capacity[e.from]![e.to]! - residual[e.from]![e.to]!);
    flowEdges.push({
      from: e.from,
      to: e.to,
      capacity: e.capacity,
      flow: sentFlow,
    });
  }

  return { maxFlow, flowEdges };
}

/**
 * Hopcroft-Karp Algorithm for Maximum Bipartite Matching.
 * Time: O(E * sqrt(V))
 */
export function hopcroftKarp(
  leftSet: readonly string[],
  graph: Record<string, string[]>,
): { matchingSize: number; pairs: [string, string][] } {
  const pairU: Record<string, string | null> = {};
  const pairV: Record<string, string | null> = {};
  const dist: Record<string, number> = {};

  for (const u of leftSet) pairU[u] = null;
  for (const neighbors of Object.values(graph)) {
    for (const v of neighbors) pairV[v] = null;
  }

  function bfs(): boolean {
    const queue: string[] = [];
    for (const u of leftSet) {
      if (pairU[u] === null) {
        dist[u] = 0;
        queue.push(u);
      } else {
        dist[u] = Infinity;
      }
    }

    let foundAugmenting = false;
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of graph[u] ?? []) {
        const nextU = pairV[v];
        if (nextU === null || nextU === undefined) {
          foundAugmenting = true;
        } else if (dist[nextU] === Infinity) {
          dist[nextU] = (dist[u] ?? 0) + 1;
          queue.push(nextU);
        }
      }
    }
    return foundAugmenting;
  }

  function dfs(u: string): boolean {
    for (const v of graph[u] ?? []) {
      const nextU = pairV[v];
      if (
        nextU === null ||
        nextU === undefined ||
        (nextU !== undefined && dist[nextU] === (dist[u] ?? 0) + 1 && dfs(nextU))
      ) {
        pairU[u] = v;
        pairV[v] = u;
        return true;
      }
    }
    dist[u] = Infinity;
    return false;
  }

  let matchingSize = 0;
  while (bfs()) {
    for (const u of leftSet) {
      if (pairU[u] === null && dfs(u)) {
        matchingSize++;
      }
    }
  }

  const pairs: [string, string][] = [];
  for (const u of leftSet) {
    if (pairU[u]) pairs.push([u, pairU[u]!]);
  }

  return { matchingSize, pairs };
}
