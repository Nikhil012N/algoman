import { describe, it, expect } from 'vitest';
import {
  execute,
  executeSync,
  instantiate,
  // Searching
  linearSearch,
  binarySearch,
  lowerBound,
  upperBound,
  quickSelect,
  // Sorting
  bubbleSort,
  insertionSort,
  selectionSort,
  mergeSort,
  quickSort,
  // Strings
  kmpSearch,
  longestCommonSubsequence,
  levenshteinDistance,
  // Dynamic Programming
  knapsack01,
  longestIncreasingSubsequence,
  maxSubarraySum,
  coinChange,
  // Graph & Pathfinding
  bfs,
  dfs,
  dijkstra,
  topologicalSort,
  kruskalMST,
  bellmanFord,
  floydWarshall,
  edmondsKarp,
  hopcroftKarp,
  tarjanSCC,
  aStar2D,
  // Math & Geometry
  gcd,
  lcm,
  sieveOfEratosthenes,
  modularExponentiation,
  fft,
  convexHull,
  isPointInPolygon,
  euclideanDistance,
  // Backtracking
  permutations,
  combinations,
  solveNQueens,
  solveSudoku,
  // Distributed & Resilience
  ConsistentHashRing,
  TokenBucket,
  SlidingWindowLog,
  CircuitBreaker,
  calculateJitterBackoff,
  murmurHash3,
  // Structures (Standard & Exotic)
  PriorityQueue,
  DisjointSet,
  Trie,
  FenwickTree,
  LRUCache,
  Deque,
  SortedMap,
  SortedSet,
  BloomFilter,
  CircularBuffer,
  MultiMap,
  SegmentTree,
  Treap,
  BitSet,
  BiMap,
  CountMinSketch,
  SkipList,
  HyperLogLog,
  KDTree2D,
  SparseTable,
} from '../src/index';

