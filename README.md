# algoman

An enterprise-grade, resilient, zero-dependency algorithmic execution and data structure framework for TypeScript/JavaScript.

`algoman` provides **every computer science data structure** across all domains:
- **Core Fundamentals**: Linked Lists, Stacks, Queues, Graphs, Chained Hash Tables.
- **Persistent Data Structures**: Version-controlled trees with time-travel historical range queries.
- **Interval & Scheduling**: Augmented 1D interval trees for collision detection and calendar bookings.
- **Balanced Search Trees**: AVL Trees, Red-Black Trees, Splay Trees, Treaps, Ropes, Radix Trees.
- **Priority Queues & Heaps**: Fibonacci Heaps, Pairing Heaps, Min-Max Heaps, Binary Heaps.
- **Spatial Multi-Dimensional Hierarchies**: R-Trees, 2D QuadTrees, 2D K-D Trees.
- **Probabilistic & Streaming Big-Data**: Cuckoo Filters, Bloom Filters, HyperLogLog, Count-Min Sketch.
- **High-Performance Automata**: Aho-Corasick multi-pattern matching, Suffix Automaton DAWG.
- **Distributed Backend Infrastructure**: Consistent Hashing Rings, Token Buckets, Sliding Window Rate Limiters, Circuit Breakers.

---

## 🏛️ Master Data Structure Catalog

### 1. Fundamental Core Structures
| Structure | Class Name | Complexity & Key Features |
|---|---|---|
| **Linked List** | [`LinkedList<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Fundamentals.ts) | Singly linked list with $O(1)$ append/prepend, in-place reversal (`reverse()`), and iteration. |
| **Stack (LIFO)** | [`Stack<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Fundamentals.ts) | $O(1)$ amortized `push`, `pop`, `peek`, and reverse traversal. |
| **Queue (FIFO)** | [`Queue<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Fundamentals.ts) | Circular ring buffer queue with true $O(1)$ `enqueue`/`dequeue` without JavaScript array shift penalties. |
| **Double-Ended Queue** | [`Deque<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Deque.ts) | True $O(1)$ push/pop at both front and back (`std::deque` / `collections.deque`). |
| **Graph** | [`Graph<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Fundamentals.ts) | Generic graph (directed/undirected, weighted/unweighted) with vertex & neighbor APIs. |
| **Hash Table** | [`HashTable<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Fundamentals.ts) | Low-level chained hash table with FNV-1a hashing and dynamic prime rehashing. |
| **BiMap** | [`BiMap<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/BitSetAndBiMap.ts) | Strict 1-to-1 bidirectional bijection map with $O(1)$ forward (`get`) and inverse (`getKey`) lookups. |
| **MultiMap** | [`MultiMap<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/ExoticStructures.ts) | 1-to-many key-value multi-dictionary (`std::multimap`). |
| **Disjoint Set** | [`DisjointSet<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/AdvancedStructures.ts) | Union-Find with path compression + rank ($\approx O(1)$). |

---

### 2. Persistent, Interval & Advanced Trees
| Structure | Class Name | Complexity & Key Features |
|---|---|---|
| **Persistent Segment Tree** | [`PersistentSegmentTree`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/PersistentAndInterval.ts) | Immutable version-controlled tree. Allows **$O(\log N)$ historical range queries at ANY past version** in history via path copying. |
| **Interval Tree** | [`IntervalTree<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/PersistentAndInterval.ts) | Stores 1D intervals $[low, high]$. Finds all overlapping intervals in $O(\log N + K)$ time for calendar booking and genomic sequences. |
| **AVL Tree** | [`AVLTree<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/AVLAndRope.ts) | Strictly height-balanced BST (balance factor $\le 1$). Faster lookups than Red-Black trees. |
| **Red-Black Tree (Map)** | [`SortedMap<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/RedBlackTree.ts) | Self-balancing BST (`std::map` / `TreeMap`) with $O(\log N)$ `lowerKey`, `higherKey`, `minKey`, `maxKey`. |
| **Red-Black Tree (Set)** | [`SortedSet<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/RedBlackTree.ts) | Unique sorted set with floor/ceiling checks (`std::set`). |
| **Splay Tree** | [`SplayTree<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/SplayAndRadixTree.ts) | Self-adjusting BST moving hot elements to root via splay rotations (cache-oblivious 80/20 access). |
| **Rope** | [`Rope`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/AVLAndRope.ts) | Binary tree of string leaves used in high-performance text editors (VS Code, Sublime). $O(\log N)$ insert, split, and $O(1)$ concat. |
| **Radix Tree** | [`RadixTree<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/SplayAndRadixTree.ts) | Compact prefix trie for HTTP routing engines (Gin/Echo/Fastify). |
| **Standard Trie** | [`Trie`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/AdvancedStructures.ts) | Fast prefix search and autocomplete. |

---

### 3. Range & Spatial Indices
| Structure | Class Name | Complexity & Key Features |
|---|---|---|
| **Segment Tree** | [`SegmentTree<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/SegmentTree.ts) | $O(\log N)$ associative range queries (`sum`, `min`, `max`, `gcd`). |
| **Treap** | [`Treap<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Treap.ts) | Randomized Cartesian BST with $O(\log N)$ split, merge, and `kthSmallest`. |
| **Fenwick Tree** | [`FenwickTree`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/FenwickAndCache.ts) | $O(\log N)$ point updates and prefix range sum queries. |
| **Sparse Table** | [`SparseTable<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/SparseTable.ts) | Range Minimum Queries (RMQ) in **strictly guaranteed $O(1)$ constant time**. |
| **R-Tree** | [`RTree<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/AdvancedSpecialized.ts) | Multidimensional bounding-box index for spatial geographic databases (PostGIS, SQLite R*Tree). |
| **2D QuadTree** | [`QuadTree<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/LFUAndQuadTree.ts) | 2D quadrant spatial subdivision for collision detection and viewport culling. |
| **2D K-D Tree** | [`KDTree2D`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/HyperLogLogAndKDTree.ts) | $k$-d tree nearest neighbor search in $O(\log N)$. |

