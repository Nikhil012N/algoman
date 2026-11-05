import { describe, it, expect } from 'vitest';
import {
  executeEnterprise,
  EnterpriseCache,
  TelemetryBus,
  TelemetryEvent,
} from '../src/index';

describe('Enterprise Tier Execution & Data Architecture', () => {
  describe('executeEnterprise with Observability & Cancellation', () => {
    it('emits telemetry events during execution', async () => {
      const events: TelemetryEvent[] = [];
      const unsubscribe = TelemetryBus.subscribe((e) => events.push(e));

      const compute = (x: number) => x * 10;
      const res = await executeEnterprise(compute, [5], { name: 'ComputeMultiply' });

      expect(res.success).toBe(true);
      expect(res.data).toBe(50);
      expect(events.length).toBeGreaterThan(0);
      expect(events[0]?.name).toBe('ComputeMultiply');
      expect(events[0]?.operation).toBe('execute');
      expect(events[0]?.success).toBe(true);

      unsubscribe();
    });

    it('honors AbortController cancellation signal', async () => {
      const controller = new AbortController();
      controller.abort(); // already aborted

      const longTask = () => new Promise((resolve) => setTimeout(resolve, 500));
      const res = await executeEnterprise(longTask, [], { signal: controller.signal });

      expect(res.success).toBe(false);
      expect(res.aborted).toBe(true);
      expect(res.error?.message).toContain('aborted');
    });

    it('performs exponential backoff retries with jitter', async () => {
      let attempts = 0;
      const failingTask = () => {
        attempts++;
        if (attempts < 3) throw new Error('Network jitter');
        return 'recovered';
      };

      const res = await executeEnterprise(failingTask, [], {
        retries: 3,
        retryDelayMs: 5,
        backoffMultiplier: 2,
      });

      expect(res.success).toBe(true);
      expect(res.data).toBe('recovered');
      expect(res.retries).toBe(2);
    });
  });

  describe('EnterpriseCache (LRU + TTL + Telemetry Metrics)', () => {
    it('tracks hits, misses, evictions, and hitRatio metrics accurately', () => {
      const cache = new EnterpriseCache<string, number>({ maxSize: 2 });
      cache.set('a', 1);
      cache.set('b', 2);

      expect(cache.get('a')).toBe(1); // hit
      expect(cache.get('z')).toBeUndefined(); // miss

      expect(cache.stats.hits).toBe(1);
      expect(cache.stats.misses).toBe(1);
      expect(cache.stats.hitRatio).toBe(0.5);

      cache.set('c', 3); // evicts 'b' (oldest)
      expect(cache.stats.evictions).toBe(1);
      expect(cache.has('b')).toBe(false);
      expect(cache.has('a')).toBe(true);
      expect(cache.has('c')).toBe(true);
    });

    it('handles TTL expiration and eviction callbacks', async () => {
      let evictedKey = '';
      let evictReason = '';

      const cache = new EnterpriseCache<string, string>({
        maxSize: 5,
        defaultTtlMs: 20,
        onEvict: (k, _, reason) => {
          evictedKey = k;
          evictReason = reason;
        },
      });

      cache.set('session', 'active');
      expect(cache.get('session')).toBe('active');

      await new Promise((resolve) => setTimeout(resolve, 35));

      expect(cache.get('session')).toBeUndefined(); // Expired
      expect(evictedKey).toBe('session');
      expect(evictReason).toBe('ttl');
    });
  });
});