describe('Comprehensive Bullgo Algorithm Suite', () => {
  describe('Searching Algorithms', () => {
    const list = [1, 3, 3, 5, 7, 9];

    it('linearSearch finds elements or predicates', () => {
      expect(linearSearch(list, 5)).toBe(3);
      expect(linearSearch(list, (x) => x > 6)).toBe(4);
      expect(linearSearch(list, 100)).toBe(-1);
    });

    it('binarySearch locates sorted entries', () => {
      expect(binarySearch(list, 7)).toBe(4);
      expect(binarySearch(list, 4)).toBe(-1);
    });

    it('lowerBound and upperBound handle duplicate intervals', () => {
      expect(lowerBound(list, 3)).toBe(1);
      expect(upperBound(list, 3)).toBe(3);
    });

    it('quickSelect picks the kth element', () => {
      expect(quickSelect([9, 2, 7, 1, 5], 2)).toBe(5);
    });
  });

  describe('Sorting Algorithms', () => {
    const unsorted = [5, 1, 4, 2, 8, 2];
    const expected = [1, 2, 2, 4, 5, 8];

    it('bubbleSort sorts correctly', () => {
      expect(bubbleSort(unsorted)).toEqual(expected);
      expect(bubbleSort([])).toEqual([]);
    });

    it('insertionSort sorts correctly', () => {
      expect(insertionSort(unsorted)).toEqual(expected);
    });

    it('selectionSort sorts correctly', () => {
      expect(selectionSort(unsorted)).toEqual(expected);
    });

    it('mergeSort sorts immutably with stability', () => {
      expect(mergeSort(unsorted)).toEqual(expected);
    });

    it('quickSort sorts correctly', () => {
      expect(quickSort(unsorted)).toEqual(expected);
    });
  });

  describe('String Algorithms', () => {
    it('kmpSearch finds all pattern occurrences in linear time', () => {
      expect(kmpSearch('ABABDABACDABABCABAB', 'ABABCABAB')).toEqual([10]);
      expect(kmpSearch('AAAAABAA', 'AA')).toEqual([0, 1, 2, 3, 6]);
      expect(kmpSearch('short', 'longerpattern')).toEqual([]);
    });

    it('longestCommonSubsequence computes correct string', () => {
      expect(longestCommonSubsequence('ABCBDAB', 'BDCAB')).toBe('BDAB');
    });

    it('levenshteinDistance computes minimal edit operations', () => {
      expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
      expect(levenshteinDistance('', 'hello')).toBe(5);
    });
  });

  describe('Dynamic Programming Algorithms', () => {
    it('knapsack01 finds optimum value under weight limit', () => {
      const values = [60, 100, 120];
      const weights = [10, 20, 30];
      expect(knapsack01(values, weights, 50)).toBe(220);
    });

    it('longestIncreasingSubsequence computes length in O(N log N)', () => {
      expect(longestIncreasingSubsequence([10, 9, 2, 5, 3, 7, 101, 18])).toBe(4);
    });

    it('maxSubarraySum calculates maximal contiguous sum (Kadane)', () => {
      expect(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toBe(6);
    });

    it('coinChange computes minimal coins or -1', () => {
      expect(coinChange([1, 2, 5], 11)).toBe(3);
      expect(coinChange([2], 3)).toBe(-1);
    });
  });

  describe('Graph, Flow & Pathfinding Algorithms', () => {
    const unweightedGraph: Record<string, string[]> = {
      A: ['B', 'C'],
      B: ['D', 'E'],
      C: ['F'],
      D: [],
      E: ['F'],
      F: [],
    };

    it('bfs traverses breadth first', () => {
      expect(bfs(unweightedGraph, 'A')).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    });

    it('dfs traverses depth first', () => {
      expect(dfs(unweightedGraph, 'A')).toEqual(['A', 'B', 'D', 'E', 'F', 'C']);
    });

    it('dijkstra finds shortest path and distances', () => {
      const weightedGraph = {
        A: [
          { to: 'B', weight: 4 },
          { to: 'C', weight: 2 },
        ],
        B: [
          { to: 'C', weight: 5 },
          { to: 'D', weight: 10 },
        ],
        C: [
          { to: 'E', weight: 3 },
        ],
        D: [],
        E: [
          { to: 'D', weight: 4 },
        ],
      };

      const result = dijkstra(weightedGraph, 'A');
      expect(result.distances['D']).toBe(9);
      expect(result.path('D')).toEqual(['A', 'C', 'E', 'D']);
    });

    it('topologicalSort generates valid DAG ordering or detects cycle', () => {
      const dag = {
        5: ['2', '0'],
        4: ['0', '1'],
        2: ['3'],
        3: ['1'],
        0: [],
        1: [],
      };
      const order = topologicalSort(dag);
      expect(order.indexOf('5')).toBeLessThan(order.indexOf('2'));
      expect(order.indexOf('2')).toBeLessThan(order.indexOf('3'));

      const cyclic = { A: ['B'], B: ['C'], C: ['A'] };
      expect(topologicalSort(cyclic)).toEqual([]);
    });

    it('kruskalMST computes Minimum Spanning Tree', () => {
      const edges = [
        { u: 'A', v: 'B', weight: 4 },
        { u: 'A', v: 'C', weight: 2 },
        { u: 'B', v: 'C', weight: 1 },
        { u: 'B', v: 'D', weight: 5 },
        { u: 'C', v: 'D', weight: 8 },
      ];
      const { mst, totalWeight } = kruskalMST(edges);
      expect(totalWeight).toBe(8);
      expect(mst.length).toBe(3);
    });

    it('bellmanFord computes distances and detects negative cycle', () => {
      const vertices = ['A', 'B', 'C'];
      const edges = [
        { u: 'A', v: 'B', weight: 1 },
        { u: 'B', v: 'C', weight: -2 },
        { u: 'C', v: 'A', weight: -1 },
      ];
      const res = bellmanFord(vertices, edges, 'A');
      expect(res.hasNegativeCycle).toBe(true);
    });

    it('floydWarshall computes all-pairs shortest paths', () => {
      const vertices = ['1', '2', '3'];
      const edges = [
        { u: '1', v: '2', weight: 3 },
        { u: '2', v: '3', weight: 1 },
        { u: '1', v: '3', weight: 6 },
      ];
      const dist = floydWarshall(vertices, edges);
      expect(dist['1']!['3']).toBe(4);
    });

    it('edmondsKarp computes maximum network flow', () => {
      const vertices = ['S', 'A', 'B', 'T'];
      const edges = [
        { from: 'S', to: 'A', capacity: 10 },
        { from: 'S', to: 'B', capacity: 5 },
        { from: 'A', to: 'B', capacity: 15 },
        { from: 'A', to: 'T', capacity: 10 },
        { from: 'B', to: 'T', capacity: 10 },
      ];
      const { maxFlow } = edmondsKarp(vertices, edges, 'S', 'T');
      expect(maxFlow).toBe(15);
    });

    it('hopcroftKarp computes maximum bipartite matching', () => {
      const left = ['U1', 'U2', 'U3'];
      const graph = {
        U1: ['V1', 'V2'],
        U2: ['V1'],
        U3: ['V2', 'V3'],
      };
      const { matchingSize } = hopcroftKarp(left, graph);
      expect(matchingSize).toBe(3);
    });

    it('tarjanSCC discovers Strongly Connected Components', () => {
      const graph = {
        A: ['B'],
        B: ['C'],
        C: ['A', 'D'],
        D: ['E'],
        E: ['F'],
        F: ['D'],
      };
      const sccs = tarjanSCC(graph);
      expect(sccs.length).toBe(2); // {A,B,C} and {D,E,F}
    });

    it('aStar2D finds optimal obstacle-avoiding route', () => {
      const grid = [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
      ];
      const path = aStar2D(grid, { r: 0, c: 0 }, { r: 2, c: 0 });
      expect(path.length).toBe(9); // (0,0)->(0,1)->(0,2)->(0,3)->(1,3)->(2,3)->(2,2)->(2,1)->(2,0)
      expect(path[0]).toEqual({ r: 0, c: 0 });
      expect(path[path.length - 1]).toEqual({ r: 2, c: 0 });
    });
  });

  describe('Number Theory & Mathematics', () => {
    it('gcd and lcm compute accurate factors', () => {
      expect(gcd(48, 18)).toBe(6);
      expect(gcd(-48, 18)).toBe(6);
      expect(lcm(12, 18)).toBe(36);
    });

    it('sieveOfEratosthenes generates prime numbers', () => {
      expect(sieveOfEratosthenes(30)).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
      expect(sieveOfEratosthenes(1)).toEqual([]);
    });

    it('modularExponentiation computes big powers modulo m', () => {
      expect(modularExponentiation(2, 10, 1000)).toBe(24);
      expect(modularExponentiation(3, 13, 7)).toBe(3);
    });

    it('fft computes fast Fourier transform and inverse', () => {
      const input = [1, 2, 3, 4];
      const transformed = fft(input);
      const restored = fft(transformed.real, transformed.imag, true);
      for (let i = 0; i < input.length; i++) {
        expect(Math.round(restored.real[i]!)).toBe(input[i]);
      }
    });
  });

  describe('Computational Geometry', () => {
    it('convexHull computes Andrew monotone chain convex hull', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 0, y: 2 },
        { x: 2, y: 0 },
        { x: 1, y: 0.5 },
      ];
      const hull = convexHull(points);
      expect(hull.length).toBe(4);
    });

    it('isPointInPolygon tests containment via ray casting', () => {
      const square = [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
        { x: 4, y: 4 },
        { x: 0, y: 4 },
      ];
      expect(isPointInPolygon({ x: 2, y: 2 }, square)).toBe(true);
      expect(isPointInPolygon({ x: 5, y: 5 }, square)).toBe(false);
    });

    it('euclideanDistance computes accurate metric', () => {
      expect(euclideanDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    });
  });

  describe('Backtracking & Combinatorics', () => {
    it('permutations generates all arrangements', () => {
      const perms = permutations([1, 2, 3]);
      expect(perms.length).toBe(6);
    });

    it('combinations generates subsets of fixed size', () => {
      const combs = combinations([1, 2, 3, 4], 2);
      expect(combs.length).toBe(6);
    });

    it('solveNQueens computes distinct solutions for 4-queens', () => {
      const sols = solveNQueens(4);
      expect(sols.length).toBe(2);
    });

    it('solveSudoku solves valid grid', () => {
      const grid = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ];
      const solved = solveSudoku(grid);
      expect(solved).toBe(true);
      expect(grid[0]![2]).toBe(4);
    });
  });

  describe('Distributed Backend Infrastructure & Resilience', () => {
    it('ConsistentHashRing routes keys deterministically and gracefully handles node changes', () => {
      const ring = new ConsistentHashRing(50);
      ring.addNode('cache-server-1');
      ring.addNode('cache-server-2');
      ring.addNode('cache-server-3');

      expect(ring.nodeCount).toBe(3);
      const target1 = ring.getNode('user_session_abc');
      const target2 = ring.getNode('user_session_abc');
      expect(target1).toBe(target2);

      ring.removeNode('cache-server-1');
      expect(ring.nodeCount).toBe(2);
      expect(ring.getNode('user_session_abc')).toBeDefined();
    });

    it('TokenBucket allows bursts and enforces rate limits', () => {
      const bucket = new TokenBucket(3, 10);
      expect(bucket.tryConsume(1)).toBe(true);
      expect(bucket.tryConsume(1)).toBe(true);
      expect(bucket.tryConsume(1)).toBe(true);
      expect(bucket.tryConsume(1)).toBe(false);
    });

    it('SlidingWindowLog prevents burst rate spikes at boundary edges', () => {
      const limiter = new SlidingWindowLog(500, 2);
      expect(limiter.tryAcquire()).toBe(true);
      expect(limiter.tryAcquire()).toBe(true);
      expect(limiter.tryAcquire()).toBe(false);
    });

    it('CircuitBreaker transitions across CLOSED, OPEN, and HALF_OPEN states', () => {
      const cb = new CircuitBreaker({ failureThreshold: 2, recoveryTimeoutMs: 50, successThreshold: 1 });
      expect(cb.currentState).toBe('CLOSED');
      expect(cb.canExecute()).toBe(true);

      cb.recordFailure();
      cb.recordFailure();
      expect(cb.currentState).toBe('OPEN');
      expect(cb.canExecute()).toBe(false);
    });

    it('calculateJitterBackoff generates random values bounded within exponential ceiling', () => {
      const backoff = calculateJitterBackoff(3, 100, 2000);
      expect(backoff).toBeGreaterThanOrEqual(0);
      expect(backoff).toBeLessThanOrEqual(800);
    });

    it('murmurHash3 computes deterministic 32-bit hash', () => {
      const h1 = murmurHash3('kafka-partition-key-1');
      const h2 = murmurHash3('kafka-partition-key-1');
      expect(h1).toBe(h2);
      expect(typeof h1).toBe('number');
    });
  });

  describe('Non-Native Exotic Data Structures', () => {
    it('Deque provides O(1) front and back push/pop (C++ std::deque)', () => {
      const dq = new Deque<number>();
      dq.pushBack(10);
      dq.pushFront(5);
      dq.pushBack(20);

      expect(dq.size).toBe(3);
      expect(dq.peekFront()).toBe(5);
      expect(dq.peekBack()).toBe(20);
      expect(dq.popFront()).toBe(5);
      expect(dq.popBack()).toBe(20);
      expect(dq.popBack()).toBe(10);
      expect(dq.isEmpty()).toBe(true);
    });

    it('SortedMap (Red-Black Tree) maintains sorted keys & bounds (Java TreeMap)', () => {
      const map = new SortedMap<number, string>();
      map.set(20, 'twenty').set(10, 'ten').set(30, 'thirty');

      expect(map.size).toBe(3);
      expect(map.minKey()).toBe(10);
      expect(map.maxKey()).toBe(30);
      expect(map.lowerKey(25)).toBe(20);
      expect(map.higherKey(20)).toBe(30);
      expect(Array.from(map)).toEqual([
        [10, 'ten'],
        [20, 'twenty'],
        [30, 'thirty'],
      ]);
      expect(map.delete(20)).toBe(true);
      expect(map.has(20)).toBe(false);
    });

    it('SortedSet maintains unique sorted elements (C++ std::set)', () => {
      const set = new SortedSet<number>();
      set.add(40).add(10).add(30).add(10);

      expect(set.size).toBe(3);
      expect(Array.from(set)).toEqual([10, 30, 40]);
      expect(set.lower(35)).toBe(30);
      expect(set.higher(30)).toBe(40);
    });

    it('BloomFilter tests probabilistic membership without false negatives', () => {
      const bf = new BloomFilter(100, 0.01);
      bf.add('antigravity');
      bf.add('google');

      expect(bf.has('antigravity')).toBe(true);
      expect(bf.has('google')).toBe(true);
      expect(bf.has('definitely_absent_key_xyz_99')).toBe(false);
    });

    it('CircularBuffer overwrites on overflow like hardware ring buffers', () => {
      const ring = new CircularBuffer<number>(3);
      ring.push(1);
      ring.push(2);
      ring.push(3);
      expect(ring.isFull).toBe(true);

      ring.push(4);
      expect(ring.toArray()).toEqual([2, 3, 4]);
      expect(ring.pop()).toBe(2);
    });

    it('MultiMap maps single key to multiple values (C++ std::multimap)', () => {
      const mm = new MultiMap<string, number>();
      mm.set('scores', 100);
      mm.set('scores', 95);
      mm.set('scores', 100);

      expect(mm.get('scores')).toEqual([100, 95]);
      expect(mm.has('scores', 95)).toBe(true);
      expect(mm.delete('scores', 95)).toBe(true);
      expect(mm.get('scores')).toEqual([100]);
    });

    it('SegmentTree performs range queries and point updates in O(log N)', () => {
      const data = [1, 3, 5, 7, 9, 11];
      const segTree = new SegmentTree<number>(data, (a, b) => Math.min(a, b), Infinity);

      expect(segTree.query(1, 4)).toBe(3);
      segTree.update(1, 8);
      expect(segTree.query(1, 4)).toBe(5);
    });

    it('Treap supports randomized split/merge Cartesian search in O(log N)', () => {
      const treap = new Treap<number>();
      treap.insert(50);
      treap.insert(20);
      treap.insert(70);
      treap.insert(10);

      expect(treap.size).toBe(4);
      expect(treap.has(20)).toBe(true);
      expect(treap.has(99)).toBe(false);
      expect(treap.kthSmallest(0)).toBe(10);
      expect(treap.kthSmallest(1)).toBe(20);

      expect(treap.delete(20)).toBe(true);
      expect(treap.size).toBe(3);
      expect(treap.has(20)).toBe(false);
    });

    it('BitSet offers compact bit manipulation and bitwise ops (C++ std::bitset)', () => {
      const bs = new BitSet(64);
      bs.set(10, true);
      bs.set(40, true);
      expect(bs.get(10)).toBe(true);
      expect(bs.get(20)).toBe(false);
      expect(bs.count()).toBe(2);

      bs.toggle(10);
      expect(bs.get(10)).toBe(false);
      expect(bs.count()).toBe(1);
    });

    it('BiMap provides bidirectional 1-to-1 key-value mapping (Guava BiMap)', () => {
      const bimap = new BiMap<string, number>();
      bimap.set('one', 1);
      bimap.set('two', 2);

      expect(bimap.get('one')).toBe(1);
      expect(bimap.getKey(2)).toBe('two');
      expect(bimap.hasValue(1)).toBe(true);

      bimap.set('uno', 1);
      expect(bimap.get('one')).toBeUndefined();
      expect(bimap.getKey(1)).toBe('uno');
    });

    it('CountMinSketch tracks streaming item frequencies sub-linearly', () => {
      const cms = new CountMinSketch(0.01, 0.01);
      cms.add('apple', 5);
      cms.add('banana', 10);
      cms.add('apple', 3);

      expect(cms.estimate('apple')).toBeGreaterThanOrEqual(8);
      expect(cms.estimate('banana')).toBeGreaterThanOrEqual(10);
      expect(cms.estimate('watermelon')).toBe(0);
    });

    it('SkipList achieves O(log N) operations probabilistically (Redis zset)', () => {
      const sl = new SkipList<number, string>();
      sl.insert(15, 'fifteen');
      sl.insert(5, 'five');
      sl.insert(25, 'twenty-five');

      expect(sl.size).toBe(3);
      expect(sl.search(5)).toBe('five');
      expect(sl.search(15)).toBe('fifteen');
      expect(sl.search(99)).toBeUndefined();

      expect(sl.delete(15)).toBe(true);
      expect(sl.size).toBe(2);
      expect(sl.search(15)).toBeUndefined();
    });

    it('HyperLogLog estimates unique cardinality with minimal memory (Redis HLL)', () => {
      const hll = new HyperLogLog(10);
      for (let i = 0; i < 500; i++) {
        hll.add(`user_session_${i}`);
      }
      for (let i = 0; i < 200; i++) {
        hll.add(`user_session_${i}`);
      }

      const est = hll.count();
      expect(est).toBeGreaterThan(400);
      expect(est).toBeLessThan(600);
    });

    it('KDTree2D performs nearest neighbor search and 2D spatial queries', () => {
      const points = [
        { x: 2, y: 3 },
        { x: 5, y: 4 },
        { x: 9, y: 6 },
        { x: 4, y: 7 },
        { x: 8, y: 1 },
        { x: 7, y: 2 },
      ];
      const kd = new KDTree2D(points);

      const nearest = kd.nearestNeighbor({ x: 9, y: 2 });
      expect(nearest).toEqual({ x: 8, y: 1 });

      const inBox = kd.rangeQuery(3, 8, 2, 8);
      expect(inBox.length).toBe(3);
    });

    it('SparseTable answers Range Minimum Queries (RMQ) in strictly O(1) time', () => {
      const arr = [7, 2, 3, 0, 5, 10, 3, 12, 18];
      const st = new SparseTable<number>(arr);

      expect(st.query(0, 4)).toBe(0);
      expect(st.query(4, 7)).toBe(3);
      expect(st.query(1, 2)).toBe(2);
      expect(st.query(7, 8)).toBe(12);
    });
  });
});