---

### 4. Priority Queues & Heaps
| Structure | Class Name | Complexity & Key Features |
|---|---|---|
| **Fibonacci Heap** | [`FibonacciHeap<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/AdvancedSpecialized.ts) | Gold standard for graph algorithms: **$O(1)$ insert, $O(1)$ merge, $O(1)$ `decreaseKey`**, $O(\log N)$ `extractMin`. |
| **Pairing Heap** | [`PairingHeap<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/PersistentAndInterval.ts) | Fast self-adjusting heap widely used in C++ STL and functional compilers for optimal real-world speed. |
| **Min-Max Heap** | [`MinMaxHeap<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/MinMaxHeap.ts) | Double-ended heap supporting **simultaneous $O(1)$ min AND $O(1)$ max access**. |
| **Binary Min/Max Heap** | [`PriorityQueue<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/PriorityQueue.ts) | Binary heap with custom comparator support. |

---

### 5. Probabilistic & Big-Data Structures
- **[`CuckooFilter`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/AdvancedSpecialized.ts)**: Modern improvement over Bloom filters supporting **safe deletion**.
- **[`BloomFilter`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/ExoticStructures.ts)**: Space-efficient probabilistic set membership with zero false negatives.
- **[`HyperLogLog`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/HyperLogLogAndKDTree.ts)**: Cardinality estimator counting millions of distinct items in kilobytes (`PFADD`/`PFCOUNT`).
- **[`CountMinSketch`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/BitSetAndBiMap.ts)**: Sub-linear frequency estimator for massive streaming data.
- **[`BitSet`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/BitSetAndBiMap.ts)**: 32-bit word bitfield array (8x less memory than boolean arrays).
- **[`CircularBuffer<T>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/ExoticStructures.ts)**: Fixed circular buffer with auto oldest-element eviction.

---

### 6. High-Performance Automata
- **[`AhoCorasick`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Automata.ts)**: Multi-pattern dictionary search in single text pass via failure-link trie.
- **[`SuffixAutomaton`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/Automata.ts)**: Directed Acyclic Word Graph (DAWG) encoding all substrings in linear $O(N)$ states.

---

### 7. Caching Systems
- **[`LRUCache<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/FenwickAndCache.ts)**: $O(1)$ Least Recently Used cache.
- **[`LFUCache<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/LFUAndQuadTree.ts)**: $O(1)$ Least Frequently Used cache with LRU tie-breaker.
- **[`EnterpriseCache<K, V>`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/enterprise/cache.ts)**: Hybrid LRU + Millisecond TTL with live hit ratio metrics and eviction callbacks.

---

### 8. Distributed Backend & Cloud Systems
- **[`ConsistentHashRing`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/DistributedBackendStructures.ts)**: Consistent Hashing Ring with virtual node replication.
- **[`TokenBucket`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/DistributedBackendStructures.ts)**: Token-bucket rate limiter.
- **[`SlidingWindowLog`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/structures/DistributedBackendStructures.ts)**: Rolling window rate limiter.
- **[`CircuitBreaker`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/algorithms/resilienceAndHashing.ts)**: Circuit breaker pattern (`CLOSED` $\rightarrow$ `OPEN` $\rightarrow$ `HALF_OPEN`).
- **[`calculateJitterBackoff`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/algorithms/resilienceAndHashing.ts)**: Full jitter exponential backoff.
- **[`murmurHash3`](file:///c:/Users/Nikhil/Documents/Personal%20projects/bullgo/src/algorithms/resilienceAndHashing.ts)**: 32-bit x86 non-cryptographic hash.

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
npm install algoman
```

```bash
npm run test       # Run 85 Vitest unit test suites
npm run typecheck  # Strict TypeScript verification
npm run build      # Dual ESM/CJS build with typings
```

## License

[MIT](LICENSE)
