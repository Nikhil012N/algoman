/**
 * Sparse Table
 * Static Range Minimum Query (RMQ) data structure.
 * Preprocessing Time: O(N log N)
 * Query Time: O(1) guaranteed constant time.
 */
export class SparseTable<T> {
  private readonly table: T[][];
  private readonly logTable: number[];
  private readonly compare: (a: T, b: T) => number;
  private readonly n: number;

  constructor(
    data: readonly T[],
    comparator?: (a: T, b: T) => number,
  ) {
    this.n = Array.isArray(data) ? data.length : 0;
    this.compare = comparator ?? ((a, b) => (a < b ? -1 : a > b ? 1 : 0));

    if (this.n === 0) {
      this.table = [];
      this.logTable = [];
      return;
    }

    // Precompute logarithms for O(1) lookup
    this.logTable = new Array<number>(this.n + 1).fill(0);
    for (let i = 2; i <= this.n; i++) {
      this.logTable[i] = this.logTable[i >> 1]! + 1;
    }

    const maxK = this.logTable[this.n]! + 1;
    this.table = Array.from({ length: maxK }, () => new Array<T>(this.n));

    // Base level k = 0
    for (let i = 0; i < this.n; i++) {
      this.table[0]![i] = data[i]!;
    }

    // Dynamic programming precomputation
    for (let k = 1; k < maxK; k++) {
      const half = 1 << (k - 1);
      for (let i = 0; i + (1 << k) <= this.n; i++) {
        const leftVal = this.table[k - 1]![i]!;
        const rightVal = this.table[k - 1]![i + half]!;
        this.table[k]![i] = this.compare(leftVal, rightVal) <= 0 ? leftVal : rightVal;
      }
    }
  }

  /**
   * Queries the minimum value in range [left, right] (0-based inclusive) in strictly O(1) time.
   */
  query(left: number, right: number): T | undefined {
    if (this.n === 0 || left > right || left < 0 || right >= this.n) {
      return undefined;
    }
    const len = right - left + 1;
    const k = this.logTable[len]!;
    const leftVal = this.table[k]![left]!;
    const rightVal = this.table[k]![right - (1 << k) + 1]!;
    return this.compare(leftVal, rightVal) <= 0 ? leftVal : rightVal;
  }
}

