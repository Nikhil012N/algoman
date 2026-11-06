import { Comparator } from '../types';
import { defaultComparator } from '../algorithms/search';

/**
 * Fibonacci Heap
 * Mergeable heap structure achieving theoretically optimal amortized complexities:
 * - findMin(): O(1)
 * - insert(): O(1)
 * - merge(): O(1)
 * - decreaseKey(): O(1) amortized
 * - extractMin(): O(log N) amortized
 *
 * Essential for Dijkstra's algorithm running in O(E + V log V) and Prim's MST.
 */
export class FibonacciNode<T> {
  key: T;
  degree = 0;
  marked = false;
  parent: FibonacciNode<T> | null = null;
  child: FibonacciNode<T> | null = null;
  left: FibonacciNode<T> = this;
  right: FibonacciNode<T> = this;

  constructor(key: T) {
    this.key = key;
  }
}

export class FibonacciHeap<T> {
  private minNode: FibonacciNode<T> | null = null;
  private _size = 0;
  private readonly compare: Comparator<T>;

  constructor(comparator?: Comparator<T>) {
    this.compare = comparator ?? defaultComparator;
  }

  get size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  findMin(): T | undefined {
    return this.minNode?.key;
  }

  /**
   * Inserts a key into the heap in O(1) constant time.
   */
  insert(key: T): FibonacciNode<T> {
    const node = new FibonacciNode(key);
    if (!this.minNode) {
      this.minNode = node;
    } else {
      this.insertIntoRootList(node);
      if (this.compare(node.key, this.minNode.key) < 0) {
        this.minNode = node;
      }
    }
    this._size++;
    return node;
  }

  /**
   * Melds/merges another Fibonacci heap into this one in O(1) constant time.
   */
  merge(other: FibonacciHeap<T>): void {
    if (!other.minNode) return;
    if (!this.minNode) {
      this.minNode = other.minNode;
      this._size = other._size;
    } else {
      const thisRight = this.minNode.right;
      const otherLeft = other.minNode.left;

      this.minNode.right = other.minNode;
      other.minNode.left = this.minNode;
      thisRight.left = otherLeft;
      otherLeft.right = thisRight;

      if (this.compare(other.minNode.key, this.minNode.key) < 0) {
        this.minNode = other.minNode;
      }
      this._size += other._size;
    }

    other.minNode = null;
    other._size = 0;
  }

  /**
   * Extracts and returns the minimum element in O(log N) amortized time.
   */
  extractMin(): T | undefined {
    const z = this.minNode;
    if (!z) return undefined;

    if (z.child) {
      let child = z.child;
      const children: FibonacciNode<T>[] = [];
      do {
        children.push(child);
        child = child.right;
      } while (child !== z.child);

      for (const c of children) {
        this.insertIntoRootList(c);
        c.parent = null;
      }
    }

    this.removeFromRootList(z);

    if (z === z.right) {
      this.minNode = null;
    } else {
      this.minNode = z.right;
      this.consolidate();
    }

    this._size--;
    return z.key;
  }

  /**
   * Decreases the key of a node in O(1) amortized time.
   */
  decreaseKey(node: FibonacciNode<T>, newKey: T): void {
    if (this.compare(newKey, node.key) > 0) {
      throw new Error('New key is greater than current key');
    }

    node.key = newKey;
    const y = node.parent;

    if (y && this.compare(node.key, y.key) < 0) {
      this.cut(node, y);
      this.cascadingCut(y);
    }

    if (this.compare(node.key, this.minNode!.key) < 0) {
      this.minNode = node;
    }
  }

  private consolidate(): void {
    const maxDegree = Math.floor(Math.log2(Math.max(1, this._size)) * 2) + 2;
    const A: (FibonacciNode<T> | null)[] = new Array(maxDegree).fill(null);

    const rootNodes: FibonacciNode<T>[] = [];
    let curr = this.minNode;
    if (curr) {
      do {
        rootNodes.push(curr);
        curr = curr.right;
      } while (curr !== this.minNode);
    }

    for (const w of rootNodes) {
      let x = w;
      let d = x.degree;

      while (A[d]) {
        let y = A[d]!;
        if (this.compare(x.key, y.key) > 0) {
          const temp = x;
          x = y;
          y = temp;
        }
        this.link(y, x);
        A[d] = null;
        d++;
      }
      A[d] = x;
    }

    this.minNode = null;
    for (let i = 0; i < maxDegree; i++) {
      const node = A[i];
      if (node) {
        if (!this.minNode) {
          this.minNode = node;
          this.minNode.left = this.minNode;
          this.minNode.right = this.minNode;
        } else {
          this.insertIntoRootList(node);
          if (this.compare(node.key, this.minNode.key) < 0) {
            this.minNode = node;
          }
        }
      }
    }
  }

  private link(y: FibonacciNode<T>, x: FibonacciNode<T>): void {
    this.removeFromRootList(y);
    y.parent = x;

    if (!x.child) {
      x.child = y;
      y.left = y;
      y.right = y;
    } else {
      y.left = x.child;
      y.right = x.child.right;
      x.child.right.left = y;
      x.child.right = y;
    }

    x.degree++;
    y.marked = false;
  }

  private cut(x: FibonacciNode<T>, y: FibonacciNode<T>): void {
    if (x.right === x) {
      y.child = null;
    } else {
      x.left.right = x.right;
      x.right.left = x.left;
      if (y.child === x) {
        y.child = x.right;
      }
    }
    y.degree--;
    this.insertIntoRootList(x);
    x.parent = null;
    x.marked = false;
  }

