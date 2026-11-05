/**
 * Greatest Common Divisor (GCD) using Euclidean Algorithm.
 * Handles negative numbers and zeros.
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Least Common Multiple (LCM).
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.trunc(a * (b / gcd(a, b))));
}

/**
 * Sieve of Eratosthenes.
 * Computes all prime numbers up to n in O(N log log N) time.
 */
export function sieveOfEratosthenes(n: number): number[] {
  if (!Number.isFinite(n) || n < 2) return [];

  const limit = Math.floor(n);
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;

  for (let p = 2; p * p <= limit; p++) {
    if (isPrime[p] === 1) {
      for (let i = p * p; i <= limit; i += p) {
        isPrime[i] = 0;
      }
    }
  }

  const primes: number[] = [];
  for (let p = 2; p <= limit; p++) {
    if (isPrime[p] === 1) primes.push(p);
  }

  return primes;
}

/**
 * Modular Exponentiation: computes (base^exp) % mod in O(log exp) time.
 * Prevents intermediate integer overflow using BigInt arithmetic.
 */
export function modularExponentiation(base: number, exp: number, mod: number): number {
  if (mod <= 0) throw new RangeError('Modulus must be positive non-zero');
  if (exp < 0) throw new RangeError('Negative exponent not supported in modular exponentiation');

  let res = 1n;
  let b = BigInt(base) % BigInt(mod);
  let e = BigInt(exp);
  const m = BigInt(mod);

  if (b < 0n) b += m;

  while (e > 0n) {
    if (e % 2n === 1n) {
      res = (res * b) % m;
    }
    b = (b * b) % m;
    e /= 2n;
  }

  return Number(res);
}

/**
 * Fast Fourier Transform (Cooley-Tukey Radix-2 FFT) for polynomial multiplication / signal processing.
 * Accepts real & imaginary arrays whose length is a power of 2.
 */
export function fft(
  real: readonly number[],
  imag: readonly number[] = [],
  inverse = false,
): { real: number[]; imag: number[] } {
  const n = real.length;
  if ((n & (n - 1)) !== 0 || n === 0) {
    throw new Error('FFT array length must be a non-zero power of 2');
  }

  const outReal = [...real];
  const outImag = imag.length === n ? [...imag] : new Array<number>(n).fill(0);

  // Bit reversal permutation
  let j = 0;
  for (let i = 0; i < n - 1; i++) {
    if (i < j) {
      [outReal[i], outReal[j]] = [outReal[j]!, outReal[i]!];
      [outImag[i], outImag[j]] = [outImag[j]!, outImag[i]!];
    }
    let k = n >> 1;
    while (k <= j) {
      j -= k;
      k >>= 1;
    }
    j += k;
  }

  // Cooley-Tukey computation
  for (let len = 2; len <= n; len <<= 1) {
    const half = len >> 1;
    const angle = (2 * Math.PI) / len * (inverse ? -1 : 1);
    const wStepReal = Math.cos(angle);
    const wStepImag = Math.sin(angle);

    for (let i = 0; i < n; i += len) {
      let wReal = 1;
      let wImag = 0;

      for (let k = 0; k < half; k++) {
        const uReal = outReal[i + k]!;
        const uImag = outImag[i + k]!;

        const vReal = outReal[i + k + half]! * wReal - outImag[i + k + half]! * wImag;
        const vImag = outReal[i + k + half]! * wImag + outImag[i + k + half]! * wReal;

        outReal[i + k] = uReal + vReal;
        outImag[i + k] = uImag + vImag;
        outReal[i + k + half] = uReal - vReal;
        outImag[i + k + half] = uImag - vImag;

        const nextWReal = wReal * wStepReal - wImag * wStepImag;
        const nextWImag = wReal * wStepImag + wImag * wStepReal;
        wReal = nextWReal;
        wImag = nextWImag;
      }
    }
  }

  if (inverse) {
    for (let i = 0; i < n; i++) {
      outReal[i] = outReal[i]! / n;
      outImag[i] = outImag[i]! / n;
    }
  }

  return { real: outReal, imag: outImag };
}

