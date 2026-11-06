import { describe, it, expect } from 'vitest';
import {
  PersistentSegmentTree,
  IntervalTree,
  PairingHeap,
} from '../src/index';

describe('Persistent & Interval Data Structures', () => {
  describe('PersistentSegmentTree (Time-Travel Historical Range Queries)', () => {
    it('creates immutable historical versions and queries past states in O(log N)', () => {
      const initial = [1, 2, 3, 4, 5]; // sum = 15
      const pst = new PersistentSegmentTree(initial); // Version 0

      expect(pst.versionsCount).toBe(1);
      expect(pst.query(0, 0, 4)).toBe(15);
      expect(pst.query(0, 1, 3)).toBe(9); // 2 + 3 + 4 = 9

      // Version 1: add +10 to index 2 (element was 3, now 13)
      const v1 = pst.update(2, 10);
      expect(v1).toBe(1);
      expect(pst.versionsCount).toBe(2);

      // Version 0 remains completely unmodified! (Time travel)
      expect(pst.query(0, 0, 4)).toBe(15);
      expect(pst.query(0, 1, 3)).toBe(9);

      // Version 1 reflects the change
      expect(pst.query(1, 0, 4)).toBe(25);
      expect(pst.query(1, 1, 3)).toBe(19); // 2 + 13 + 4 = 19
    });
  });

  describe('IntervalTree (Overlapping 1D Interval Queries)', () => {
    it('indexes overlapping time/range intervals and finds collisions in O(log N + K)', () => {
      const itree = new IntervalTree<string>();

      itree.insert({ low: 15, high: 20, data: 'Meeting A' });
      itree.insert({ low: 10, high: 30, data: 'Meeting B' });
      itree.insert({ low: 17, high: 19, data: 'Meeting C' });
      itree.insert({ low: 5, high: 20, data: 'Meeting D' });
      itree.insert({ low: 12, high: 15, data: 'Meeting E' });
      itree.insert({ low: 30, high: 40, data: 'Meeting F' });

      expect(itree.size).toBe(6);

      // Query overlap with interval [6, 7]
      const overlapping1 = itree.findOverlapping(6, 7);
      expect(overlapping1.map((i) => i.data)).toEqual(['Meeting D']);

      // Query overlap with interval [14, 16]
      const overlapping2 = itree.findOverlapping(14, 16);
      expect(overlapping2.some((i) => i.data === 'Meeting A')).toBe(true);
      expect(overlapping2.some((i) => i.data === 'Meeting B')).toBe(true);
      expect(overlapping2.some((i) => i.data === 'Meeting D')).toBe(true);
      expect(overlapping2.some((i) => i.data === 'Meeting E')).toBe(true);
      expect(overlapping2.some((i) => i.data === 'Meeting F')).toBe(false);
    });
  });

  describe('PairingHeap (Fast Self-Adjusting Heap)', () => {
    it('supports fast insert, meld, and extractMin', () => {
      const heap = new PairingHeap<number>();
      heap.insert(40);
      heap.insert(10);
      heap.insert(30);
      heap.insert(20);

      expect(heap.size).toBe(4);
      expect(heap.findMin()).toBe(10);

      expect(heap.extractMin()).toBe(10);
      expect(heap.findMin()).toBe(20);
      expect(heap.extractMin()).toBe(20);
      expect(heap.size).toBe(2);

      const other = new PairingHeap<number>();
      other.insert(5);
      other.insert(50);

      heap.meldWith(other);
      expect(heap.size).toBe(4);
      expect(heap.findMin()).toBe(5);
      expect(heap.extractMin()).toBe(5);
    });
  });
});

