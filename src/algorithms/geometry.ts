export interface Point2D {
  x: number;
  y: number;
}

/**
 * Cross product of vector OA and OB.
 * > 0: counter-clockwise turn
 * < 0: clockwise turn
 * = 0: collinear
 */
export function crossProduct(o: Point2D, a: Point2D, b: Point2D): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/**
 * Convex Hull using Monotone Chain Algorithm (Andrew's algorithm).
 * - Time: O(N log N)
 * - Space: O(N)
 * - Safely handles duplicates, collinear points, and small sets (< 3).
 */
export function convexHull(points: readonly Point2D[]): Point2D[] {
  if (!Array.isArray(points) || points.length <= 2) {
    return points ? [...points] : [];
  }

  // Sort points by x, then by y
  const sorted = [...points].sort((p1, p2) => (p1.x === p2.x ? p1.y - p2.y : p1.x - p2.x));

  // Build lower hull
  const lower: Point2D[] = [];
  for (const p of sorted) {
    while (
      lower.length >= 2 &&
      crossProduct(lower[lower.length - 2]!, lower[lower.length - 1]!, p) <= 0
    ) {
      lower.pop();
    }
    lower.push(p);
  }

  // Build upper hull
  const upper: Point2D[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i]!;
    while (
      upper.length >= 2 &&
      crossProduct(upper[upper.length - 2]!, upper[upper.length - 1]!, p) <= 0
    ) {
      upper.pop();
    }
    upper.push(p);
  }

  // Pop duplicate end-points
  lower.pop();
  upper.pop();

  return lower.concat(upper);
}

/**
 * Checks if a 2D point is inside a polygon using ray casting algorithm.
 */
export function isPointInPolygon(point: Point2D, polygon: readonly Point2D[]): boolean {
  if (!polygon || polygon.length < 3) return false;

  let inside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i]!.x;
    const yi = polygon[i]!.y;
    const xj = polygon[j]!.x;
    const yj = polygon[j]!.y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Euclidean distance between two points.
 */
export function euclideanDistance(p1: Point2D, p2: Point2D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

