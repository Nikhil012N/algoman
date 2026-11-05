const MAX_LEVEL = 16;
const P = 0.5;

class SkipNode<K, V> {
  key: K;
  value: V;
  forward: (SkipNode<K, V> | null)[];

  constructor(key: K, value: V, level: number) {
    this.key = key;
    this.value = value;
    this.forward = new Array<SkipNode<K, V> | null>(level).fill(null);
  }
}

/**
 * SkipList
 * Probabilistic alternative to balanced trees (used in Redis Sorted Sets, RocksDB, LevelDB).
 * Delivers O(log N) average time for search, insertion, and deletion without complex tree rotations.
 */
export class SkipList<K, V> implements Iterable<[K, V]> {
  private readonly head: SkipNode<K, V>;
  private level = 1;
  private _size = 0;
  private readonly compare: (a: K, b: K) => number;

  constructor(comparator?: (a: K, b: K) => number) {
    this.compare = comparator ?? ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    this.head = new SkipNode<K, V>(null as unknown as K, null as unknown as V, MAX_LEVEL);
  }

  get size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  search(key: K): V | undefined {
    let curr = this.head;
    for (let i = this.level - 1; i >= 0; i--) {
      while (curr.forward[i] && this.compare(curr.forward[i]!.key, key) < 0) {
        curr = curr.forward[i]!;
      }
    }
    curr = curr.forward[0]!;
    if (curr && this.compare(curr.key, key) === 0) {
      return curr.value;
    }
    return undefined;
  }

  insert(key: K, value: V): void {
    const update = new Array<SkipNode<K, V>>(MAX_LEVEL);
    let curr = this.head;

    for (let i = this.level - 1; i >= 0; i--) {
      while (curr.forward[i] && this.compare(curr.forward[i]!.key, key) < 0) {
        curr = curr.forward[i]!;
      }
      update[i] = curr;
    }

    curr = curr.forward[0]!;

    if (curr && this.compare(curr.key, key) === 0) {
      curr.value = value;
      return;
    }

    const newLevel = this.randomLevel();
    if (newLevel > this.level) {
      for (let i = this.level; i < newLevel; i++) {
        update[i] = this.head;
      }
      this.level = newLevel;
    }

    const newNode = new SkipNode<K, V>(key, value, newLevel);
    for (let i = 0; i < newLevel; i++) {
      newNode.forward[i] = update[i]!.forward[i] ?? null;
      update[i]!.forward[i] = newNode;
    }
    this._size++;
  }

  delete(key: K): boolean {
    const update = new Array<SkipNode<K, V>>(MAX_LEVEL);
    let curr = this.head;

    for (let i = this.level - 1; i >= 0; i--) {
      while (curr.forward[i] && this.compare(curr.forward[i]!.key, key) < 0) {
        curr = curr.forward[i]!;
      }
      update[i] = curr;
    }

    curr = curr.forward[0]!;

    if (!curr || this.compare(curr.key, key) !== 0) {
      return false;
    }

    for (let i = 0; i < this.level; i++) {
      if (update[i]!.forward[i] !== curr) break;
      update[i]!.forward[i] = curr.forward[i] ?? null;
    }

    while (this.level > 1 && this.head.forward[this.level - 1] === null) {
      this.level--;
    }

    this._size--;
    return true;
  }

  *[Symbol.iterator](): Iterator<[K, V]> {
    let curr = this.head.forward[0];
    while (curr) {
      yield [curr.key, curr.value];
      curr = curr.forward[0];
    }
  }

  private randomLevel(): number {
    let lvl = 1;
    while (Math.random() < P && lvl < MAX_LEVEL) {
      lvl++;
    }
    return lvl;
  }
}

