/**
 * Circuit Breaker State
 */
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number;     // Failures before opening circuit
  recoveryTimeoutMs?: number;    // Time to wait before attempting recovery
  successThreshold?: number;     // Successes in HALF_OPEN to close circuit
}

/**
 * Circuit Breaker Pattern (Netflix Hystrix, Resilience4j, Envoy Circuit Breaking)
 * Prevents cascading service failures in microservice architectures by fast-failing dead dependencies.
 */
export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;

  readonly failureThreshold: number;
  readonly recoveryTimeoutMs: number;
  readonly successThreshold: number;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 5;
    this.recoveryTimeoutMs = options.recoveryTimeoutMs ?? 5000;
    this.successThreshold = options.successThreshold ?? 2;
  }

  get currentState(): CircuitState {
    if (this.state === 'OPEN') {
      const now = performance.now();
      if (now - this.lastFailureTime >= this.recoveryTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
      }
    }
    return this.state;
  }

  canExecute(): boolean {
    return this.currentState !== 'OPEN';
  }

  recordSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.successCount = 0;
      }
    } else if (this.state === 'CLOSED') {
      this.failureCount = 0;
    }
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = performance.now();
    if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
  }
}

/**
 * Exponential Backoff with Full Jitter (AWS Architecture Best Practice)
 * Prevents the "Thundering Herd Problem" in distributed client retries.
 * Formula: sleep = random_between(0, min(cap, base * 2^attempt))
 */
export function calculateJitterBackoff(
  attempt: number,
  baseMs = 100,
  maxCapMs = 10000,
): number {
  if (attempt < 0) return baseMs;
  const exponential = baseMs * Math.pow(2, attempt);
  const cap = Math.min(maxCapMs, exponential);
  // Full Jitter
  return Math.floor(Math.random() * cap);
}

/**
 * MurmurHash3 (32-bit x86)
 * Industry-standard non-cryptographic hash for database partitioning, Kafka partitioners, and Cassandra keyspaces.
 */
export function murmurHash3(key: string, seed = 0): number {
  let h1 = seed >>> 0;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;

  const len = key.length;
  let i = 0;

  while (i + 4 <= len) {
    let k1 =
      (key.charCodeAt(i) & 0xff) |
      ((key.charCodeAt(i + 1) & 0xff) << 8) |
      ((key.charCodeAt(i + 2) & 0xff) << 16) |
      ((key.charCodeAt(i + 3) & 0xff) << 24);

    k1 = Math.imul(k1, c1);
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = Math.imul(k1, c2);

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1 = (Math.imul(h1, 5) + 0xe6546b64) >>> 0;

    i += 4;
  }

  let k1 = 0;
  const rem = len - i;
  if (rem === 3) k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
  if (rem >= 2) k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
  if (rem >= 1) {
    k1 ^= key.charCodeAt(i) & 0xff;
    k1 = Math.imul(k1, c1);
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = Math.imul(k1, c2);
    h1 ^= k1;
  }

  h1 ^= len;
  h1 ^= h1 >>> 16;
  h1 = Math.imul(h1, 0x85ebca6b);
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, 0xc2b2ae35);
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}

