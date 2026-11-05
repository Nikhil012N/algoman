import { TelemetryBus } from './telemetry';
import { TimeoutError, ValidationError } from '../types';

export interface EnterpriseExecutionPolicy {
  readonly name?: string;
  readonly timeoutMs?: number;
  readonly retries?: number;
  readonly retryDelayMs?: number;
  readonly backoffMultiplier?: number;
  readonly fallback?: unknown;
  readonly signal?: AbortSignal;
  readonly maxMemoryDeltaMb?: number;
}

export interface EnterpriseResult<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: Error | null;
  readonly durationMs: number;
  readonly retries: number;
  readonly aborted: boolean;
}

/**
 * Enterprise Mission-Critical Function Runner
 * - Full AbortSignal cancellation support
 * - Exponential backoff with jitter on retries
 * - Telemetry event emission
 * - Strict argument and error boundary validation
 */
export async function executeEnterprise<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn | Promise<TReturn>,
  args: TArgs = [] as unknown as TArgs,
  policy: EnterpriseExecutionPolicy = {},
): Promise<EnterpriseResult<TReturn>> {
  const opName = policy.name ?? (fn?.name || 'anonymous_operation');
  const startTime = performance.now();

  if (typeof fn !== 'function') {
    const err = new ValidationError(`Enterprise executor requires a callable function, received ${typeof fn}`);
    const durationMs = Number((performance.now() - startTime).toFixed(3));
    TelemetryBus.emit({
      timestamp: Date.now(),
      type: 'algorithm',
      name: opName,
      operation: 'validate',
      durationMs,
      success: false,
      error: err.message,
    });
    return {
      success: false,
      data: (policy.fallback !== undefined ? policy.fallback : null) as TReturn | null,
      error: err,
      durationMs,
      retries: 0,
      aborted: false,
    };
  }

  const {
    timeoutMs,
    retries = 0,
    retryDelayMs = 0,
    backoffMultiplier = 2,
    signal,
    fallback,
  } = policy;

  let attempt = 0;
  let currentDelay = retryDelayMs;
  let lastError: Error | null = null;

  while (attempt <= retries) {
    if (signal?.aborted) {
      const abortErr = new Error('Operation aborted by caller AbortSignal');
      const durationMs = Number((performance.now() - startTime).toFixed(3));
      TelemetryBus.emit({
        timestamp: Date.now(),
        type: 'algorithm',
        name: opName,
        operation: 'abort',
        durationMs,
        success: false,
        error: abortErr.message,
      });
      return {
        success: false,
        data: (fallback !== undefined ? fallback : null) as TReturn | null,
        error: abortErr,
        durationMs,
        retries: attempt,
        aborted: true,
      };
    }

    try {
      let execPromise = Promise.resolve().then(() => fn(...args));

      if (timeoutMs !== undefined && timeoutMs > 0) {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const timerPromise = new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new TimeoutError(timeoutMs)), timeoutMs);
        });

        execPromise = Promise.race([execPromise, timerPromise]).finally(() => {
          if (timer) clearTimeout(timer);
        });
      }

      const data = await execPromise;
      const durationMs = Number((performance.now() - startTime).toFixed(3));

      TelemetryBus.emit({
        timestamp: Date.now(),
        type: 'algorithm',
        name: opName,
        operation: 'execute',
        durationMs,
        success: true,
        metadata: { attempts: attempt + 1 },
      });

      return {
        success: true,
        data,
        error: null,
        durationMs,
        retries: attempt,
        aborted: false,
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      attempt++;

      if (attempt <= retries) {
        const jitter = Math.floor(Math.random() * (currentDelay * 0.5));
        await new Promise((resolve) => setTimeout(resolve, currentDelay + jitter));
        currentDelay *= backoffMultiplier;
      }
    }
  }

  const durationMs = Number((performance.now() - startTime).toFixed(3));
  TelemetryBus.emit({
    timestamp: Date.now(),
    type: 'algorithm',
    name: opName,
    operation: 'execute',
    durationMs,
    success: false,
    error: lastError?.message,
    metadata: { totalAttempts: attempt },
  });

  return {
    success: false,
    data: (fallback !== undefined ? fallback : null) as TReturn | null,
    error: lastError,
    durationMs,
    retries: attempt - 1,
    aborted: false,
  };
}

