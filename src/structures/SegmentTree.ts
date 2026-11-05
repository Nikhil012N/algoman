/**
 * Segment Tree supporting range queries and point/range updates in O(log N) time.
 * Configurable with custom associative combiners (e.g. sum, min, max, gcd).
 */
export class SegmentTree<T> {
  private readonly tree: T[];
  private readonly n: number;
  private readonly combine: (left: T, right: T) => T;
  private readonly identity: T;

  constructor(
    data: readonly T[],
    combiner: (left: T, right: T) => T,
    identity: T,
  ) {
    if (!Array.isArray(data) || data.length === 0) {
      this.n = 0;
      this.tree = [];
      this.combine = combiner;
      this.identity = identity;
      return;
    }

    this.n = data.length;
    this.combine = combiner;
    this.identity = identity;
    this.tree = new Array<T>(4 * this.n);

    this.build(data, 0, 0, this.n - 1);
  }

  get length(): number {
    return this.n;
  }

  /**
   * Updates element at index (0-based) to newValue in O(log N).
   */
  update(index: number, newValue: T): void {
    if (index < 0 || index >= this.n) return;
    this.updateInternal(0, 0, this.n - 1, index, newValue);
  }

  /**
   * Queries the range [queryLeft, queryRight] (0-based inclusive) in O(log N).
   */
  query(queryLeft: number, queryRight: number): T {
    if (this.n === 0 || queryLeft > queryRight || queryLeft >= this.n || queryRight < 0) {
      return this.identity;
    }
    const qL = Math.max(0, queryLeft);
    const qR = Math.min(this.n - 1, queryRight);
    return this.queryInternal(0, 0, this.n - 1, qL, qR);
  }

  private build(data: readonly T[], node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = data[start]!;
      return;
    }

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    this.build(data, leftChild, start, mid);
    this.build(data, rightChild, mid + 1, end);
    this.tree[node] = this.combine(this.tree[leftChild]!, this.tree[rightChild]!);
  }

  private updateInternal(
    node: number,
    start: number,
    end: number,
    idx: number,
    val: T,
  ): void {
    if (start === end) {
      this.tree[node] = val;
      return;
    }

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    if (idx <= mid) {
      this.updateInternal(leftChild, start, mid, idx, val);
    } else {
      this.updateInternal(rightChild, mid + 1, end, idx, val);
    }

    this.tree[node] = this.combine(this.tree[leftChild]!, this.tree[rightChild]!);
  }

  private queryInternal(
    node: number,
    start: number,
    end: number,
    ql: number,
    qr: number,
  ): T {
    if (ql <= start && end <= qr) {
      return this.tree[node]!;
    }

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    if (qr <= mid) {
      return this.queryInternal(leftChild, start, mid, ql, qr);
    }
    if (ql > mid) {
      return this.queryInternal(rightChild, mid + 1, end, ql, qr);
    }

    const leftRes = this.queryInternal(leftChild, start, mid, ql, qr);
    const rightRes = this.queryInternal(rightChild, mid + 1, end, ql, qr);
    return this.combine(leftRes, rightRes);
  }
}

