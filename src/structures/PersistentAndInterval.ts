/**
 * Persistent Segment Tree (Fully Persistent Data Structure)
 * Version-controlled segment tree where every point update creates a new immutable version in O(log N)
 * by sharing unmodified subtrees (path copying).
 * Allows O(log N) historical range queries at ANY previous version in history.
 */
class PSTNode {
  sum: number;
  left: PSTNode | null = null;
  right: PSTNode | null = null;

  constructor(sum = 0, left: PSTNode | null = null, right: PSTNode | null = null) {
    this.sum = sum;
    this.left = left;
    this.right = right;
  }
}

export class PersistentSegmentTree {
  private readonly roots: PSTNode[] = [];
  private readonly n: number;

  constructor(data: readonly number[] = []) {
    this.n = Array.isArray(data) ? data.length : 0;
    if (this.n > 0) {
      this.roots.push(this.build(data, 0, this.n - 1));
    }
  }

  get versionsCount(): number {
    return this.roots.length;
  }

  /**
   * Updates index in the latest version and creates a NEW version root in O(log N).
   * Returns the new version index.
   */
  update(index: number, delta: number): number {
    if (this.n === 0 || index < 0 || index >= this.n) return -1;
    const latestRoot = this.roots[this.roots.length - 1]!;
    const newRoot = this.updateInternal(latestRoot, 0, this.n - 1, index, delta);
    this.roots.push(newRoot);
    return this.roots.length - 1;
  }

  /**
   * Queries range sum [ql, qr] at any historical version in O(log N).
   */
  query(version: number, queryLeft: number, queryRight: number): number {
    if (version < 0 || version >= this.roots.length || this.n === 0) return 0;
    const qL = Math.max(0, queryLeft);
    const qR = Math.min(this.n - 1, queryRight);
    if (qL > qR) return 0;

    return this.queryInternal(this.roots[version]!, 0, this.n - 1, qL, qR);
  }

  private build(data: readonly number[], start: number, end: number): PSTNode {
    if (start === end) {
      return new PSTNode(data[start]!);
    }
    const mid = Math.floor((start + end) / 2);
    const left = this.build(data, start, mid);
    const right = this.build(data, mid + 1, end);
    return new PSTNode(left.sum + right.sum, left, right);
  }

  private updateInternal(
    node: PSTNode,
    start: number,
    end: number,
    idx: number,
    delta: number,
  ): PSTNode {
    if (start === end) {
      return new PSTNode(node.sum + delta);
    }

    const mid = Math.floor((start + end) / 2);
    let left = node.left;
    let right = node.right;

    if (idx <= mid) {
      left = this.updateInternal(node.left!, start, mid, idx, delta);
    } else {
      right = this.updateInternal(node.right!, mid + 1, end, idx, delta);
    }

    return new PSTNode(left!.sum + right!.sum, left, right);
  }

  private queryInternal(
    node: PSTNode | null,
    start: number,
    end: number,
    ql: number,
    qr: number,
  ): number {
    if (!node || ql > end || qr < start) return 0;
    if (ql <= start && end <= qr) return node.sum;

    const mid = Math.floor((start + end) / 2);
    return (
      this.queryInternal(node.left, start, mid, ql, qr) +
      this.queryInternal(node.right, mid + 1, end, ql, qr)
    );
  }
}

/**
 * Interval Tree
 * Augmented balanced search tree for storing overlapping 1D intervals [low, high].
 * Queries all overlapping intervals in O(log N + K) time where K is the number of reported intervals.
 * Essential for calendar scheduling, resource reservations, and genomic interval lookups.
 */
export interface Interval<T = unknown> {
  low: number;
  high: number;
  data?: T;
}

class IntervalNode<T> {
  interval: Interval<T>;
  max: number;
  left: IntervalNode<T> | null = null;
  right: IntervalNode<T> | null = null;

  constructor(interval: Interval<T>) {
    this.interval = interval;
    this.max = interval.high;
  }
}

