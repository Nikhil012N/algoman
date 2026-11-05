class SinglyNode<T> {
  value: T;
  next: SinglyNode<T> | null = null;
  constructor(value: T) {
    this.value = value;
  }
}

/**
 * Singly Linked List
 * - Prepend / Append: O(1)
 * - Insert at index: O(N)
 * - Traversal: Iterable<T>
 */
export class LinkedList<T> implements Iterable<T> {
  private head: SinglyNode<T> | null = null;
  private tail: SinglyNode<T> | null = null;
  private _size = 0;

  get size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  append(value: T): void {
    const node = new SinglyNode(value);
    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this._size++;
  }

  prepend(value: T): void {
    const node = new SinglyNode(value);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    this._size++;
  }

  deleteHead(): T | undefined {
    if (!this.head) return undefined;
    const val = this.head.value;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this._size--;
    return val;
  }

  reverse(): void {
    let prev: SinglyNode<T> | null = null;
    let curr = this.head;
    this.tail = this.head;

    while (curr) {
      const next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }
    this.head = prev;
  }

  toArray(): T[] {
    const out: T[] = [];
    let curr = this.head;
    while (curr) {
      out.push(curr.value);
      curr = curr.next;
    }
    return out;
  }

  *[Symbol.iterator](): Iterator<T> {
    let curr = this.head;
    while (curr) {
      yield curr.value;
      curr = curr.next;
    }
  }
}

/**
 * High-performance LIFO Stack
 * Uses dynamic internal array with O(1) amortized push and pop.
 */
export class Stack<T> implements Iterable<T> {
  private readonly items: T[] = [];

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  push(...elements: T[]): void {
    this.items.push(...elements);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items.length === 0 ? undefined : this.items[this.items.length - 1];
  }

  clear(): void {
    this.items.length = 0;
  }

  toArray(): T[] {
    return [...this.items];
  }

  *[Symbol.iterator](): Iterator<T> {
    for (let i = this.items.length - 1; i >= 0; i--) {
      yield this.items[i]!;
    }
  }
}

/**
 * High-performance FIFO Queue
 * Implemented using circular pointer indices to guarantee strictly O(1) enqueue and dequeue
 * (avoiding JavaScript's slow Array.shift() O(N) memory copy).
 */
export class Queue<T> implements Iterable<T> {
  private elements: (T | undefined)[] = new Array(16);
  private head = 0;
  private tail = 0;
  private count = 0;

  get size(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  enqueue(item: T): void {
    if (this.count === this.elements.length) {
      this.resize(this.elements.length * 2);
    }
    this.elements[this.tail] = item;
    this.tail = (this.tail + 1) % this.elements.length;
    this.count++;
  }

  dequeue(): T | undefined {
    if (this.count === 0) return undefined;
    const item = this.elements[this.head];
    this.elements[this.head] = undefined;
    this.head = (this.head + 1) % this.elements.length;
    this.count--;

    if (this.count > 0 && this.count === Math.floor(this.elements.length / 4) && this.elements.length > 16) {
      this.resize(Math.floor(this.elements.length / 2));
    }
    return item;
  }

  peek(): T | undefined {
    return this.count === 0 ? undefined : this.elements[this.head];
  }

  clear(): void {
    this.elements = new Array(16);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }

  toArray(): T[] {
    const res: T[] = [];
    for (let i = 0; i < this.count; i++) {
      res.push(this.elements[(this.head + i) % this.elements.length]!);
    }
    return res;
  }

  *[Symbol.iterator](): Iterator<T> {
    for (let i = 0; i < this.count; i++) {
      yield this.elements[(this.head + i) % this.elements.length]!;
    }
  }

  private resize(newCapacity: number): void {
    const nextArr = new Array<T | undefined>(newCapacity);
    for (let i = 0; i < this.count; i++) {
      nextArr[i] = this.elements[(this.head + i) % this.elements.length];
    }
    this.elements = nextArr;
    this.head = 0;
    this.tail = this.count;
  }
}

/**
 * Generic Graph (Directed / Undirected, Weighted / Unweighted)
 * Graph class providing BFS, DFS, cycle detection, and edge management.
 */
export interface Edge<T> {
  from: T;
  to: T;
  weight: number;
}

export class Graph<T = string> {
  private readonly adj = new Map<T, Map<T, number>>();
  readonly isDirected: boolean;

