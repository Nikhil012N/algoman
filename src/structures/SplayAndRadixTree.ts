/**
 * Splay Tree
 * Self-adjusting binary search tree where recently accessed elements are moved to the root via splay rotations.
 * - Amortized Time Complexity: O(log N) per operation
 * - Cache-oblivious: extremely fast for skewed access distributions (80/20 rule).
 */
class SplayNode<K, V> {
  key: K;
  value: V;
  left: SplayNode<K, V> | null = null;
  right: SplayNode<K, V> | null = null;
  parent: SplayNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class SplayTree<K, V> implements Iterable<[K, V]> {
  private root: SplayNode<K, V> | null = null;
  private _size = 0;
  private readonly compare: (a: K, b: K) => number;

  constructor(comparator?: (a: K, b: K) => number) {
    this.compare = comparator ?? ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }

  get size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  get(key: K): V | undefined {
    const node = this.find(key);
    if (node) {
      this.splay(node);
      return node.value;
    }
    return undefined;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  set(key: K, value: V): this {
    if (!this.root) {
      this.root = new SplayNode(key, value);
      this._size++;
      return this;
    }

    let curr: SplayNode<K, V> | null = this.root;
    let parent: SplayNode<K, V> | null = null;
    let cmp = 0;

    while (curr) {
      parent = curr;
      cmp = this.compare(key, curr.key);
      if (cmp === 0) {
        curr.value = value;
        this.splay(curr);
        return this;
      }
      curr = cmp < 0 ? curr.left : curr.right;
    }

    const newNode = new SplayNode(key, value);
    newNode.parent = parent;
    if (cmp < 0) {
      parent!.left = newNode;
    } else {
      parent!.right = newNode;
    }

    this._size++;
    this.splay(newNode);
    return this;
  }

  delete(key: K): boolean {
    const node = this.find(key);
    if (!node) return false;

    this.splay(node);

    if (!node.left) {
      this.replace(node, node.right);
    } else if (!node.right) {
      this.replace(node, node.left);
    } else {
      let minRight = node.right;
      while (minRight.left) minRight = minRight.left;

      if (minRight.parent !== node) {
        this.replace(minRight, minRight.right);
        minRight.right = node.right;
        minRight.right.parent = minRight;
      }

      this.replace(node, minRight);
      minRight.left = node.left;
      minRight.left.parent = minRight;
    }

    this._size--;
    return true;
  }

  *[Symbol.iterator](): Iterator<[K, V]> {
    function* inorder(node: SplayNode<K, V> | null): Generator<[K, V]> {
      if (node) {
        yield* inorder(node.left);
        yield [node.key, node.value];
        yield* inorder(node.right);
      }
    }
    yield* inorder(this.root);
  }

  private find(key: K): SplayNode<K, V> | null {
    let curr = this.root;
    while (curr) {
      const cmp = this.compare(key, curr.key);
      if (cmp === 0) return curr;
      curr = cmp < 0 ? curr.left : curr.right;
    }
    return null;
  }

  private splay(x: SplayNode<K, V>): void {
    while (x.parent) {
      if (!x.parent.parent) {
        // Zig step
        if (x.parent.left === x) {
          this.rotateRight(x.parent);
        } else {
          this.rotateLeft(x.parent);
        }
      } else if (x.parent.left === x && x.parent.parent.left === x.parent) {
        // Zig-Zig step
        this.rotateRight(x.parent.parent);
        this.rotateRight(x.parent);
      } else if (x.parent.right === x && x.parent.parent.right === x.parent) {
        // Zig-Zig step
        this.rotateLeft(x.parent.parent);
        this.rotateLeft(x.parent);
      } else if (x.parent.left === x && x.parent.parent.right === x.parent) {
        // Zig-Zag step
        this.rotateRight(x.parent);
        this.rotateLeft(x.parent);
      } else {
        // Zig-Zag step
        this.rotateLeft(x.parent);
        this.rotateRight(x.parent);
      }
    }
  }

  private rotateLeft(x: SplayNode<K, V>): void {
    const y = x.right!;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.parent = x.parent;
    if (!x.parent) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
  }

  private rotateRight(x: SplayNode<K, V>): void {
    const y = x.left!;
    x.left = y.right;
    if (y.right) y.right.parent = x;
    y.parent = x.parent;
    if (!x.parent) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }
    y.right = x;
    x.parent = y;
  }

  private replace(u: SplayNode<K, V>, v: SplayNode<K, V> | null): void {
    if (!u.parent) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    if (v) v.parent = u.parent;
  }
}

/**
 * Radix Tree (Compact / Compressed Trie)
 * Edges represent sequences of characters rather than single characters.
 * Fundamental to high-speed HTTP Routers (Gin, Echo in Go, Fastify, HttpRouter).
 */
class RadixNode<T> {
  path: string;
  value?: T;
  isLeaf = false;
  children: RadixNode<T>[] = [];

  constructor(path: string, value?: T) {
    this.path = path;
    this.value = value;
  }
}

export class RadixTree<T> {
  private readonly root = new RadixNode<T>('');
  private _size = 0;

  get size(): number {
    return this._size;
  }

  insert(key: string, value: T): void {
    if (typeof key !== 'string') return;
    this.insertInternal(this.root, key, value);
  }

  get(key: string): T | undefined {
    if (typeof key !== 'string') return undefined;
    return this.searchInternal(this.root, key);
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  private insertInternal(node: RadixNode<T>, key: string, value: T): void {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]!;
      const commonPrefixLen = this.getCommonPrefixLength(key, child.path);

      if (commonPrefixLen > 0) {
        if (commonPrefixLen === child.path.length) {
          // Full child match, recurse on remainder
          const remainder = key.slice(commonPrefixLen);
          if (remainder.length === 0) {
            if (!child.isLeaf) this._size++;
            child.value = value;
            child.isLeaf = true;
          } else {
            this.insertInternal(child, remainder, value);
          }
          return;
        }

        // Split child edge
        const splitNode = new RadixNode<T>(child.path.slice(0, commonPrefixLen));
        child.path = child.path.slice(commonPrefixLen);

        splitNode.children.push(child);
        node.children[i] = splitNode;

        const remainder = key.slice(commonPrefixLen);
        if (remainder.length === 0) {
          splitNode.value = value;
          splitNode.isLeaf = true;
          this._size++;
        } else {
          const newLeaf = new RadixNode<T>(remainder, value);
          newLeaf.isLeaf = true;
          splitNode.children.push(newLeaf);
          this._size++;
        }
        return;
      }
    }

    // No common prefix with existing children
    const newLeaf = new RadixNode<T>(key, value);
    newLeaf.isLeaf = true;
    node.children.push(newLeaf);
    this._size++;
  }

  private searchInternal(node: RadixNode<T>, key: string): T | undefined {
    if (key.length === 0) {
      return node.isLeaf ? node.value : undefined;
    }

    for (const child of node.children) {
      if (key.startsWith(child.path)) {
        return this.searchInternal(child, key.slice(child.path.length));
      }
    }

    return undefined;
  }

  private getCommonPrefixLength(a: string, b: string): number {
    const minLen = Math.min(a.length, b.length);
    let i = 0;
    while (i < minLen && a[i] === b[i]) {
      i++;
    }
    return i;
  }
}

