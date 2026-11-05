/**
 * Treap (Tree + Heap)
 * Randomized Cartesian Binary Search Tree providing O(log N) split and merge operations.
 * Forms the foundational engine for rope data structures, implicit index arrays, and range-reversal.
 */
class TreapNode<T> {
  value: T;
  priority: number;
  size: number;
  left: TreapNode<T> | null = null;
  right: TreapNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
    this.priority = Math.random();
    this.size = 1;
  }
}

export class Treap<T> implements Iterable<T> {
  private root: TreapNode<T> | null = null;
  private readonly compare: (a: T, b: T) => number;

  constructor(comparator?: (a: T, b: T) => number) {
    this.compare = comparator ?? ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }

  get size(): number {
    return this.getNodeSize(this.root);
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  insert(value: T): void {
    const [left, right] = this.split(this.root, value);
    const newNode = new TreapNode(value);
    this.root = this.merge(this.merge(left, newNode), right);
  }

  delete(value: T): boolean {
    if (!this.has(value)) return false;
    const [left, temp] = this.split(this.root, value, false); // elements < value
    const [, right] = this.split(temp, value, true);          // elements > value
    this.root = this.merge(left, right);
    return true;
  }

  has(value: T): boolean {
    let curr = this.root;
    while (curr) {
      const cmp = this.compare(value, curr.value);
      if (cmp === 0) return true;
      curr = cmp < 0 ? curr.left : curr.right;
    }
    return false;
  }

  /**
   * Returns the k-th smallest element (0-indexed).
   */
  kthSmallest(k: number): T | undefined {
    if (k < 0 || k >= this.size) return undefined;

    let curr = this.root;
    while (curr) {
      const leftSize = this.getNodeSize(curr.left);
      if (k === leftSize) return curr.value;
      if (k < leftSize) {
        curr = curr.left;
      } else {
        k -= leftSize + 1;
        curr = curr.right;
      }
    }
    return undefined;
  }

  *[Symbol.iterator](): Iterator<T> {
    function* inorder(node: TreapNode<T> | null): Generator<T> {
      if (node) {
        yield* inorder(node.left);
        yield node.value;
        yield* inorder(node.right);
      }
    }
    yield* inorder(this.root);
  }

  private getNodeSize(node: TreapNode<T> | null): number {
    return node ? node.size : 0;
  }

  private updateSize(node: TreapNode<T> | null): void {
    if (node) {
      node.size = 1 + this.getNodeSize(node.left) + this.getNodeSize(node.right);
    }
  }

  private split(
    node: TreapNode<T> | null,
    val: T,
    includeEqual = true,
  ): [TreapNode<T> | null, TreapNode<T> | null] {
    if (!node) return [null, null];

    const cmp = this.compare(node.value, val);
    const goLeft = includeEqual ? cmp <= 0 : cmp < 0;

    if (goLeft) {
      const [rLeft, rRight] = this.split(node.right, val, includeEqual);
      node.right = rLeft;
      this.updateSize(node);
      return [node, rRight];
    } else {
      const [lLeft, lRight] = this.split(node.left, val, includeEqual);
      node.left = lRight;
      this.updateSize(node);
      return [lLeft, node];
    }
  }

  private merge(
    left: TreapNode<T> | null,
    right: TreapNode<T> | null,
  ): TreapNode<T> | null {
    if (!left) return right;
    if (!right) return left;

    if (left.priority > right.priority) {
      left.right = this.merge(left.right, right);
      this.updateSize(left);
      return left;
    } else {
      right.left = this.merge(left, right.left);
      this.updateSize(right);
      return right;
    }
  }
}