export class IntervalTree<T = unknown> {
  private root: IntervalNode<T> | null = null;
  private _size = 0;

  get size(): number {
    return this._size;
  }

  insert(interval: Interval<T>): void {
    if (interval.low > interval.high) {
      throw new Error('Interval low cannot be greater than high');
    }
    this.root = this.insertInternal(this.root, interval);
    this._size++;
  }

  /**
   * Finds all intervals that overlap with [low, high] in O(log N + K) time.
   */
  findOverlapping(low: number, high: number): Interval<T>[] {
    const results: Interval<T>[] = [];
    this.searchInternal(this.root, low, high, results);
    return results;
  }

  private insertInternal(node: IntervalNode<T> | null, interval: Interval<T>): IntervalNode<T> {
    if (!node) return new IntervalNode(interval);

    if (interval.low < node.interval.low) {
      node.left = this.insertInternal(node.left, interval);
    } else {
      node.right = this.insertInternal(node.right, interval);
    }

    if (node.max < interval.high) {
      node.max = interval.high;
    }

    return node;
  }

  private searchInternal(
    node: IntervalNode<T> | null,
    low: number,
    high: number,
    results: Interval<T>[],
  ): void {
    if (!node) return;

    // Check if current node's interval overlaps
    if (node.interval.low <= high && node.interval.high >= low) {
      results.push(node.interval);
    }

    // If left child has max greater than or equal to query low, search left
    if (node.left && node.left.max >= low) {
      this.searchInternal(node.left, low, high, results);
    }

    // Search right
    this.searchInternal(node.right, low, high, results);
  }
}

/**
 * Pairing Heap
 * Self-adjusting heap with very simple implementation and amortized performance comparable to Fibonacci heaps.
 * Extremely popular in C++ STL and functional programming languages (Haskell, OCaml).
 */
class PairNode<T> {
  key: T;
  child: PairNode<T> | null = null;
  next: PairNode<T> | null = null;

  constructor(key: T) {
    this.key = key;
  }
}

export class PairingHeap<T> {
  private root: PairNode<T> | null = null;
  private _size = 0;
  private readonly compare: (a: T, b: T) => number;

  constructor(comparator?: (a: T, b: T) => number) {
    this.compare = comparator ?? ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }

  get size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  findMin(): T | undefined {
    return this.root?.key;
  }

  insert(key: T): void {
    const node = new PairNode(key);
    this.root = this.meld(this.root, node);
    this._size++;
  }

  extractMin(): T | undefined {
    if (!this.root) return undefined;
    const minVal = this.root.key;
    this.root = this.twoPassMerge(this.root.child);
    this._size--;
    return minVal;
  }

  meldWith(other: PairingHeap<T>): void {
    this.root = this.meld(this.root, other.root);
    this._size += other._size;
    other.root = null;
    other._size = 0;
  }

  private meld(a: PairNode<T> | null, b: PairNode<T> | null): PairNode<T> | null {
    if (!a) return b;
    if (!b) return a;

    if (this.compare(a.key, b.key) <= 0) {
      b.next = a.child;
      a.child = b;
      return a;
    } else {
      a.next = b.child;
      b.child = a;
      return b;
    }
  }

  private twoPassMerge(node: PairNode<T> | null): PairNode<T> | null {
    if (!node || !node.next) return node;

    // Pass 1: merge pairs from left to right
    const pairs: PairNode<T>[] = [];
    let curr: PairNode<T> | null = node;

    while (curr) {
      const first: PairNode<T> = curr;
      const second: PairNode<T> | null = curr.next;

      if (second) {
        const nextPair: PairNode<T> | null = second.next;
        first.next = null;
        second.next = null;
        pairs.push(this.meld(first, second)!);
        curr = nextPair;
      } else {
        first.next = null;
        pairs.push(first);
        break;
      }
    }

    // Pass 2: merge pairs from right to left
    let result: PairNode<T> | null = null;
    for (let i = pairs.length - 1; i >= 0; i--) {
      result = this.meld(pairs[i]!, result);
    }

    return result;
  }
}
