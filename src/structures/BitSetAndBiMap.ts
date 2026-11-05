/**
 * BitSet (BitArray / BitVector)
 * Dense bit-level array (like C++ std::bitset or Java java.util.BitSet).
 * Stores boolean flags using 32-bit unsigned words, reducing memory usage by 8x compared to standard boolean arrays.
 */
export class BitSet {
  private readonly words: Uint32Array;
  readonly size: number;

  constructor(size: number) {
    if (size < 0) throw new RangeError('BitSet size cannot be negative');
    this.size = size;
    this.words = new Uint32Array(Math.ceil(size / 32));
  }

  set(index: number, value = true): void {
    if (index < 0 || index >= this.size) {
      throw new RangeError(`Index ${index} out of bounds for BitSet size ${this.size}`);
    }
    const wordIdx = index >>> 5; // index / 32
    const bitOffset = index & 31; // index % 32

    if (value) {
      this.words[wordIdx]! |= 1 << bitOffset;
    } else {
      this.words[wordIdx]! &= ~(1 << bitOffset);
    }
  }

  get(index: number): boolean {
    if (index < 0 || index >= this.size) return false;
    const wordIdx = index >>> 5;
    const bitOffset = index & 31;
    return (this.words[wordIdx]! & (1 << bitOffset)) !== 0;
  }

  toggle(index: number): void {
    if (index < 0 || index >= this.size) {
      throw new RangeError(`Index ${index} out of bounds for BitSet size ${this.size}`);
    }
    const wordIdx = index >>> 5;
    const bitOffset = index & 31;
    this.words[wordIdx]! ^= 1 << bitOffset;
  }

  /**
   * Counts the total number of set bits (popcount / hamming weight).
   */
  count(): number {
    let total = 0;
    for (let i = 0; i < this.words.length; i++) {
      let v = this.words[i]!;
      // Brian Kernighan bit counting
      while (v !== 0) {
        v &= v - 1;
        total++;
      }
    }
    return total;
  }

  clear(): void {
    this.words.fill(0);
  }

  /**
   * In-place bitwise AND with another BitSet.
   */
  and(other: BitSet): this {
    const limit = Math.min(this.words.length, other.words.length);
    for (let i = 0; i < limit; i++) {
      this.words[i]! &= other.words[i]!;
    }
    for (let i = limit; i < this.words.length; i++) {
      this.words[i] = 0;
    }
    return this;
  }

  /**
   * In-place bitwise OR with another BitSet.
   */
  or(other: BitSet): this {
    const limit = Math.min(this.words.length, other.words.length);
    for (let i = 0; i < limit; i++) {
      this.words[i]! |= other.words[i]!;
    }
    return this;
  }

  /**
   * In-place bitwise XOR with another BitSet.
   */
  xor(other: BitSet): this {
    const limit = Math.min(this.words.length, other.words.length);
    for (let i = 0; i < limit; i++) {
      this.words[i]! ^= other.words[i]!;
    }
    return this;
  }
}

/**
 * BiMap (Bidirectional Map)
 * Preserves a strict 1-to-1 bijection between keys and values (like Guava BiMap / Boost.Bimap).
 * Provides O(1) forward lookups (key -> value) and inverse lookups (value -> key).
 */
export class BiMap<K, V> implements Iterable<[K, V]> {
  private readonly forward = new Map<K, V>();
  private readonly backward = new Map<V, K>();

  get size(): number {
    return this.forward.size;
  }

  isEmpty(): boolean {
    return this.forward.size === 0;
  }

  set(key: K, value: V): this {
    // If key already exists with another value, clean backward map
    if (this.forward.has(key)) {
      const prevVal = this.forward.get(key)!;
      this.backward.delete(prevVal);
    }

    // If value already exists with another key, clean forward map
    if (this.backward.has(value)) {
      const prevKey = this.backward.get(value)!;
      this.forward.delete(prevKey);
    }

    this.forward.set(key, value);
    this.backward.set(value, key);
    return this;
  }

  get(key: K): V | undefined {
    return this.forward.get(key);
  }

  getKey(value: V): K | undefined {
    return this.backward.get(value);
  }

  has(key: K): boolean {
    return this.forward.has(key);
  }

  hasValue(value: V): boolean {
    return this.backward.has(value);
  }

  delete(key: K): boolean {
    if (!this.forward.has(key)) return false;
    const value = this.forward.get(key)!;
    this.forward.delete(key);
    this.backward.delete(value);
    return true;
  }

  deleteValue(value: V): boolean {
    if (!this.backward.has(value)) return false;
    const key = this.backward.get(value)!;
    this.backward.delete(value);
    this.forward.delete(key);
    return true;
  }

  clear(): void {
    this.forward.clear();
    this.backward.clear();
  }

  *[Symbol.iterator](): Iterator<[K, V]> {
    yield* this.forward.entries();
  }
}

/**
 * Count-Min Sketch
 * Probabilistic sub-linear space frequency estimator for streaming data (like Redis Count-Min Sketch).
 * Never under-estimates frequency, with bounded over-estimation error.
 */
export class CountMinSketch {
  private readonly width: number;
  private readonly depth: number;
  private readonly table: Uint32Array[];

  /**
   * @param epsilon Relative error tolerance (e.g. 0.01 for 1%).
   * @param delta Error probability bound (e.g. 0.01 for 99% confidence).
   */
  constructor(epsilon = 0.01, delta = 0.01) {
    if (epsilon <= 0 || epsilon >= 1) throw new RangeError('epsilon must be between 0 and 1');
    if (delta <= 0 || delta >= 1) throw new RangeError('delta must be between 0 and 1');

    this.width = Math.ceil(Math.E / epsilon);
    this.depth = Math.ceil(Math.log(1 / delta));
    this.table = Array.from({ length: this.depth }, () => new Uint32Array(this.width));
  }

  add(item: string, count = 1): void {
    if (count <= 0) return;
    const [h1, h2] = this.hash(item);
    for (let d = 0; d < this.depth; d++) {
      const col = Math.abs((h1 + d * h2) % this.width);
      this.table[d]![col] = this.table[d]![col]! + count;
    }
  }

  estimate(item: string): number {
    const [h1, h2] = this.hash(item);
    let minFreq = Infinity;
    for (let d = 0; d < this.depth; d++) {
      const col = Math.abs((h1 + d * h2) % this.width);
      minFreq = Math.min(minFreq, this.table[d]![col]!);
    }
    return minFreq === Infinity ? 0 : minFreq;
  }

  private hash(str: string): [number, number] {
    let h1 = 2166136261;
    let h2 = 2166136261;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      h1 ^= code;
      h1 = Math.imul(h1, 16777619);
      h2 ^= code ^ (i + 1);
      h2 = Math.imul(h2, 16777619);
    }
    return [h1 >>> 0, (h2 >>> 0) || 1];
  }
}

