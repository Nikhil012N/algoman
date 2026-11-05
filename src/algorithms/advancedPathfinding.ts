/**
 * Tarjan's Strongly Connected Components (SCC) Algorithm
 * Discovers all maximally connected subgraphs in a directed graph in O(V + E) linear time.
 */
export function tarjanSCC(graph: Record<string, string[]>): string[][] {
  if (!graph) return [];

  let index = 0;
  const indices: Record<string, number> = {};
  const lowlink: Record<string, number> = {};
  const onStack: Record<string, boolean> = {};
  const stack: string[] = [];
  const sccs: string[][] = [];

  function strongConnect(v: string) {
    indices[v] = index;
    lowlink[v] = index;
    index++;
    stack.push(v);
    onStack[v] = true;

    for (const w of graph[v] ?? []) {
      if (indices[w] === undefined) {
        strongConnect(w);
        lowlink[v] = Math.min(lowlink[v]!, lowlink[w]!);
      } else if (onStack[w]) {
        lowlink[v] = Math.min(lowlink[v]!, indices[w]!);
      }
    }

    if (lowlink[v] === indices[v]) {
      const scc: string[] = [];
      let w: string;
      do {
        w = stack.pop()!;
        onStack[w] = false;
        scc.push(w);
      } while (w !== v);
      sccs.push(scc);
    }
  }

  for (const node of Object.keys(graph)) {
    if (indices[node] === undefined) {
      strongConnect(node);
    }
  }

  return sccs;
}

/**
 * A* (A-Star) Pathfinding Algorithm on 2D Grids
 * Standard across robotics, navigation, and game dev (finding optimal path with heuristic guidance).
 * 0: Walkable, 1: Obstacle.
 */
export interface GridCoord {
  r: number;
  c: number;
}

export function aStar2D(
  grid: number[][],
  start: GridCoord,
  goal: GridCoord,
): GridCoord[] {
  if (!grid || grid.length === 0 || !grid[0] || grid[0].length === 0) return [];
  const rows = grid.length;
  const cols = grid[0].length;

  if (
    start.r < 0 || start.r >= rows || start.c < 0 || start.c >= cols ||
    goal.r < 0 || goal.r >= rows || goal.c < 0 || goal.c >= cols ||
    grid[start.r]![start.c] === 1 || grid[goal.r]![goal.c] === 1
  ) {
    return [];
  }

  const keyOf = (p: GridCoord) => `${p.r},${p.c}`;
  const heuristic = (p1: GridCoord, p2: GridCoord) =>
    Math.abs(p1.r - p2.r) + Math.abs(p1.c - p2.c);

  const openSet = new Set<string>([keyOf(start)]);
  const cameFrom = new Map<string, GridCoord>();

  const gScore = new Map<string, number>();
  gScore.set(keyOf(start), 0);

  const fScore = new Map<string, number>();
  fScore.set(keyOf(start), heuristic(start, goal));

  const directions = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 },
  ];

  while (openSet.size > 0) {
    // Pick node in openSet with lowest fScore
    let currentKey: string | null = null;
    let lowestF = Infinity;

    for (const k of openSet) {
      const f = fScore.get(k) ?? Infinity;
      if (f < lowestF) {
        lowestF = f;
        currentKey = k;
      }
    }

    if (!currentKey) break;

    const [cr, cc] = currentKey.split(',').map(Number);
    const curr: GridCoord = { r: cr!, c: cc! };

    if (curr.r === goal.r && curr.c === goal.c) {
      // Reconstruct path
      const path: GridCoord[] = [curr];
      let stepKey = currentKey;
      while (cameFrom.has(stepKey)) {
        const prev = cameFrom.get(stepKey)!;
        path.unshift(prev);
        stepKey = keyOf(prev);
      }
      return path;
    }

    openSet.delete(currentKey);

    for (const d of directions) {
      const nr = curr.r + d.r;
      const nc = curr.c + d.c;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr]![nc] === 1) {
        continue;
      }

      const neighbor: GridCoord = { r: nr, c: nc };
      const nKey = keyOf(neighbor);
      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;

      if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
        cameFrom.set(nKey, curr);
        gScore.set(nKey, tentativeG);
        fScore.set(nKey, tentativeG + heuristic(neighbor, goal));
        openSet.add(nKey);
      }
    }
  }

  return [];
}

