/**
 * Bloom Filter
 * Space-efficient probabilistic data structure for set membership testing (0 false negatives, bounded false positives).
 */
export class BloomFilter {
  private readonly size: number;
  private readonly bitArray: Uint8Array;
  private readonly hashCount: number;

  /**
   * @param expectedElements Estimated number of items to be inserted.
   * @param falsePositiveRate Desired false positive probability (e.g. 0.01 for 1%).
   */
  constructor(expectedElements = 1000, falsePositiveRate = 0.01) {
    if (expectedElements <= 0) throw new RangeError('expectedElements must be positive');
    if (falsePositiveRate <= 0 || falsePositiveRate >= 1) {
      throw new RangeError('falsePositiveRate must be between 0 and 1 exclusive');
    }

    // Optimal bit size: m = - (n * ln(p)) / (ln(2)^2)
    this.size = Math.ceil((-expectedElements * Math.log(falsePositiveRate)) / (Math.LN2 * Math.LN2));
    this.bitArray = new Uint8Array(Math.ceil(this.size / 8));

    // Optimal hash functions count: k = (m / n) * ln(2)
    this.hashCount = Math.round((this.size / expectedElements) * Math.LN2) || 1;
  }

  add(value: string): void {
    const [h1, h2] = this.hash(value);
    for (let i = 0; i < this.hashCount; i++) {
      // Double hashing: (h1 + i * h2) % m
      const bitIndex = Math.abs((h1 + i * h2) % this.size);
      this.setBit(bitIndex);
    }
  }

  has(value: string): boolean {
    const [h1, h2] = this.hash(value);
    for (let i = 0; i < this.hashCount; i++) {
      const bitIndex = Math.abs((h1 + i * h2) % this.size);
      if (!this.getBit(bitIndex)) {
        return false; // Definitely not present
      }
    }
    return true; // Probably present
  }

  private setBit(index: number): void {
    const byteIndex = index >> 3;
    const bitOffset = index & 7;
    this.bitArray[byteIndex]! |= 1 << bitOffset;
  }

  private getBit(index: number): boolean {
    const byteIndex = index >> 3;
    const bitOffset = index & 7;
    return (this.bitArray[byteIndex]! & (1 << bitOffset)) !== 0;
  }

  /**
   * FNV-1a dual hash for string values.
   */
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

/**
 * Fixed-size Ring Buffer / Circular Buffer
 * Commonly found in hardware drivers and low-latency audio/streaming queues.
 */
export class CircularBuffer<T> {
  private readonly buffer: (T | undefined)[];
  private readonly capacity: number;
  private head = 0;
  private tail = 0;
  private _size = 0;

  constructor(capacity: number) {
    if (capacity <= 0) throw new RangeError('Capacity must be greater than zero');
    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }

  get size(): number {
    return this._size;
  }

  get isFull(): boolean {
    return this._size === this.capacity;
  }

  get isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Pushes element into the buffer.
   * If buffer is full, it overwrites the oldest element and advances head.
   */
  push(item: T): void {
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;

    if (this._size < this.capacity) {
      this._size++;
    } else {
      this.head = (this.head + 1) % this.capacity; // overwrite oldest
    }
  }

  /**
   * Pops oldest item from the buffer.
   */
  pop(): T | undefined {
    if (this._size === 0) return undefined;

    const item = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this._size--;
    return item;
  }

  peek(): T | undefined {
    return this._size === 0 ? undefined : this.buffer[this.head];
  }

  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this._size; i++) {
      result.push(this.buffer[(this.head + i) % this.capacity]!);
    }
    return result;
  }
}

/**
 * Multimap / MultiDictionary (associates multiple values with a single key).
 * Standard in C++ (std::multimap) and Java Guava (Multimap).
 */
export class MultiMap<K, V> {
  private readonly map = new Map<K, Set<V>>();
  private _size = 0;

  get size(): number {
    return this._size;
  }

  set(key: K, value: V): void {
    let set = this.map.get(key);
    if (!set) {
      set = new Set<V>();
      this.map.set(key, set);
    }
    if (!set.has(value)) {
      set.add(value);
      this._size++;
    }
  }

  get(key: K): readonly V[] {
    const set = this.map.get(key);
    return set ? Array.from(set) : [];
  }

  has(key: K, value?: V): boolean {
    const set = this.map.get(key);
    if (!set) return false;
    return value !== undefined ? set.has(value) : set.size > 0;
  }

  delete(key: K, value?: V): boolean {
    const set = this.map.get(key);
    if (!set) return false;

    if (value !== undefined) {
      const removed = set.delete(value);
      if (removed) {
        this._size--;
        if (set.size === 0) this.map.delete(key);
      }
      return removed;
    } else {
      this._size -= set.size;
      return this.map.delete(key);
    }
  }

  clear(): void {
    this.map.clear();
    this._size = 0;
  }
}

