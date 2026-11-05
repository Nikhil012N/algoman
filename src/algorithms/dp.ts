/**
 * 0/1 Knapsack Problem (Dynamic Programming)
 * Returns the maximum value achievable within the given maximum capacity.
 */
export function knapsack01(
  values: readonly number[],
  weights: readonly number[],
  capacity: number,
): number {
  if (!Array.isArray(values) || !Array.isArray(weights) || capacity <= 0) return 0;
  const n = Math.min(values.length, weights.length);
  if (n === 0) return 0;

  // 1D DP array optimization
  const dp = new Array<number>(capacity + 1).fill(0);

  for (let i = 0; i < n; i++) {
    const val = values[i]!;
    const wt = weights[i]!;
    for (let w = capacity; w >= wt; w--) {
      dp[w] = Math.max(dp[w]!, dp[w - wt]! + val);
    }
  }

  return dp[capacity]!;
}

/**
 * Longest Increasing Subsequence (LIS)
 * Solved using patience sorting / binary search in O(N log N) time.
 */
export function longestIncreasingSubsequence(nums: readonly number[]): number {
  if (!Array.isArray(nums) || nums.length === 0) return 0;

  const tails: number[] = [];

  for (const x of nums) {
    let low = 0;
    let high = tails.length;

    while (low < high) {
      const mid = low + Math.floor((high - low) / 2);
      if (tails[mid]! < x) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    if (low === tails.length) {
      tails.push(x);
    } else {
      tails[low] = x;
    }
  }

  return tails.length;
}

/**
 * Maximum Subarray Sum (Kadane's Algorithm)
 * Finds the contiguous subarray which has the largest sum in O(N) time.
 */
export function maxSubarraySum(nums: readonly number[]): number {
  if (!Array.isArray(nums) || nums.length === 0) return 0;

  let currentSum = nums[0]!;
  let maxSum = nums[0]!;

  for (let i = 1; i < nums.length; i++) {
    const val = nums[i]!;
    currentSum = Math.max(val, currentSum + val);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

/**
 * Coin Change Problem (Minimum Coins Needed)
 * Returns minimum number of coins to make change for amount, or -1 if impossible.
 */
export function coinChange(coins: readonly number[], amount: number): number {
  if (amount === 0) return 0;
  if (!Array.isArray(coins) || coins.length === 0 || amount < 0) return -1;

  const dp = new Array<number>(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (const coin of coins) {
    if (coin <= 0) continue;
    for (let x = coin; x <= amount; x++) {
      dp[x] = Math.min(dp[x]!, dp[x - coin]! + 1);
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount]!;
}

