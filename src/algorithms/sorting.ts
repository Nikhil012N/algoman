import { Comparator } from '../types';
import { defaultComparator } from './search';

/**
 * Bubble Sort
 * - Time Complexity: O(N^2) average/worst, O(N) best (with early exit)
 * - Space Complexity: O(1) auxiliary, returns a new array (pure/immutable)
 * - Edge Cases Handled: Empty arrays, single elements, non-array inputs, early break on sorted input.
 */
export function bubbleSort<T>(list: readonly T[], comparator?: Comparator<T>): T[] {
  if (!Array.isArray(list)) return [];
  if (list.length <= 1) return [...list];

  const arr = [...list];
  const compare = comparator ?? defaultComparator;
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (compare(arr[j]!, arr[j + 1]!) > 0) {
        [arr[j], arr[j + 1]] = [arr[j + 1]!, arr[j]!];
        swapped = true;
      }
    }
    if (!swapped) break;
  }

  return arr;
}

/**
 * Insertion Sort
 * - Time Complexity: O(N^2) worst/average, O(N) best
 * - Space Complexity: O(1) auxiliary, returns a new array
 * - Highly efficient for small or nearly sorted collections.
 */
export function insertionSort<T>(list: readonly T[], comparator?: Comparator<T>): T[] {
  if (!Array.isArray(list)) return [];
  if (list.length <= 1) return [...list];

  const arr = [...list];
  const compare = comparator ?? defaultComparator;

  for (let i = 1; i < arr.length; i++) {
    const current = arr[i]!;
    let j = i - 1;

    while (j >= 0 && compare(arr[j]!, current) > 0) {
      arr[j + 1] = arr[j]!;
      j--;
    }
    arr[j + 1] = current;
  }

  return arr;
}

/**
 * Selection Sort
 * - Time Complexity: O(N^2) always
 * - Space Complexity: O(1) auxiliary
 */
export function selectionSort<T>(list: readonly T[], comparator?: Comparator<T>): T[] {
  if (!Array.isArray(list)) return [];
  if (list.length <= 1) return [...list];

  const arr = [...list];
  const compare = comparator ?? defaultComparator;
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (compare(arr[j]!, arr[minIdx]!) < 0) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx]!, arr[i]!];
    }
  }

  return arr;
}

/**
 * Merge Sort (Stable, O(N log N))
 */
export function mergeSort<T>(list: readonly T[], comparator?: Comparator<T>): T[] {
  if (!Array.isArray(list)) return [];
  if (list.length <= 1) return [...list];

  const compare = comparator ?? defaultComparator;
  const middle = Math.floor(list.length / 2);
  const left = mergeSort(list.slice(0, middle), compare);
  const right = mergeSort(list.slice(middle), compare);

  return merge(left, right, compare);
}

function merge<T>(left: T[], right: T[], compare: Comparator<T>): T[] {
  const result: T[] = [];
  let l = 0;
  let r = 0;

  while (l < left.length && r < right.length) {
    if (compare(left[l]!, right[r]!) <= 0) {
      result.push(left[l]!);
      l++;
    } else {
      result.push(right[r]!);
      r++;
    }
  }

  while (l < left.length) {
    result.push(left[l]!);
    l++;
  }

  while (r < right.length) {
    result.push(right[r]!);
    r++;
  }

  return result;
}

/**
 * Quick Sort (In-place partition with random pivot to mitigate worst-case)
 * - Time Complexity: O(N log N) average
 * - Space Complexity: O(log N) stack depth
 */
export function quickSort<T>(list: readonly T[], comparator?: Comparator<T>): T[] {
  if (!Array.isArray(list)) return [];
  if (list.length <= 1) return [...list];

  const arr = [...list];
  const compare = comparator ?? defaultComparator;
  quickSortInternal(arr, 0, arr.length - 1, compare);
  return arr;
}

function quickSortInternal<T>(arr: T[], low: number, high: number, compare: Comparator<T>): void {
  if (low < high) {
    const pivotIdx = randomizedPartition(arr, low, high, compare);
    quickSortInternal(arr, low, pivotIdx - 1, compare);
    quickSortInternal(arr, pivotIdx + 1, high, compare);
  }
}

function randomizedPartition<T>(arr: T[], low: number, high: number, compare: Comparator<T>): number {
  const randomPivot = low + Math.floor(Math.random() * (high - low + 1));
  [arr[randomPivot], arr[high]] = [arr[high]!, arr[randomPivot]!];

  const pivot = arr[high]!;
  let i = low;

  for (let j = low; j < high; j++) {
    if (compare(arr[j]!, pivot) <= 0) {
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
      i++;
    }
  }

  [arr[i], arr[high]] = [arr[high]!, arr[i]!];
  return i;
}
