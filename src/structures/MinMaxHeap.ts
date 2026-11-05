/**
 * Min-Max Heap
 * Double-ended priority queue supporting O(1) minimum AND O(1) maximum access simultaneously.
 * - Insertion: O(log N)
 * - Delete Min / Delete Max: O(log N)
 */
export class MinMaxHeap<T> {
  private readonly heap: T[] = [];
  private readonly compare: (a: T, b: T) => number;

  constructor(comparator?: (a: T, b: T) => number) {
    this.compare = comparator ?? ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }

  get size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  getMin(): T | undefined {
    return this.heap[0];
  }

  getMax(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap[0];
    if (this.heap.length === 2) return this.heap[1];
    return this.compare(this.heap[1]!, this.heap[2]!) >= 0 ? this.heap[1] : this.heap[2];
  }

  push(value: T): void {
    this.heap.push(value);
    this.pushUp(this.heap.length - 1);
  }

  popMin(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.pushDown(0);
    return min;
  }

  popMax(): T | undefined {
    if (this.heap.length <= 2) {
      if (this.heap.length === 0) return undefined;
      if (this.heap.length === 1) return this.heap.pop();
      return this.heap.pop(); // index 1
    }

    const maxIdx = this.compare(this.heap[1]!, this.heap[2]!) >= 0 ? 1 : 2;
    const maxVal = this.heap[maxIdx];

    const last = this.heap.pop()!;
    if (maxIdx < this.heap.length) {
      this.heap[maxIdx] = last;
      this.pushDown(maxIdx);
    }
    return maxVal;
  }

  private isMinLevel(index: number): boolean {
    const level = Math.floor(Math.log2(index + 1));
    return level % 2 === 0;
  }

  private pushUp(index: number): void {
    if (index === 0) return;
    const parent = Math.floor((index - 1) / 2);

    if (this.isMinLevel(index)) {
      if (this.compare(this.heap[index]!, this.heap[parent]!) > 0) {
        this.swap(index, parent);
        this.pushUpMax(parent);
      } else {
        this.pushUpMin(index);
      }
    } else {
      if (this.compare(this.heap[index]!, this.heap[parent]!) < 0) {
        this.swap(index, parent);
        this.pushUpMin(parent);
      } else {
        this.pushUpMax(index);
      }
    }
  }

  private pushUpMin(index: number): void {
    while (index >= 3) {
      const grandParent = Math.floor((Math.floor((index - 1) / 2) - 1) / 2);
      if (this.compare(this.heap[index]!, this.heap[grandParent]!) < 0) {
        this.swap(index, grandParent);
        index = grandParent;
      } else {
        break;
      }
    }
  }

  private pushUpMax(index: number): void {
    while (index >= 3) {
      const grandParent = Math.floor((Math.floor((index - 1) / 2) - 1) / 2);
      if (this.compare(this.heap[index]!, this.heap[grandParent]!) > 0) {
        this.swap(index, grandParent);
        index = grandParent;
      } else {
        break;
      }
    }
  }

  private pushDown(index: number): void {
    if (this.isMinLevel(index)) {
      this.pushDownMin(index);
    } else {
      this.pushDownMax(index);
    }
  }

  private pushDownMin(index: number): void {
    const m = this.findSmallestChildOrGrandchild(index);
    if (m === -1) return;

    if (this.isGrandchild(index, m)) {
      if (this.compare(this.heap[m]!, this.heap[index]!) < 0) {
        this.swap(m, index);
        const parent = Math.floor((m - 1) / 2);
        if (this.compare(this.heap[m]!, this.heap[parent]!) > 0) {
          this.swap(m, parent);
        }
        this.pushDownMin(m);
      }
    } else {
      if (this.compare(this.heap[m]!, this.heap[index]!) < 0) {
        this.swap(m, index);
      }
    }
  }

  private pushDownMax(index: number): void {
    const m = this.findLargestChildOrGrandchild(index);
    if (m === -1) return;

    if (this.isGrandchild(index, m)) {
      if (this.compare(this.heap[m]!, this.heap[index]!) > 0) {
        this.swap(m, index);
        const parent = Math.floor((m - 1) / 2);
        if (this.compare(this.heap[m]!, this.heap[parent]!) < 0) {
          this.swap(m, parent);
        }
        this.pushDownMax(m);
      }
    } else {
      if (this.compare(this.heap[m]!, this.heap[index]!) > 0) {
        this.swap(m, index);
      }
    }
  }

  private findSmallestChildOrGrandchild(i: number): number {
    const indices = [
      2 * i + 1,
      2 * i + 2,
      4 * i + 3,
      4 * i + 4,
      4 * i + 5,
      4 * i + 6,
    ].filter((idx) => idx < this.heap.length);

    if (indices.length === 0) return -1;
    let minIdx = indices[0]!;
    for (let j = 1; j < indices.length; j++) {
      if (this.compare(this.heap[indices[j]!]!, this.heap[minIdx]!) < 0) {
        minIdx = indices[j]!;
      }
    }
    return minIdx;
  }

  private findLargestChildOrGrandchild(i: number): number {
    const indices = [
      2 * i + 1,
      2 * i + 2,
      4 * i + 3,
      4 * i + 4,
      4 * i + 5,
      4 * i + 6,
    ].filter((idx) => idx < this.heap.length);

    if (indices.length === 0) return -1;
    let maxIdx = indices[0]!;
    for (let j = 1; j < indices.length; j++) {
      if (this.compare(this.heap[indices[j]!]!, this.heap[maxIdx]!) > 0) {
        maxIdx = indices[j]!;
      }
    }
    return maxIdx;
  }

  private isGrandchild(parent: number, candidate: number): boolean {
    return candidate >= 4 * parent + 3;
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j]!, this.heap[i]!];
  }
}

