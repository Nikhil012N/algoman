import { Comparator } from '../types';
import { defaultComparator } from '../algorithms/search';

enum NodeColor {
  RED,
  BLACK,
}

class RBNode<K, V> {
  key: K;
  value: V;
  color: NodeColor = NodeColor.RED;
  left: RBNode<K, V> | null = null;
  right: RBNode<K, V> | null = null;
  parent: RBNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

/**
 * Red-Black Tree backed SortedMap (similar to Java's TreeMap / C++ std::map).
 * Provides guaranteed O(log N) operations for insert, delete, search, min, max, lowerKey, higherKey.
 */
export class SortedMap<K, V> implements Iterable<[K, V]> {
  private root: RBNode<K, V> | null = null;
  private _size = 0;
  private readonly compare: Comparator<K>;

  constructor(comparator?: Comparator<K>) {
    this.compare = comparator ?? defaultComparator;
  }

  get size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  has(key: K): boolean {
    return this.findNode(key) !== null;
  }

  get(key: K): V | undefined {
    return this.findNode(key)?.value;
  }

  set(key: K, value: V): this {
    let parent: RBNode<K, V> | null = null;
    let curr = this.root;

    while (curr !== null) {
      parent = curr;
      const cmp = this.compare(key, curr.key);
      if (cmp === 0) {
        curr.value = value;
        return this;
      } else if (cmp < 0) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }

    const newNode = new RBNode(key, value);
    newNode.parent = parent;

    if (parent === null) {
      this.root = newNode;
    } else if (this.compare(key, parent.key) < 0) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    this._size++;
    this.insertFixup(newNode);
    return this;
  }

