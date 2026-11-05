/**
 * Consistent Hashing Ring with Virtual Nodes
 * Essential for distributed caches (Memcached, Redis clusters), load balancers (Nginx/Envoy),
 * and distributed databases (DynamoDB, Cassandra).
 * Minimizes key re-mapping when servers are added or removed.
 */
export class ConsistentHashRing {
  private readonly replicas: number;
  private readonly ring = new Map<number, string>();
  private sortedKeys: number[] = [];

  /**
   * @param replicas Number of virtual nodes per physical node to ensure uniform hash distribution.
   */
  constructor(replicas = 100) {
    if (replicas <= 0) throw new RangeError('Replicas must be greater than zero');
    this.replicas = replicas;
  }

  get nodeCount(): number {
    return new Set(this.ring.values()).size;
  }

  addNode(node: string): void {
    for (let i = 0; i < this.replicas; i++) {
      const vNodeKey = `${node}#vn${i}`;
      const hash = this.hash(vNodeKey);
      this.ring.set(hash, node);
    }
    this.rebuildKeys();
  }

  removeNode(node: string): void {
    for (let i = 0; i < this.replicas; i++) {
      const vNodeKey = `${node}#vn${i}`;
      const hash = this.hash(vNodeKey);
      this.ring.delete(hash);
    }
    this.rebuildKeys();
  }

  /**
   * Routes a given request key to the nearest clockwise server node in O(log(replicas * nodes)) time.
   */
  getNode(key: string): string | undefined {
    if (this.sortedKeys.length === 0) return undefined;

    const hash = this.hash(key);
    let low = 0;
    let high = this.sortedKeys.length - 1;

    // Binary search for first node hash >= key hash
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (this.sortedKeys[mid]! >= hash) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    // Wrap around to the start of the ring if key hash exceeds max node hash
    const targetIdx = low < this.sortedKeys.length ? low : 0;
    const targetKey = this.sortedKeys[targetIdx]!;
    return this.ring.get(targetKey);
  }

  private rebuildKeys(): void {
    this.sortedKeys = Array.from(this.ring.keys()).sort((a, b) => a - b);
  }

  private hash(str: string): number {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
}

/**
 * Token Bucket Rate Limiter
 * Used universally across API gateways (Kong, Envoy, AWS API Gateway, Cloudflare, Stripe API)
 * to enforce rate limits while allowing controlled bursts.
 */
export class TokenBucket {
  private readonly capacity: number;
  private readonly refillRatePerSecond: number;
  private tokens: number;
  private lastRefillTimestamp: number;

  /**
   * @param capacity Maximum burst capacity of tokens.
   * @param refillRatePerSecond Tokens added per second.
   */
  constructor(capacity: number, refillRatePerSecond: number) {
    if (capacity <= 0 || refillRatePerSecond <= 0) {
      throw new RangeError('Capacity and refillRatePerSecond must be positive');
    }
    this.capacity = capacity;
    this.refillRatePerSecond = refillRatePerSecond;
    this.tokens = capacity;
    this.lastRefillTimestamp = performance.now();
  }

  /**
   * Attempts to consume `count` tokens.
   * Returns true if allowed, false if rate limited.
   */
  tryConsume(count = 1): boolean {
    if (count <= 0) return true;
    this.refill();

    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }
    return false;
  }

  get availableTokens(): number {
    this.refill();
    return this.tokens;
  }

  private refill(): void {
    const now = performance.now();
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000;
    if (elapsedSeconds > 0) {
      const addedTokens = elapsedSeconds * this.refillRatePerSecond;
      this.tokens = Math.min(this.capacity, this.tokens + addedTokens);
      this.lastRefillTimestamp = now;
    }
  }
}

/**
 * Sliding Window Log Rate Limiter
 * Accurate rolling rate-limiter based on Redis sorted sets (ZSETs), eliminating edge boundary spikes.
 */
export class SlidingWindowLog {
  private readonly windowMs: number;
  private readonly maxLimit: number;
  private logs: number[] = [];

  constructor(windowMs: number, maxLimit: number) {
    if (windowMs <= 0 || maxLimit <= 0) {
      throw new RangeError('windowMs and maxLimit must be positive');
    }
    this.windowMs = windowMs;
    this.maxLimit = maxLimit;
  }

  tryAcquire(): boolean {
    const now = performance.now();
    const threshold = now - this.windowMs;

    // Prune entries older than current sliding window
    while (this.logs.length > 0 && this.logs[0]! <= threshold) {
      this.logs.shift();
    }

    if (this.logs.length < this.maxLimit) {
      this.logs.push(now);
      return true;
    }

    return false;
  }

  get currentLoad(): number {
    const now = performance.now();
    const threshold = now - this.windowMs;
    while (this.logs.length > 0 && this.logs[0]! <= threshold) {
      this.logs.shift();
    }
    return this.logs.length;
  }
}

