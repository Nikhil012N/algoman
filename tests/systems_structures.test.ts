import { describe, it, expect } from 'vitest';
import {
  SplayTree,
  RadixTree,
  MinMaxHeap,
} from '../src/index';

describe('Advanced Systems Data Structures (Splay, Radix, MinMaxHeap)', () => {
  describe('SplayTree (Self-Adjusting BST)', () => {
    it('splays accessed elements to root and maintains BST order', () => {
      const tree = new SplayTree<number, string>();
      tree.set(10, 'ten');
      tree.set(50, 'fifty');
      tree.set(30, 'thirty');

      expect(tree.size).toBe(3);
      expect(tree.get(50)).toBe('fifty');
      expect(tree.has(30)).toBe(true);
      expect(tree.has(99)).toBe(false);

      // In-order traversal
      const items = Array.from(tree);
      expect(items).toEqual([
        [10, 'ten'],
        [30, 'thirty'],
        [50, 'fifty'],
      ]);

      expect(tree.delete(30)).toBe(true);
      expect(tree.size).toBe(2);
      expect(tree.has(30)).toBe(false);
    });
  });

  describe('RadixTree (Compact Prefix Trie / HTTP Routing Engine)', () => {
    it('compresses common prefixes and routes keys with O(L) efficiency', () => {
      const router = new RadixTree<string>();
      router.insert('/api/v1/users', 'UsersHandler');
      router.insert('/api/v1/user/settings', 'UserSettingsHandler');
      router.insert('/api/v1/posts', 'PostsHandler');
      router.insert('/health', 'HealthHandler');

      expect(router.size).toBe(4);
      expect(router.get('/api/v1/users')).toBe('UsersHandler');
      expect(router.get('/api/v1/user/settings')).toBe('UserSettingsHandler');
      expect(router.get('/health')).toBe('HealthHandler');
      expect(router.get('/api/v1/unknown')).toBeUndefined();
    });
  });

  describe('MinMaxHeap (Double-Ended Priority Queue)', () => {
    it('provides O(1) min and O(1) max queries with logarithmic updates', () => {
      const mmh = new MinMaxHeap<number>();
      mmh.push(31);
      mmh.push(41);
      mmh.push(59);
      mmh.push(26);
      mmh.push(53);
      mmh.push(58);

      expect(mmh.size).toBe(6);
      expect(mmh.getMin()).toBe(26);
      expect(mmh.getMax()).toBe(59);

      // Pop min
      expect(mmh.popMin()).toBe(26);
      expect(mmh.getMin()).toBe(31);

      // Pop max
      expect(mmh.popMax()).toBe(59);
      expect(mmh.getMax()).toBe(58);

      expect(mmh.size).toBe(4);
    });
  });
});