  delete(key: K): boolean {
    const z = this.findNode(key);
    if (!z) return false;

    let y = z;
    let yOriginalColor = y.color;
    let x: RBNode<K, V> | null = null;

    if (z.left === null) {
      x = z.right;
      this.transplant(z, z.right);
    } else if (z.right === null) {
      x = z.left;
      this.transplant(z, z.left);
    } else {
      y = this.minimum(z.right);
      yOriginalColor = y.color;
      x = y.right;
      if (y.parent === z) {
        if (x) x.parent = y;
      } else {
        this.transplant(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }
      this.transplant(z, y);
      y.left = z.left;
      y.left.parent = y;
      y.color = z.color;
    }

    this._size--;
    if (yOriginalColor === NodeColor.BLACK && x) {
      this.deleteFixup(x);
    }
    return true;
  }

  minKey(): K | undefined {
    return this.root ? this.minimum(this.root).key : undefined;
  }

  maxKey(): K | undefined {
    return this.root ? this.maximum(this.root).key : undefined;
  }

  /**
   * Returns the greatest key strictly less than the given key.
   */
  lowerKey(key: K): K | undefined {
    let curr = this.root;
    let best: K | undefined;

    while (curr !== null) {
      if (this.compare(curr.key, key) < 0) {
        best = curr.key;
        curr = curr.right;
      } else {
        curr = curr.left;
      }
    }
    return best;
  }

  /**
   * Returns the least key strictly greater than the given key.
   */
  higherKey(key: K): K | undefined {
    let curr = this.root;
    let best: K | undefined;

    while (curr !== null) {
      if (this.compare(curr.key, key) > 0) {
        best = curr.key;
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }
    return best;
  }

  clear(): void {
    this.root = null;
    this._size = 0;
  }

  *[Symbol.iterator](): Iterator<[K, V]> {
    function* inorder(node: RBNode<K, V> | null): Generator<[K, V]> {
      if (node !== null) {
        yield* inorder(node.left);
        yield [node.key, node.value];
        yield* inorder(node.right);
      }
    }
    yield* inorder(this.root);
  }

  private findNode(key: K): RBNode<K, V> | null {
    let curr = this.root;
    while (curr !== null) {
      const cmp = this.compare(key, curr.key);
      if (cmp === 0) return curr;
      curr = cmp < 0 ? curr.left : curr.right;
    }
    return null;
  }

  private minimum(node: RBNode<K, V>): RBNode<K, V> {
    let curr = node;
    while (curr.left !== null) curr = curr.left;
    return curr;
  }

  private maximum(node: RBNode<K, V>): RBNode<K, V> {
    let curr = node;
    while (curr.right !== null) curr = curr.right;
    return curr;
  }

  private rotateLeft(x: RBNode<K, V>): void {
    const y = x.right!;
    x.right = y.left;
    if (y.left !== null) y.left.parent = x;
    y.parent = x.parent;
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
  }

  private rotateRight(y: RBNode<K, V>): void {
    const x = y.left!;
    y.left = x.right;
    if (x.right !== null) x.right.parent = y;
    x.parent = y.parent;
    if (y.parent === null) {
      this.root = x;
    } else if (y === y.parent.right) {
      y.parent.right = x;
    } else {
      y.parent.left = x;
    }
    x.right = y;
    y.parent = x;
  }

  private insertFixup(z: RBNode<K, V>): void {
    let curr = z;
    while (curr.parent !== null && curr.parent.color === NodeColor.RED) {
      if (curr.parent === curr.parent.parent?.left) {
        const y = curr.parent.parent.right;
        if (y !== null && y.color === NodeColor.RED) {
          curr.parent.color = NodeColor.BLACK;
          y.color = NodeColor.BLACK;
          curr.parent.parent.color = NodeColor.RED;
          curr = curr.parent.parent;
        } else {
          if (curr === curr.parent.right) {
            curr = curr.parent;
            this.rotateLeft(curr);
          }
          curr.parent!.color = NodeColor.BLACK;
          curr.parent!.parent!.color = NodeColor.RED;
          this.rotateRight(curr.parent!.parent!);
        }
      } else if (curr.parent === curr.parent.parent?.right) {
        const y = curr.parent.parent.left;
        if (y !== null && y.color === NodeColor.RED) {
          curr.parent.color = NodeColor.BLACK;
          y.color = NodeColor.BLACK;
          curr.parent.parent.color = NodeColor.RED;
          curr = curr.parent.parent;
        } else {
          if (curr === curr.parent.left) {
            curr = curr.parent;
            this.rotateRight(curr);
          }
          curr.parent!.color = NodeColor.BLACK;
          curr.parent!.parent!.color = NodeColor.RED;
          this.rotateLeft(curr.parent!.parent!);
        }
      }
    }
    if (this.root !== null) this.root.color = NodeColor.BLACK;
  }

  private transplant(u: RBNode<K, V>, v: RBNode<K, V> | null): void {
    if (u.parent === null) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    if (v !== null) {
      v.parent = u.parent;
    }
  }

  private deleteFixup(x: RBNode<K, V>): void {
    let curr = x;
    while (curr !== this.root && curr.color === NodeColor.BLACK) {
      if (curr === curr.parent?.left) {
        let w = curr.parent.right;
        if (w?.color === NodeColor.RED) {
          w.color = NodeColor.BLACK;
          curr.parent.color = NodeColor.RED;
          this.rotateLeft(curr.parent);
          w = curr.parent.right;
        }
        if (w && (w.left?.color ?? NodeColor.BLACK) === NodeColor.BLACK && (w.right?.color ?? NodeColor.BLACK) === NodeColor.BLACK) {
          w.color = NodeColor.RED;
          curr = curr.parent;
        } else {
          if (w && (w.right?.color ?? NodeColor.BLACK) === NodeColor.BLACK) {
            if (w.left) w.left.color = NodeColor.BLACK;
            w.color = NodeColor.RED;
            this.rotateRight(w);
            w = curr.parent.right;
          }
          if (w) {
            w.color = curr.parent.color;
            curr.parent.color = NodeColor.BLACK;
            if (w.right) w.right.color = NodeColor.BLACK;
            this.rotateLeft(curr.parent);
          }
          curr = this.root!;
        }
      } else if (curr.parent) {
        let w = curr.parent.left;
        if (w?.color === NodeColor.RED) {
          w.color = NodeColor.BLACK;
          curr.parent.color = NodeColor.RED;
          this.rotateRight(curr.parent);
          w = curr.parent.left;
        }
        if (w && (w.right?.color ?? NodeColor.BLACK) === NodeColor.BLACK && (w.left?.color ?? NodeColor.BLACK) === NodeColor.BLACK) {
          w.color = NodeColor.RED;
          curr = curr.parent;
        } else {
          if (w && (w.left?.color ?? NodeColor.BLACK) === NodeColor.BLACK) {
            if (w.right) w.right.color = NodeColor.BLACK;
            w.color = NodeColor.RED;
            this.rotateLeft(w);
            w = curr.parent.left;
          }
          if (w) {
            w.color = curr.parent.color;
            curr.parent.color = NodeColor.BLACK;
            if (w.left) w.left.color = NodeColor.BLACK;
            this.rotateRight(curr.parent);
          }
          curr = this.root!;
        }
      }
    }
    curr.color = NodeColor.BLACK;
  }
}

/**
 * Sorted Set (backed by Red-Black Tree SortedMap)
 * Like C++ std::set or Java's TreeSet.
 */
export class SortedSet<T> implements Iterable<T> {
  private readonly map: SortedMap<T, true>;

  constructor(comparator?: Comparator<T>) {
    this.map = new SortedMap<T, true>(comparator);
  }

  get size(): number {
    return this.map.size;
  }

  isEmpty(): boolean {
    return this.map.isEmpty();
  }

  add(value: T): this {
    this.map.set(value, true);
    return this;
  }

  has(value: T): boolean {
    return this.map.has(value);
  }

  delete(value: T): boolean {
    return this.map.delete(value);
  }

  min(): T | undefined {
    return this.map.minKey();
  }

  max(): T | undefined {
    return this.map.maxKey();
  }

  lower(value: T): T | undefined {
    return this.map.lowerKey(value);
  }

  higher(value: T): T | undefined {
    return this.map.higherKey(value);
  }

  clear(): void {
    this.map.clear();
  }

  *[Symbol.iterator](): Iterator<T> {
    for (const [key] of this.map) {
      yield key;
    }
  }
}

