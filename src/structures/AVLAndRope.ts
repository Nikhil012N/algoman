/**
 * AVL Tree (Adelson-Velsky and Landis)
 * Strictly height-balanced binary search tree:
 * Height difference between left and right subtrees (balance factor) is at most 1.
 * Provides faster lookups than Red-Black trees due to more rigid balancing.
 * - Search: O(log N)
 * - Insert: O(log N)
 * - Delete: O(log N)
 */
class AVLNode<K, V> {
  key: K;
  value: V;
  height = 1;
  left: AVLNode<K, V> | null = null;
  right: AVLNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class AVLTree<K, V> implements Iterable<[K, V]> {
  private root: AVLNode<K, V> | null = null;
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
    let curr = this.root;
    while (curr) {
      const cmp = this.compare(key, curr.key);
      if (cmp === 0) return curr.value;
      curr = cmp < 0 ? curr.left : curr.right;
    }
    return undefined;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  set(key: K, value: V): this {
    this.root = this.insertNode(this.root, key, value);
    return this;
  }

  delete(key: K): boolean {
    if (!this.has(key)) return false;
    this.root = this.deleteNode(this.root, key);
    this._size--;
    return true;
  }

  *[Symbol.iterator](): Iterator<[K, V]> {
    function* inorder(node: AVLNode<K, V> | null): Generator<[K, V]> {
      if (node) {
        yield* inorder(node.left);
        yield [node.key, node.value];
        yield* inorder(node.right);
      }
    }
    yield* inorder(this.root);
  }

  private height(node: AVLNode<K, V> | null): number {
    return node ? node.height : 0;
  }

  private balanceFactor(node: AVLNode<K, V> | null): number {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  private updateHeight(node: AVLNode<K, V>): void {
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  private rotateRight(y: AVLNode<K, V>): AVLNode<K, V> {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  private rotateLeft(x: AVLNode<K, V>): AVLNode<K, V> {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  private insertNode(node: AVLNode<K, V> | null, key: K, value: V): AVLNode<K, V> {
    if (!node) {
      this._size++;
      return new AVLNode(key, value);
    }

    const cmp = this.compare(key, node.key);
    if (cmp === 0) {
      node.value = value;
      return node;
    } else if (cmp < 0) {
      node.left = this.insertNode(node.left, key, value);
    } else {
      node.right = this.insertNode(node.right, key, value);
    }

    this.updateHeight(node);
    const balance = this.balanceFactor(node);

    // Left-Left
    if (balance > 1 && this.compare(key, node.left!.key) < 0) {
      return this.rotateRight(node);
    }

    // Right-Right
    if (balance < -1 && this.compare(key, node.right!.key) > 0) {
      return this.rotateLeft(node);
    }

    // Left-Right
    if (balance > 1 && this.compare(key, node.left!.key) > 0) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // Right-Left
    if (balance < -1 && this.compare(key, node.right!.key) < 0) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  private deleteNode(node: AVLNode<K, V> | null, key: K): AVLNode<K, V> | null {
    if (!node) return null;

    const cmp = this.compare(key, node.key);
    if (cmp < 0) {
      node.left = this.deleteNode(node.left, key);
    } else if (cmp > 0) {
      node.right = this.deleteNode(node.right, key);
    } else {
      // Node with only one child or no child
      if (!node.left || !node.right) {
        node = node.left ?? node.right;
      } else {
        // Node with two children: get inorder successor (min in right subtree)
        let succ = node.right;
        while (succ.left) succ = succ.left;

        node.key = succ.key;
        node.value = succ.value;
        node.right = this.deleteNode(node.right, succ.key);
      }
    }

    if (!node) return null;

    this.updateHeight(node);
    const balance = this.balanceFactor(node);

    // Left-Left
    if (balance > 1 && this.balanceFactor(node.left) >= 0) {
      return this.rotateRight(node);
    }

    // Left-Right
    if (balance > 1 && this.balanceFactor(node.left) < 0) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // Right-Right
    if (balance < -1 && this.balanceFactor(node.right) <= 0) {
      return this.rotateLeft(node);
    }

    // Right-Left
    if (balance < -1 && this.balanceFactor(node.right) > 0) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }
}

/**
 * Rope (Heavy String Data Structure)
 * Binary tree where leaf nodes contain short string slices.
 * Used in high-performance text editors (VS Code, Sublime Text, Emacs)
 * to allow O(log N) string insertions, deletions, and splits without copying megabytes of string memory.
 */
class RopeNode {
  weight: number;
  left: RopeNode | null = null;
  right: RopeNode | null = null;
  text = '';

  constructor(text = '', weight = text.length) {
    this.text = text;
    this.weight = weight;
  }
}

export class Rope {
  private root: RopeNode | null = null;
  private readonly maxLeafLen = 32;

  constructor(initialText = '') {
    if (initialText.length > 0) {
      this.root = this.build(initialText);
    }
  }

  get length(): number {
    return this.calcLength(this.root);
  }

  /**
   * Concatenates another rope to this one in O(1) time.
   */
  concat(other: Rope): void {
    if (!other.root) return;
    if (!this.root) {
      this.root = other.root;
      return;
    }

    const newRoot = new RopeNode('', this.length);
    newRoot.left = this.root;
    newRoot.right = other.root;
    this.root = newRoot;
  }

  /**
   * Inserts text at the given 0-based index in O(log N) time.
   */
  insert(index: number, text: string): void {
    const [left, right] = this.split(this.root, index);
    const middle = this.build(text);

    const mergedLeft = this.mergeNodes(left, middle);
    this.root = this.mergeNodes(mergedLeft, right);
  }

  /**
   * Converts the entire rope back to a single string in O(N) time.
   */
  toString(): string {
    const out: string[] = [];
    const traverse = (node: RopeNode | null) => {
      if (!node) return;
      if (!node.left && !node.right) {
        out.push(node.text);
      } else {
        traverse(node.left);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return out.join('');
  }

  private build(str: string): RopeNode | null {
    if (str.length === 0) return null;
    if (str.length <= this.maxLeafLen) {
      return new RopeNode(str, str.length);
    }
    const mid = Math.floor(str.length / 2);
    const node = new RopeNode('', mid);
    node.left = this.build(str.slice(0, mid));
    node.right = this.build(str.slice(mid));
    return node;
  }

  private calcLength(node: RopeNode | null): number {
    if (!node) return 0;
    if (!node.left && !node.right) return node.text.length;
    return node.weight + this.calcLength(node.right);
  }

  private mergeNodes(n1: RopeNode | null, n2: RopeNode | null): RopeNode | null {
    if (!n1) return n2;
    if (!n2) return n1;
    const parent = new RopeNode('', this.calcLength(n1));
    parent.left = n1;
    parent.right = n2;
    return parent;
  }

  private split(node: RopeNode | null, index: number): [RopeNode | null, RopeNode | null] {
    if (!node) return [null, null];

    if (!node.left && !node.right) {
      const leftText = node.text.slice(0, index);
      const rightText = node.text.slice(index);
      return [this.build(leftText), this.build(rightText)];
    }

    if (index < node.weight) {
      const [l1, l2] = this.split(node.left, index);
      return [l1, this.mergeNodes(l2, node.right)];
    } else {
      const [r1, r2] = this.split(node.right, index - node.weight);
      return [this.mergeNodes(node.left, r1), r2];
    }
  }
}

