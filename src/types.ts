/**
 * Result and error status codes for Bullgo operations.
 */
export type BullgoStatus = 'success' | 'error' | 'timeout';

/**
 * Standardized execution result returned by Bullgo runners.
 */
export interface ExecutionResult<T> {
  readonly success: boolean;
  readonly status: BullgoStatus;
  readonly data: T | null;
  readonly error: Error | null;
  readonly executionTimeMs: number;
  readonly retriesAttempted: number;
}

/**
 * Configuration options for executing algorithms.
 */
export interface ExecutionOptions {
  /** Maximum time in milliseconds before terminating the operation. */
  readonly timeoutMs?: number;
  /** Number of retry attempts before giving up (default: 0). */
  readonly retries?: number;
  /** Delay in milliseconds between retry attempts (default: 0). */
  readonly retryDelayMs?: number;
  /** Custom fallback value returned if execution fails. */
  readonly fallback?: unknown;
}

/**
 * Custom error thrown when an execution exceeds the allotted timeout.
 */
export class TimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`Operation timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Custom error thrown when an invalid algorithm or input is supplied.
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Comparator function definition.
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Any callable function.
 */
export type AnyFunction<TArgs extends unknown[] = any[], TReturn = any> = (...args: TArgs) => TReturn;

/**
 * Class constructor type.
 */
export type Constructor<T = object> = new (...args: any[]) => T;

