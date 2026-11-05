import { describe, it, expect } from 'vitest';
import {
  LinkedList,
  Stack,
  Queue,
  Graph,
  HashTable,
} from '../src/index';

describe('Fundamental Classic Data Structures (LinkedList, Stack, Queue, Graph, HashTable)', () => {
  describe('LinkedList (Singly Linked List)', () => {
    it('appends, prepends, reverses and converts to array', () => {
      const list = new LinkedList<number>();
      list.append(20);
      list.prepend(10);
      list.append(30);

      expect(list.size).toBe(3);
      expect(list.toArray()).toEqual([10, 20, 30]);

      list.reverse();
      expect(list.toArray()).toEqual([30, 20, 10]);

      expect(list.deleteHead()).toBe(30);
      expect(list.size).toBe(2);
    });
  });

  describe('Stack (LIFO)', () => {
    it('pushes, pops, peeks and iterates in reverse order', () => {
      const stack = new Stack<string>();
      stack.push('first', 'second', 'third');

      expect(stack.size).toBe(3);
      expect(stack.peek()).toBe('third');
      expect(stack.pop()).toBe('third');
      expect(stack.pop()).toBe('second');
      expect(stack.size).toBe(1);
    });
  });

  describe('Queue (FIFO with circular O(1) buffer)', () => {
    it('enqueues and dequeues in O(1) time without array shift memory penalties', () => {
      const queue = new Queue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.size).toBe(3);
      expect(queue.peek()).toBe(1);
      expect(queue.dequeue()).toBe(1);
      expect(queue.dequeue()).toBe(2);
      expect(queue.dequeue()).toBe(3);
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('Graph (Generic Vertices & Weighted Edges)', () => {
    it('manages directed and undirected edges and retrieves neighbors', () => {
      const g = new Graph<string>(false); // Undirected
      g.addEdge('ServerA', 'ServerB', 5);
      g.addEdge('ServerB', 'ServerC', 10);

      expect(g.vertexCount).toBe(3);
      expect(g.hasEdge('ServerA', 'ServerB')).toBe(true);
      expect(g.hasEdge('ServerB', 'ServerA')).toBe(true); // Undirected

      const neighbors = g.getNeighbors('ServerB');
      expect(neighbors.length).toBe(2);
      expect(neighbors.some((n) => n.node === 'ServerA' && n.weight === 5)).toBe(true);
      expect(neighbors.some((n) => n.node === 'ServerC' && n.weight === 10)).toBe(true);
    });
  });

  describe('HashTable (Chained Collision Resolution with Rehashing)', () => {
    it('stores, retrieves, handles collisions, and rehashes dynamically', () => {
      const ht = new HashTable<string, number>(5);
      for (let i = 0; i < 20; i++) {
        ht.set(`key_${i}`, i * 10);
      }

      expect(ht.size).toBe(20);
      expect(ht.get('key_5')).toBe(50);
      expect(ht.get('key_19')).toBe(190);
      expect(ht.get('key_unknown')).toBeUndefined();

      expect(ht.delete('key_5')).toBe(true);
      expect(ht.has('key_5')).toBe(false);
      expect(ht.size).toBe(19);
    });
  });
});

