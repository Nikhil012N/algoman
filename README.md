# bullgo

An enterprise-grade, resilient, zero-dependency algorithmic execution and data structure framework for TypeScript/JavaScript.

`bullgo` includes **all core computer science fundamentals (Linked Lists, Stacks, Queues, Graphs, Trees, Hash Tables)**, **high-performance finite state automata (Aho-Corasick, Suffix Automaton DAWG)**, and **native equivalents of structures from C++, Java, Rust, Go, Python, and distributed systems (Envoy, Redis, Cassandra, Kafka)**, wrapped in an enterprise reliability and telemetry layer.

---

## 🏛️ Comprehensive Data Structure Coverage

### 1. Fundamental Core Structures (Linked List, Stack, Queue, Graph, Hash Table)
| Structure | Class Name | Characteristics & Complexity |
|---|---|---|
| **Linked List** | [`LinkedList<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Fundamentals.ts) | Singly linked list with $O(1)$ append/prepend, in-place reversal (`reverse()`), and `Iterable<T>`. |
| **Stack** | [`Stack<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Fundamentals.ts) | High-performance LIFO stack with amortized $O(1)$ `push`, `pop`, `peek`, and reverse traversal. |
| **Queue** | [`Queue<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Fundamentals.ts) | True FIFO queue using dynamic circular ring buffer. Avoids JavaScript's slow $O(N)$ `Array.shift()`. |
| **Graph** | [`Graph<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Fundamentals.ts) | Generic graph (directed/undirected, weighted/unweighted) with adjacency mapping and vertex query APIs. |
| **Hash Table** | [`HashTable<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Fundamentals.ts) | Low-level hash table with FNV-1a hashing, separate chaining collision resolution, and dynamic prime rehashing. |

### 2. Trees & Hierarchical Structures
- **Binary Search Trees & Balanced Trees**: [`SortedMap<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/RedBlackTree.ts) (Red-Black Tree), [`SortedSet<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/RedBlackTree.ts), [`SplayTree<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/SplayAndRadixTree.ts) (Self-adjusting BST).
- **Trie & Prefix Trees**: [`Trie`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/AdvancedStructures.ts), [`RadixTree<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/SplayAndRadixTree.ts) (Compressed path trie used in HTTP routers).
- **Cartesian & Range Trees**: [`Treap<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Treap.ts) (Tree + Heap), [`SegmentTree<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/SegmentTree.ts), [`FenwickTree`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/FenwickAndCache.ts) (Binary Indexed Tree), [`SparseTable<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/SparseTable.ts) ($O(1)$ RMQ).
- **Spatial Trees**: [`KDTree2D`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/HyperLogLogAndKDTree.ts) (2D $k$-d tree nearest neighbor), [`QuadTree<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/LFUAndQuadTree.ts) (4-quadrant bounding-box indexing).

### 3. Priority Queues & Heaps
- **[`PriorityQueue<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/PriorityQueue.ts)**: Binary Min/Max heap with custom comparator.
- **[`MinMaxHeap<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/MinMaxHeap.ts)**: Double-ended priority queue supporting **simultaneous $O(1)$ min AND $O(1)$ max peek**.

### 4. Advanced Non-Native Data Structures
- **[`Deque<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Deque.ts)**: $O(1)$ double-ended queue (`std::deque` / `collections.deque`).
- **[`SkipList<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/SkipList.ts)**: Probabilistic layered list (Redis `zset`, LevelDB).
- **[`BitSet`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/BitSetAndBiMap.ts)**: 32-bit word bitfield with popcount and bitwise operators (`std::bitset`).
- **[`BiMap<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/BitSetAndBiMap.ts)**: Strict 1-to-1 bidirectional bijection map (`Guava BiMap`).
- **[`CircularBuffer<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/ExoticStructures.ts)**: Fixed ring buffer with auto-eviction.
- **[`MultiMap<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/ExoticStructures.ts)**: 1-to-many key-value multi-dictionary (`std::multimap`).
- **[`DisjointSet<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/AdvancedStructures.ts)**: Union-Find with path compression and rank.

### 5. Probabilistic & Big-Data Structures
- **[`BloomFilter`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/ExoticStructures.ts)**: Zero false-negative set membership filter.
- **[`HyperLogLog`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/HyperLogLogAndKDTree.ts)**: Cardinality estimator for counting millions of distinct items in kilobytes.
- **[`CountMinSketch`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/BitSetAndBiMap.ts)**: Sub-linear frequency estimator for streaming data.

### 6. High-Performance Automata
- **[`AhoCorasick`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Automata.ts)**: Simultaneous multi-pattern dictionary search in single text pass.
- **[`SuffixAutomaton`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Automata.ts)**: Linear-time $O(N)$ DAWG index for all string substrings.

### 7. Caching Systems
- **[`LRUCache<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/FenwickAndCache.ts)**: $O(1)$ Least Recently Used cache.
- **[`LFUCache<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/LFUAndQuadTree.ts)**: $O(1)$ Least Frequently Used cache with LRU tie-breaker.
- **[`EnterpriseCache<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/enterprise/cache.ts)**: Hybrid LRU + Millisecond TTL eviction with live hit ratio metrics.

