/**
 * HyperLogLog (HLL)
 * Probabilistic cardinality estimator (like Redis HLL / Presto HLL).
 * Estimates the number of distinct elements (count-distinct) in massive data streams
 * with a typical standard error of ~1.04 / sqrt(m), using only a few kilobytes of memory.
 */
export class HyperLogLog {
  private readonly b: number;
  private readonly m: number;
  private readonly alphaM: number;
  private readonly registers: Uint8Array;

  /**
   * @param precision Precision parameter b (4 to 16). Default 10 gives 1024 registers (~3.25% error).
   */
  constructor(precision = 10) {
    if (precision < 4 || precision > 16) {
      throw new RangeError('Precision must be between 4 and 16');
    }
    this.b = precision;
    this.m = 1 << precision;
    this.registers = new Uint8Array(this.m);

    // Alpha correction constants
    if (this.m === 16) {
      this.alphaM = 0.673;
    } else if (this.m === 32) {
      this.alphaM = 0.697;
    } else if (this.m === 64) {
      this.alphaM = 0.709;
    } else {
      this.alphaM = 0.7213 / (1 + 1.079 / this.m);
    }
  }

  add(value: string): void {
    const hash = this.murmurHash64A(value);
    // Lower b bits determine register index
    const registerIndex = Number(hash & BigInt(this.m - 1));
    // Remaining bits determine count of leading zeros + 1
    const w = hash >> BigInt(this.b);
    const leadingZeros = this.clz64(w) + 1;

    if (leadingZeros > this.registers[registerIndex]!) {
      this.registers[registerIndex] = leadingZeros;
    }
  }

  /**
   * Returns estimated distinct count (cardinality).
   */
  count(): number {
    let sum = 0;
    let zeros = 0;

    for (let i = 0; i < this.m; i++) {
      const val = this.registers[i]!;
      sum += Math.pow(2, -val);
      if (val === 0) zeros++;
    }

    let rawEstimate = (this.alphaM * this.m * this.m) / sum;

    // Small range correction (Linear Counting)
    if (rawEstimate <= 2.5 * this.m && zeros > 0) {
      rawEstimate = this.m * Math.log(this.m / zeros);
    }

    return Math.round(rawEstimate);
  }

  merge(other: HyperLogLog): this {
    if (this.b !== other.b) {
      throw new Error('Cannot merge HyperLogLog instances with different precisions');
    }
    for (let i = 0; i < this.m; i++) {
      this.registers[i] = Math.max(this.registers[i]!, other.registers[i]!);
    }
    return this;
  }

  private murmurHash64A(str: string): bigint {
    const m = 0xc6a4a7935bd1e995n;
    const r = 47n;
    let h = 0x84222325cbf29ce4n ^ (BigInt(str.length) * m);

    for (let i = 0; i < str.length; i++) {
      let k = BigInt(str.charCodeAt(i));
      k = (k * m) & 0xffffffffffffffffn;
      k ^= (k >> r);
      k = (k * m) & 0xffffffffffffffffn;
      h ^= k;
      h = (h * m) & 0xffffffffffffffffn;
    }

    h ^= (h >> r);
    h = (h * m) & 0xffffffffffffffffn;
    h ^= (h >> r);

    return h & 0xffffffffffffffffn;
  }

  private clz64(x: bigint): number {
    if (x === 0n) return 64 - this.b;
    let count = 0;
    const maxBits = 64 - this.b;

    while (count < maxBits && ((x >> BigInt(maxBits - 1 - count)) & 1n) === 0n) {
      count++;
    }
    return count;
  }
}

/**
 * 2D / K-D Tree (k-Dimensional Spatial Tree)
 * Used for fast nearest-neighbor lookups and multi-dimensional spatial range queries in 2D space.
 */
export interface Point2 {
  readonly x: number;
  readonly y: number;
}

class KDNode {
  point: Point2;
  left: KDNode | null = null;
  right: KDNode | null = null;

  constructor(point: Point2) {
    this.point = point;
  }
}

export class KDTree2D {
  private root: KDNode | null = null;
  private _size = 0;

  constructor(points: readonly Point2[] = []) {
    if (Array.isArray(points) && points.length > 0) {
      this.root = this.build(points, 0);
      this._size = points.length;
    }
  }

  get size(): number {
    return this._size;
  }

  insert(point: Point2): void {
    this.root = this.insertInternal(this.root, point, 0);
    this._size++;
  }

  /**
   * Finds the nearest point to target in average O(log N) time.
   */
  nearestNeighbor(target: Point2): Point2 | undefined {
    if (!this.root) return undefined;

    let bestPoint = this.root.point;
    let bestDistSq = this.distSq(target, bestPoint);

    const search = (node: KDNode | null, depth: number) => {
      if (!node) return;

      const dSq = this.distSq(target, node.point);
      if (dSq < bestDistSq) {
        bestDistSq = dSq;
        bestPoint = node.point;
      }

      const axis = depth % 2;
      const targetCoord = axis === 0 ? target.x : target.y;
      const nodeCoord = axis === 0 ? node.point.x : node.point.y;
      const diff = targetCoord - nodeCoord;

      const nearChild = diff < 0 ? node.left : node.right;
      const farChild = diff < 0 ? node.right : node.left;

      search(nearChild, depth + 1);

      // Check whether other side could contain closer point
      if (diff * diff < bestDistSq) {
        search(farChild, depth + 1);
      }
    };

    search(this.root, 0);
    return bestPoint;
  }

  /**
   * Range query: returns all points inside rectangular boundary [minX, maxX] x [minY, maxY].
   */
  rangeQuery(minX: number, maxX: number, minY: number, maxY: number): Point2[] {
    const results: Point2[] = [];

    const search = (node: KDNode | null, depth: number) => {
      if (!node) return;

      const { x, y } = node.point;
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        results.push(node.point);
      }

      const axis = depth % 2;
      if (axis === 0) {
        if (minX <= x) search(node.left, depth + 1);
        if (maxX >= x) search(node.right, depth + 1);
      } else {
        if (minY <= y) search(node.left, depth + 1);
        if (maxY >= y) search(node.right, depth + 1);
      }
    };

    search(this.root, 0);
    return results;
  }

  private build(points: readonly Point2[], depth: number): KDNode | null {
    if (points.length === 0) return null;

    const axis = depth % 2;
    const sorted = [...points].sort((a, b) =>
      axis === 0 ? a.x - b.x : a.y - b.y,
    );

    const mid = Math.floor(sorted.length / 2);
    const node = new KDNode(sorted[mid]!);

    node.left = this.build(sorted.slice(0, mid), depth + 1);
    node.right = this.build(sorted.slice(mid + 1), depth + 1);

    return node;
  }

  private insertInternal(node: KDNode | null, point: Point2, depth: number): KDNode {
    if (!node) return new KDNode(point);

    const axis = depth % 2;
    const coordP = axis === 0 ? point.x : point.y;
    const coordN = axis === 0 ? node.point.x : node.point.y;

    if (coordP < coordN) {
      node.left = this.insertInternal(node.left, point, depth + 1);
    } else {
      node.right = this.insertInternal(node.right, point, depth + 1);
    }

    return node;
  }

  private distSq(p1: Point2, p2: Point2): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx * dx + dy * dy;
  }
}
