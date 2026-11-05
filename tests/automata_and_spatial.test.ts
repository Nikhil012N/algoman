import { describe, it, expect } from 'vitest';
import {
  SuffixAutomaton,
  AhoCorasick,
  LFUCache,
  QuadTree,
  AABB,
} from '../src/index';

describe('Advanced Automata & High-Performance Structures', () => {
  describe('SuffixAutomaton (DAWG)', () => {
    it('indexes string and checks substring containment in O(M)', () => {
      const sam = new SuffixAutomaton('abracadabra');

      expect(sam.contains('cadabra')).toBe(true);
      expect(sam.contains('abra')).toBe(true);
      expect(sam.contains('raca')).toBe(true);
      expect(sam.contains('zebra')).toBe(false);
      expect(sam.contains('')).toBe(true);
    });

    it('accurately counts distinct substrings in linear time', () => {
      const sam = new SuffixAutomaton('aba');
      // Substrings: 'a', 'b', 'ab', 'ba', 'aba' (5 distinct substrings)
      expect(sam.countDistinctSubstrings()).toBe(5);
    });
  });

  describe('AhoCorasick Multi-Pattern Search', () => {
    it('locates all dictionary pattern occurrences simultaneously in O(N)', () => {
      const ac = new AhoCorasick(['he', 'she', 'his', 'hers']);
      const matches = ac.search('ushers');

      // 'ushers':
      // 'u' (0), 's' (1), 'h' (2), 'e' (3), 'r' (4), 's' (5)
      // 'she' ends at index 3
      // 'he' ends at index 3
      // 'hers' ends at index 5
      expect(matches.some((m) => m.match === 'she' && m.endIndex === 3)).toBe(true);
      expect(matches.some((m) => m.match === 'he' && m.endIndex === 3)).toBe(true);
      expect(matches.some((m) => m.match === 'hers' && m.endIndex === 5)).toBe(true);
    });
  });

  describe('LFUCache (Least Frequently Used with O(1) ops)', () => {
    it('evicts least frequently accessed key on capacity overflow', () => {
      const lfu = new LFUCache<string, number>(2);
      lfu.put('a', 10);
      lfu.put('b', 20);

      expect(lfu.get('a')).toBe(10); // 'a' freq = 2
      expect(lfu.get('a')).toBe(10); // 'a' freq = 3

      lfu.put('c', 30); // 'b' has freq = 1, so 'b' is evicted

      expect(lfu.has('b')).toBe(false);
      expect(lfu.has('a')).toBe(true);
      expect(lfu.has('c')).toBe(true);
    });
  });

  describe('QuadTree (Spatial 2D Box Partitioning)', () => {
    it('inserts points and performs spatial range bounding box queries', () => {
      const boundary: AABB = { x: 50, y: 50, halfWidth: 50, halfHeight: 50 };
      const qt = new QuadTree<{ x: number; y: number; id: string }>(boundary, 2);

      qt.insert({ x: 20, y: 20, id: 'p1' });
      qt.insert({ x: 25, y: 25, id: 'p2' });
      qt.insert({ x: 80, y: 80, id: 'p3' });
      qt.insert({ x: 22, y: 24, id: 'p4' }); // triggers subdivision

      const searchArea: AABB = { x: 25, y: 25, halfWidth: 10, halfHeight: 10 };
      const results = qt.queryRange(searchArea);

      expect(results.length).toBe(3); // p1 (20,20), p2 (25,25), p4 (22,24)
      expect(results.some((p) => p.id === 'p3')).toBe(false);
    });
  });
});
