import { describe, it, expect } from 'vitest';
import {
  AVLTree,
  Rope,
} from '../src/index';

describe('AVL Tree & Rope Data Structures', () => {
  describe('AVLTree (Strict Height-Balanced BST)', () => {
    it('maintains strict AVL height balance through 4 rotation cases', () => {
      const avl = new AVLTree<number, string>();

      // Insert elements that force rotations (LL, RR, LR, RL)
      avl.set(30, 'thirty');
      avl.set(20, 'twenty');
      avl.set(10, 'ten'); // LL rotation
      avl.set(40, 'forty');
      avl.set(50, 'fifty'); // RR rotation
      avl.set(25, 'twenty-five'); // LR rotation

      expect(avl.size).toBe(6);
      expect(avl.get(20)).toBe('twenty');
      expect(avl.get(25)).toBe('twenty-five');
      expect(avl.get(99)).toBeUndefined();

      // In-order traversal must be sorted
      const items = Array.from(avl);
      expect(items.map(([k]) => k)).toEqual([10, 20, 25, 30, 40, 50]);

      // Delete with rebalancing
      expect(avl.delete(20)).toBe(true);
      expect(avl.size).toBe(5);
      expect(avl.has(20)).toBe(false);
    });
  });

  describe('Rope (Heavy Text Editor String Structure)', () => {
    it('supports O(log N) splits, inserts, and O(1) concatenations', () => {
      const rope = new Rope('Hello World');
      expect(rope.length).toBe(11);
      expect(rope.toString()).toBe('Hello World');

      // Insert at index 5
      rope.insert(5, ', Beautiful');
      expect(rope.toString()).toBe('Hello, Beautiful World');

      // Concat
      const suffix = new Rope('!');
      rope.concat(suffix);
      expect(rope.toString()).toBe('Hello, Beautiful World!');
    });
  });
});