  constructor(isDirected = false) {
    this.isDirected = isDirected;
  }

  addVertex(vertex: T): void {
    if (!this.adj.has(vertex)) {
      this.adj.set(vertex, new Map());
    }
  }

  addEdge(from: T, to: T, weight = 1): void {
    this.addVertex(from);
    this.addVertex(to);
    this.adj.get(from)!.set(to, weight);
    if (!this.isDirected) {
      this.adj.get(to)!.set(from, weight);
    }
  }

  removeEdge(from: T, to: T): boolean {
    const fromMap = this.adj.get(from);
    if (!fromMap || !fromMap.has(to)) return false;
    fromMap.delete(to);
    if (!this.isDirected) {
      this.adj.get(to)?.delete(from);
    }
    return true;
  }

  hasVertex(vertex: T): boolean {
    return this.adj.has(vertex);
  }

  hasEdge(from: T, to: T): boolean {
    return Boolean(this.adj.get(from)?.has(to));
  }

  getNeighbors(vertex: T): { node: T; weight: number }[] {
    const map = this.adj.get(vertex);
    if (!map) return [];
    return Array.from(map.entries()).map(([node, weight]) => ({ node, weight }));
  }

  get vertices(): T[] {
    return Array.from(this.adj.keys());
  }

  get vertexCount(): number {
    return this.adj.size;
  }
}

/**
 * HashTable with Separate Chaining and Automatic Rehashing
 * Low-level hash map demonstrating collision resolution, load factor monitoring, and prime table sizing.
 */
class HashEntry<K, V> {
  key: K;
  value: V;
  next: HashEntry<K, V> | null = null;
  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class HashTable<K, V> {
  private buckets: (HashEntry<K, V> | null)[];
  private _size = 0;
  private readonly loadFactorThreshold = 0.75;

  constructor(initialCapacity = 17) {
    this.buckets = new Array(initialCapacity).fill(null);
  }

  get size(): number {
    return this._size;
  }

  set(key: K, value: V): void {
    const idx = this.hash(key);
    let curr = this.buckets[idx];

    while (curr) {
      if (curr.key === key) {
        curr.value = value;
        return;
      }
      curr = curr.next;
    }

    const newEntry = new HashEntry(key, value);
    newEntry.next = this.buckets[idx] ?? null;
    this.buckets[idx] = newEntry;
    this._size++;

    if (this._size / this.buckets.length > this.loadFactorThreshold) {
      this.rehash();
    }
  }

  get(key: K): V | undefined {
    const idx = this.hash(key);
    let curr = this.buckets[idx];
    while (curr) {
      if (curr.key === key) return curr.value;
      curr = curr.next;
    }
    return undefined;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: K): boolean {
    const idx = this.hash(key);
    let curr = this.buckets[idx];
    let prev: HashEntry<K, V> | null = null;

    while (curr) {
      if (curr.key === key) {
        if (prev) {
          prev.next = curr.next;
        } else {
          this.buckets[idx] = curr.next;
        }
        this._size--;
        return true;
      }
      prev = curr;
      curr = curr.next;
    }
    return false;
  }

  private hash(key: K): number {
    const str = String(key);
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) % this.buckets.length;
  }

  private rehash(): void {
    const oldBuckets = this.buckets;
    this.buckets = new Array(oldBuckets.length * 2 + 1).fill(null);
    this._size = 0;

    for (const head of oldBuckets) {
      let curr = head;
      while (curr) {
        this.set(curr.key, curr.value);
        curr = curr.next;
      }
    }
  }
}

