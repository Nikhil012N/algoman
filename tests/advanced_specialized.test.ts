import { describe, it, expect } from 'vitest';
import {
  FibonacciHeap,
  CuckooFilter,
  RTree,
  BoundingBox,
} from '../src/index';

describe('Advanced Specialized Structures (Fibonacci Heap, Cuckoo Filter, R-Tree)', () => {
  describe('FibonacciHeap', () => {
    it('supports O(1) insert, O(1) merge, O(1) decreaseKey, and O(log N) extractMin', () => {
      const h1 = new FibonacciHeap<number>();
      const n1 = h1.insert(10);
      const n2 = h1.insert(20);
      const n3 = h1.insert(30);

      expect(h1.size).toBe(3);
      expect(h1.findMin()).toBe(10);

      // Decrease key of 30 down to 5
      h1.decreaseKey(n3, 5);
      expect(h1.findMin()).toBe(5);

      const h2 = new FibonacciHeap<number>();
      h2.insert(2);
      h2.insert(40);

      // O(1) merge
      h1.merge(h2);
      expect(h1.size).toBe(5);
      expect(h1.findMin()).toBe(2);

      // Extract min in order
      expect(h1.extractMin()).toBe(2);
      expect(h1.extractMin()).toBe(5);
      expect(h1.extractMin()).toBe(10);
      expect(h1.size).toBe(2);
    });
  });

  describe('CuckooFilter', () => {
    it('supports insertion, membership check, and DELETION without false negatives', () => {
      const cf = new CuckooFilter(100);
      cf.insert('database_record_1');
      cf.insert('database_record_2');

      expect(cf.contains('database_record_1')).toBe(true);
      expect(cf.contains('database_record_2')).toBe(true);
      expect(cf.contains('absent_key')).toBe(false);

      // Unlike Bloom filter, Cuckoo filter allows safe deletion!
      expect(cf.delete('database_record_1')).toBe(true);
      expect(cf.contains('database_record_1')).toBe(false);
      expect(cf.contains('database_record_2')).toBe(true);
    });
  });

  describe('RTree (Spatial Bounding Box Indexing)', () => {
    it('indexes bounding boxes and performs spatial intersection queries', () => {
      const rtree = new RTree<string>();

      const boxNYC: BoundingBox = { minX: 40, minY: -74, maxX: 41, maxY: -73 };
      const boxLA: BoundingBox = { minX: 34, minY: -118, maxX: 35, maxY: -117 };
      const boxChicago: BoundingBox = { minX: 41, minY: -88, maxX: 42, maxY: -87 };

      rtree.insert(boxNYC, 'New York');
      rtree.insert(boxLA, 'Los Angeles');
      rtree.insert(boxChicago, 'Chicago');

      expect(rtree.size).toBe(3);

      // Search Eastern US
      const easternUS: BoundingBox = { minX: 35, minY: -80, maxX: 45, maxY: -70 };
      const easternResults = rtree.search(easternUS);

      expect(easternResults).toContain('New York');
      expect(easternResults).not.toContain('Los Angeles');

      // Delete
      expect(rtree.delete('New York')).toBe(true);
      expect(rtree.size).toBe(2);
      expect(rtree.search(easternUS)).not.toContain('New York');
    });
  });
});