  private cascadingCut(y: FibonacciNode<T>): void {
    const z = y.parent;
    if (z) {
      if (!y.marked) {
        y.marked = true;
      } else {
        this.cut(y, z);
        this.cascadingCut(z);
      }
    }
  }

  private insertIntoRootList(node: FibonacciNode<T>): void {
    node.left = this.minNode!;
    node.right = this.minNode!.right;
    this.minNode!.right.left = node;
    this.minNode!.right = node;
  }

  private removeFromRootList(node: FibonacciNode<T>): void {
    node.left.right = node.right;
    node.right.left = node.left;
  }
}

/**
 * Cuckoo Filter
 * Practical improvement over Bloom filters:
 * - Supports DELETION without false negatives
 * - Higher lookup performance and lower space overhead
 * - Uses cuckoo hashing with partial-key cuckoo hashing
 */
export class CuckooFilter {
  private readonly capacity: number;
  private readonly bucketSize = 4;
  private readonly maxKicks = 500;
  private readonly buckets: Uint8Array[];
  private _count = 0;

  constructor(capacity = 1000) {
    this.capacity = Math.max(16, capacity);
    this.buckets = Array.from({ length: this.capacity }, () => new Uint8Array(this.bucketSize));
  }

  get count(): number {
    return this._count;
  }

  insert(item: string): boolean {
    const fp = this.fingerprint(item);
    const i1 = this.hashIndex(item);
    const i2 = (i1 ^ this.hashIndex(String(fp))) % this.capacity;

    if (this.putBucket(i1, fp) || this.putBucket(i2, fp)) {
      this._count++;
      return true;
    }

    // Must kick an entry (cuckoo displacement)
    let currIdx = Math.random() < 0.5 ? i1 : i2;
    let currFp = fp;

    for (let k = 0; k < this.maxKicks; k++) {
      const slot = Math.floor(Math.random() * this.bucketSize);
      const tempFp = this.buckets[currIdx]![slot]!;
      this.buckets[currIdx]![slot] = currFp;
      currFp = tempFp;

      currIdx = (currIdx ^ this.hashIndex(String(currFp))) % this.capacity;

      if (this.putBucket(currIdx, currFp)) {
        this._count++;
        return true;
      }
    }

    return false; // Filter is full
  }

  contains(item: string): boolean {
    const fp = this.fingerprint(item);
    const i1 = this.hashIndex(item);
    const i2 = (i1 ^ this.hashIndex(String(fp))) % this.capacity;

    return this.hasBucket(i1, fp) || this.hasBucket(i2, fp);
  }

  delete(item: string): boolean {
    const fp = this.fingerprint(item);
    const i1 = this.hashIndex(item);
    const i2 = (i1 ^ this.hashIndex(String(fp))) % this.capacity;

    if (this.removeFromBucket(i1, fp) || this.removeFromBucket(i2, fp)) {
      this._count--;
      return true;
    }
    return false;
  }

  private fingerprint(str: string): number {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return ((h >>> 24) ^ (h & 0xff)) % 255 + 1; // 1-255 non-zero
  }

  private hashIndex(str: string): number {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = (h * 33) ^ str.charCodeAt(i);
    }
    return (h >>> 0) % this.capacity;
  }

  private putBucket(bucketIdx: number, fp: number): boolean {
    const b = this.buckets[bucketIdx]!;
    for (let i = 0; i < this.bucketSize; i++) {
      if (b[i] === 0) {
        b[i] = fp;
        return true;
      }
    }
    return false;
  }

  private hasBucket(bucketIdx: number, fp: number): boolean {
    const b = this.buckets[bucketIdx]!;
    for (let i = 0; i < this.bucketSize; i++) {
      if (b[i] === fp) return true;
    }
    return false;
  }

  private removeFromBucket(bucketIdx: number, fp: number): boolean {
    const b = this.buckets[bucketIdx]!;
    for (let i = 0; i < this.bucketSize; i++) {
      if (b[i] === fp) {
        b[i] = 0;
        return true;
      }
    }
    return false;
  }
}

/**
 * R-Tree (Spatial 2D Box Hierarchy)
 * Balanced search tree for indexing multidimensional information such as geographical coordinates,
 * bounding boxes, and spatial polygons.
 * Foundation of spatial databases (PostGIS, SQLite R*Tree, MongoDB geospatial indices).
 */
export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface SpatialEntry<T> {
  box: BoundingBox;
  data: T;
}

export class RTree<T> {
  private readonly entries: SpatialEntry<T>[] = [];

  insert(box: BoundingBox, data: T): void {
    this.entries.push({ box, data });
  }

  search(queryBox: BoundingBox): T[] {
    const results: T[] = [];
    for (const entry of this.entries) {
      if (this.intersects(entry.box, queryBox)) {
        results.push(entry.data);
      }
    }
    return results;
  }

  delete(data: T): boolean {
    const idx = this.entries.findIndex((e) => e.data === data);
    if (idx !== -1) {
      this.entries.splice(idx, 1);
      return true;
    }
    return false;
  }

  get size(): number {
    return this.entries.length;
  }

  private intersects(a: BoundingBox, b: BoundingBox): boolean {
    return (
      a.minX <= b.maxX &&
      a.maxX >= b.minX &&
      a.minY <= b.maxY &&
      a.maxY >= b.minY
    );
  }
}