---

## 🏢 Enterprise Resilience & Distributed Systems

- **[`ConsistentHashRing`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/DistributedBackendStructures.ts)**: Consistent Hashing Ring with virtual node replication.
- **[`TokenBucket`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/DistributedBackendStructures.ts)**: Token-bucket rate limiter.
- **[`SlidingWindowLog`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/DistributedBackendStructures.ts)**: Rolling window rate limiter.
- **[`CircuitBreaker`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/algorithms/resilienceAndHashing.ts)**: Circuit breaker pattern (`CLOSED` $\rightarrow$ `OPEN` $\rightarrow$ `HALF_OPEN`).
- **[`calculateJitterBackoff`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/algorithms/resilienceAndHashing.ts)**: Full jitter exponential backoff.
- **[`murmurHash3`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/algorithms/resilienceAndHashing.ts)**: 32-bit x86 non-cryptographic hash.
- **[`executeEnterprise`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/enterprise/executor.ts)**: Mission-critical runner with `AbortSignal` cancellation and telemetry.

---

## ⚡ Complete Algorithm Catalog

- **Pathfinding & Flows**: `aStar2D` (A* Search), `tarjanSCC` (Strongly Connected Components), `edmondsKarp` (Max flow), `hopcroftKarp` (Bipartite matching).
- **Sorting**: `bubbleSort`, `insertionSort`, `selectionSort`, `mergeSort` (stable), `quickSort` (randomized pivot).
- **Searching**: `linearSearch`, `binarySearch`, `lowerBound`, `upperBound`, `quickSelect` ($O(N)$ $k$-th element).
- **Dynamic Programming**: `knapsack01`, `longestIncreasingSubsequence` ($O(N \log N)$), `maxSubarraySum` (Kadane), `coinChange`.
- **String Processing**: `kmpSearch` ($O(N+M)$), `longestCommonSubsequence` (LCS), `levenshteinDistance`.
- **Graph & Networks**: `bfs`, `dfs`, `dijkstra`, `topologicalSort`, `kruskalMST`, `bellmanFord`, `floydWarshall`.
- **Number Theory & Math**: `gcd`, `lcm`, `sieveOfEratosthenes`, `modularExponentiation`, `fft` (Radix-2 FFT/IFFT).
- **Geometry**: `convexHull` (Andrew's Monotone Chain), `isPointInPolygon` (Ray Casting), `euclideanDistance`.
- **Backtracking**: `permutations` (Heap's algorithm), `combinations`, `solveNQueens`, `solveSudoku`.

---

## Installation & Commands

```bash
npm install bullgo
```

```bash
npm run test       # Run 77 Vitest unit test suites
npm run typecheck  # Strict TypeScript verification
npm run build      # Dual ESM/CJS build with typings
```

## License

[MIT](LICENSE)
