import { Comparator } from '../types';

/**
 * Natural comparator supporting numbers, strings, and booleans.
 */
export function defaultComparator<T>(a: T, b: T): number {
  if (a === b) return 0;
  if (a === undefined || a === null) return -1;
  if (b === undefined || b === null) return 1;
  return a < b ? -1 : 1;
}

/**
 * Linear Search
 * - Time Complexity: O(N)
 * - Space Complexity: O(1)
 * - Safe for unsorted arrays, handles empty & null inputs.
 */
export function linearSearch<T>(
  list: readonly T[],
  predicateOrTarget: T | ((item: T, index: number) => boolean),
): number {
  if (!Array.isArray(list) || list.length === 0) return -1;

  const isPredicate = typeof predicateOrTarget === 'function';

  for (let i = 0; i < list.length; i++) {
    if (isPredicate) {
      if ((predicateOrTarget as (item: T, index: number) => boolean)(list[i]!, i)) {
        return i;
      }
    } else {
      if (list[i] === predicateOrTarget) {
        return i;
      }
    }
  }

  return -1;
}

/**
 * Binary Search (Iterative)
 * - Time Complexity: O(log N)
 * - Space Complexity: O(1)
 * - Requires sorted array.
 */
export function binarySearch<T>(
  sortedList: readonly T[],
  target: T,
  comparator?: Comparator<T>,
): number {
  if (!Array.isArray(sortedList) || sortedList.length === 0) {
    return -1;
  }

  const compare = comparator ?? defaultComparator;
  let low = 0;
  let high = sortedList.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const midVal = sortedList[mid]!;
    const diff = compare(midVal, target);

    if (diff === 0) {
      return mid;
    } else if (diff < 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}

/**
 * Lower Bound Binary Search
 * Returns first index with value >= target, or sortedList.length if none.
 */
export function lowerBound<T>(
  sortedList: readonly T[],
  target: T,
  comparator?: Comparator<T>,
): number {
  if (!Array.isArray(sortedList) || sortedList.length === 0) return 0;

  const compare = comparator ?? defaultComparator;
  let low = 0;
  let high = sortedList.length;

  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (compare(sortedList[mid]!, target) < 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}

/**
 * Upper Bound Binary Search
 * Returns first index with value > target, or sortedList.length if none.
 */
export function upperBound<T>(
  sortedList: readonly T[],
  target: T,
  comparator?: Comparator<T>,
): number {
  if (!Array.isArray(sortedList) || sortedList.length === 0) return 0;

  const compare = comparator ?? defaultComparator;
  let low = 0;
  let high = sortedList.length;

  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (compare(sortedList[mid]!, target) <= 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}

/**
 * QuickSelect to find the k-th smallest element.
 * - Time Complexity: O(N) average, O(N^2) worst
 */
export function quickSelect<T>(
  list: readonly T[],
  k: number,
  comparator?: Comparator<T>,
): T | undefined {
  if (!Array.isArray(list) || list.length === 0 || k < 0 || k >= list.length) {
    return undefined;
  }

  const copy = [...list];
  const compare = comparator ?? defaultComparator;

  let left = 0;
  let right = copy.length - 1;

  while (left <= right) {
    const pivotIndex = partition(copy, left, right, compare);
    if (pivotIndex === k) {
      return copy[pivotIndex];
    } else if (pivotIndex < k) {
      left = pivotIndex + 1;
    } else {
      right = pivotIndex - 1;
    }
  }

  return undefined;
}

function partition<T>(arr: T[], left: number, right: number, compare: Comparator<T>): number {
  const pivot = arr[right]!;
  let i = left;

  for (let j = left; j < right; j++) {
    if (compare(arr[j]!, pivot) <= 0) {
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
      i++;
    }
  }

  [arr[i], arr[right]] = [arr[right]!, arr[i]!];
  return i;
}
