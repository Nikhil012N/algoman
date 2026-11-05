import { Comparator } from '../types';
import { defaultComparator } from '../algorithms/search';

/**
 * High-performance, edge-case safe Priority Queue / Binary Min-Heap.
 */
export class PriorityQueue<T> {
  private readonly heap: T[] = [];
  private readonly compare: Comparator<T>;

  constructor(comparator?: Comparator<T>) {
    this.compare = comparator ?? defaultComparator;
  }

  /**
   * Current number of elements in the queue.
   */
  get size(): number {
    return this.heap.length;
  }

  /**
   * Checks if the queue is empty.
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Peeks at the top element without removing it. Returns undefined if empty.
   */
  peek(): T | undefined {
    return this.heap[0];
  }

  /**
   * Pushes one or more items into the priority queue.
   */
  push(...items: T[]): void {
    for (const item of items) {
      this.heap.push(item);
      this.siftUp(this.heap.length - 1);
    }
  }

  /**
   * Removes and returns the highest priority element, or undefined if empty.
   */
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.siftDown(0);
    return top;
  }

  /**
   * Clears all elements from the queue.
   */
  clear(): void {
    this.heap.length = 0;
  }

  /**
   * Returns a snapshot of items in the queue as an array.
   */
  toArray(): T[] {
    return [...this.heap];
  }

  private siftUp(index: number): void {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.compare(this.heap[current]!, this.heap[parent]!) < 0) {
        [this.heap[current], this.heap[parent]] = [this.heap[parent]!, this.heap[current]!];
        current = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(index: number): void {
    let current = index;
    const length = this.heap.length;

    while (true) {
      let smallest = current;
      const left = 2 * current + 1;
      const right = 2 * current + 2;

      if (left < length && this.compare(this.heap[left]!, this.heap[smallest]!) < 0) {
        smallest = left;
      }

      if (right < length && this.compare(this.heap[right]!, this.heap[smallest]!) < 0) {
        smallest = right;
      }

      if (smallest !== current) {
        [this.heap[current], this.heap[smallest]] = [this.heap[smallest]!, this.heap[current]!];
        current = smallest;
      } else {
        break;
      }
    }
  }
}

