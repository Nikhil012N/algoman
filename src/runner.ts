import {
  ExecutionResult,
  ExecutionOptions,
  TimeoutError,
  ValidationError,
  AnyFunction,
  Constructor,
} from './types';

/**
 * Executes a synchronous or asynchronous function with timing, retry logic, timeout control, and defensive error normalization.
 */
export async function execute<TArgs extends unknown[], TReturn>(
  fn: AnyFunction<TArgs, TReturn>,
  args: TArgs = [] as unknown as TArgs,
  options: ExecutionOptions = {},
): Promise<ExecutionResult<TReturn>> {
  if (typeof fn !== 'function') {
    const err = new ValidationError(`Expected an executable function, but received: ${typeof fn}`);
    return {
      success: false,
      status: 'error',
      data: (options.fallback !== undefined ? options.fallback : null) as TReturn | null,
      error: err,
      executionTimeMs: 0,
      retriesAttempted: 0,
    };
  }

  const { timeoutMs, retries = 0, retryDelayMs = 0, fallback } = options;
  const startTime = performance.now();
  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= retries) {
    try {
      let resultPromise = Promise.resolve().then(() => fn(...args));

      if (timeoutMs !== undefined && timeoutMs > 0) {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timer = setTimeout(() => {
            reject(new TimeoutError(timeoutMs));
          }, timeoutMs);
        });

        resultPromise = Promise.race([resultPromise, timeoutPromise]).finally(() => {
          if (timer) clearTimeout(timer);
        });
      }

      const data = await resultPromise;
      const executionTimeMs = Number((performance.now() - startTime).toFixed(3));

      return {
        success: true,
        status: 'success',
        data,
        error: null,
        executionTimeMs,
        retriesAttempted: attempt,
      };
    } catch (err: unknown) {
      lastError = normalizeError(err);
      attempt++;

      if (attempt <= retries && retryDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  const executionTimeMs = Number((performance.now() - startTime).toFixed(3));
  const isTimeout = lastError instanceof TimeoutError;

  return {
    success: false,
    status: isTimeout ? 'timeout' : 'error',
    data: (fallback !== undefined ? fallback : null) as TReturn | null,
    error: lastError,
    executionTimeMs,
    retriesAttempted: attempt - 1,
  };
}

/**
 * Safely executes a synchronous function without async overhead.
 */
export function executeSync<TArgs extends unknown[], TReturn>(
  fn: AnyFunction<TArgs, TReturn>,
  args: TArgs = [] as unknown as TArgs,
  fallback?: TReturn,
): ExecutionResult<TReturn> {
  const startTime = performance.now();

  if (typeof fn !== 'function') {
    const err = new ValidationError(`Expected an executable function, but received: ${typeof fn}`);
    return {
      success: false,
      status: 'error',
      data: (fallback !== undefined ? fallback : null) as TReturn | null,
      error: err,
      executionTimeMs: 0,
      retriesAttempted: 0,
    };
  }

  try {
    const data = fn(...args);
    const executionTimeMs = Number((performance.now() - startTime).toFixed(3));
    return {
      success: true,
      status: 'success',
      data,
      error: null,
      executionTimeMs,
      retriesAttempted: 0,
    };
  } catch (err: unknown) {
    const executionTimeMs = Number((performance.now() - startTime).toFixed(3));
    return {
      success: false,
      status: 'error',
      data: (fallback !== undefined ? fallback : null) as TReturn | null,
      error: normalizeError(err),
      executionTimeMs,
      retriesAttempted: 0,
    };
  }
}

/**
 * Instantiates a class safely, handling constructor errors and null instances.
 */
export function instantiate<T extends object>(
  ClassConstructor: Constructor<T>,
  ...args: unknown[]
): ExecutionResult<T> {
  const startTime = performance.now();

  if (typeof ClassConstructor !== 'function') {
    return {
      success: false,
      status: 'error',
      data: null,
      error: new ValidationError(`Expected a class constructor, but received: ${typeof ClassConstructor}`),
      executionTimeMs: 0,
      retriesAttempted: 0,
    };
  }

  try {
    const instance = new ClassConstructor(...args);
    const executionTimeMs = Number((performance.now() - startTime).toFixed(3));
    return {
      success: true,
      status: 'success',
      data: instance,
      error: null,
      executionTimeMs,
      retriesAttempted: 0,
    };
  } catch (err: unknown) {
    const executionTimeMs = Number((performance.now() - startTime).toFixed(3));
    return {
      success: false,
      status: 'error',
      data: null,
      error: normalizeError(err),
      executionTimeMs,
      retriesAttempted: 0,
    };
  }
}

/**
 * Normalizes any caught item (string, null, object, Error) into a standard JavaScript Error instance.
 */
export function normalizeError(err: unknown): Error {
  if (err instanceof Error) {
    return err;
  }
  if (typeof err === 'string') {
    return new Error(err);
  }
  if (typeof err === 'object' && err !== null && 'message' in err) {
    return new Error(String((err as { message: unknown }).message));
  }
  return new Error(`Unknown rejection or error: ${JSON.stringify(err)}`);
}

