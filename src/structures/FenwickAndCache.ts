/**
 * Binary Indexed Tree (Fenwick Tree)
 * Supports point updates and prefix-sum range queries in O(log N) time.
 */
export class FenwickTree {
  private readonly tree: number[];
  readonly size: number;

  constructor(size: number) {
    this.size = Math.max(0, size);
    this.tree = new Array<number>(this.size + 1).fill(0);
  }

  /**
   * Adds value delta to the element at 1-based index idx.
   */
  add(idx: number, delta: number): void {
    if (idx <= 0 || idx > this.size) return;
    for (let i = idx; i <= this.size; i += i & -i) {
      this.tree[i] = this.tree[i]! + delta;
    }
  }

  /**
   * Computes prefix sum from index 1 to idx (inclusive).
   */
  prefixSum(idx: number): number {
    if (idx <= 0) return 0;
    const limit = Math.min(idx, this.size);
    let sum = 0;
    for (let i = limit; i > 0; i -= i & -i) {
      sum += this.tree[i]!;
    }
    return sum;
  }

  /**
   * Computes sum of elements in 1-based range [left, right].
   */
  rangeSum(left: number, right: number): number {
    if (left > right) return 0;
    return this.prefixSum(right) - this.prefixSum(left - 1);
  }
}

/**
 * Least Recently Used (LRU) Cache
 * O(1) get and put operations via Doubly Linked Map.
 */
export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly map = new Map<K, V>();

  constructor(capacity: number) {
    if (capacity <= 0) throw new RangeError('LRU Cache capacity must be greater than zero');
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined;
    const value = this.map.get(key)!;
    // Refresh position to most recently used
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key: K, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      // Evict oldest (first key in map iteration)
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }
    this.map.set(key, value);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  get size(): number {
    return this.map.size;
  }

  clear(): void {
    this.map.clear();
  }
}

